import { AiOutlinePlus, AiFillEdit } from 'react-icons/ai'
import { IoIosArrowUp } from 'react-icons/io'
import { IoCloseOutline } from 'react-icons/io5'

import { useTypedSelector } from '../../../../../app/hooks'
import styles from './styles'
import Avatar from '../../../../Utils/Profile/Avatar'
import { useEffect, useRef, useState } from 'react'
import { IImageFile } from '../../../../../types/file/file-type'
import { messageApi } from '../../../../../http/message/message-api'
import { io, Socket } from 'socket.io-client'
import { DefaultEventsMap } from '@socket.io/component-emitter'
import { ConversationPathTypes } from '../../../../../path-types/path-types'
import Message from '../../Message/Message'
import { useDispatch } from 'react-redux'
import { conversationActionCreators } from '../../../../../slices/conversation/action-creators'
import { IConversation } from '../../../../../types/conversation/conversation-type'
import { profileUtils } from '../../../../../utils/profile/profile-utils'
import { Circles } from 'react-loader-spinner'
import { useRouter } from 'next/router'
import { CgCloseR } from 'react-icons/cg'
import { removeMessage } from '../../../../../slices/conversation/reply-message/replyMessageSlice'

const ConversationScreen = () => {
  let socket: Socket<DefaultEventsMap, DefaultEventsMap>

  const dispatch = useDispatch()

  const { push } = useRouter()

  const { conversation } = useTypedSelector(
    (store) => store.conversationReducer
  )
  const { profile } = useTypedSelector((store) => store.profileReducer)
  const { online } = useTypedSelector((store) => store.onlineReducer)
  const { message } = useTypedSelector((store) => store.replyMessageReducer)

  const [text, setText] = useState<string>('')
  const [files, setFiles] = useState<IImageFile[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [isTyping, setIsTyping] = useState<boolean>(false)

  const filePickerRef = useRef<HTMLInputElement>(null)
  const endOfMessagesRef = useRef<HTMLDivElement>(null)

  const addFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = {
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      }

      setFiles([...files, file])
    }
  }

  const removeFile = (url: string) => {
    setFiles(files.filter((file) => file.url !== url))
  }

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if ((!text && files.length === 0) || !profile || loading) return
    setLoading(true)

    const formData = new FormData()
    formData.append('text', text)
    formData.append('senderId', profile.id.toString())
    formData.append('conversationId', conversation.conversation.id.toString())
    if (message.message) {
      formData.append('messageId', message.message.id.toString())
    }
    if (files.length > 0) {
      files.map((file) => formData.append('files', file.file))
    }

    await messageApi
      .send(formData)
      .then((res) => {
        if (!socket) {
          socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}/conversation`)
        }

        const payload = {
          id: conversation.conversation.id,
          receiverId: conversation.receiver.id,
        }

        socket.emit(ConversationPathTypes.SEND_MESSAGE, payload)
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setText('')
        setLoading(false)
        scrollToBottom()
        if (files.length > 0) {
          setFiles([])
        }
        if (message) {
          dispatch(removeMessage())
        }
      })
  }

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    })
  }

  const handleFocus = () => {
    if (!profile) return

    if (!socket) {
      socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}/conversation`)
    }

    const payload = {
      id: conversation.conversation.id,
      currentProfileId: profile.id,
    }

    socket.emit(ConversationPathTypes.ADD_TYPING, payload)
  }
  const handleBlur = () => {
    if (!profile) return

    if (!socket) {
      socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}/conversation`)
    }

    const payload = {
      id: conversation.conversation.id,
      currentProfileId: profile.id,
    }

    socket.emit(ConversationPathTypes.REMOVE_TYPING, payload)
  }

  useEffect(() => {
    socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}/conversation`)

    socket.on('connect', () => {
      socket.emit('join-room', conversation.conversation.id)
    })

    socket.on(ConversationPathTypes.GET_TYPING, (data: number[]) => {
      setIsTyping(data.includes(conversation.receiver.id))
    })

    socket.on(
      ConversationPathTypes.GET_CONVERSATION,
      async (conversation: IConversation) => {
        if (!profile) return

        const payload = {
          id: conversation.id,
          currentProfileId: profile.id,
        }
        dispatch(conversationActionCreators.fetchConversation(payload))
      }
    )

    return () => {
      socket.on('connect', () => {
        socket.emit(
          ConversationPathTypes.LEAVE_ROOM,
          conversation.conversation.id
        )
      })
    }
  }, [profile])

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.avatarContainer}>
            <Avatar profile={conversation.receiver} />
            <div
              className={`${
                profileUtils.checkIfOnline(online, conversation.receiver.id)
                  ? 'bg-green-400'
                  : 'bg-red-600'
              } ${styles.onlineDot}`}
            />
          </div>
          <div className={styles.receiverContainer}>
            <h1
              onClick={() => push(`/page/${conversation.receiver.id}`)}
              className={styles.name}
            >
              {conversation.receiver.name} {conversation.receiver.secondName}
            </h1>
            {profileUtils.checkIfOnline(online, conversation.receiver.id)
              ? 'Online'
              : 'Offline'}
          </div>
        </header>
        {/* Messages */}
        <div className={styles.messagesContainer}>
          {conversation.messages.map(
            (message) =>
              message.message && (
                <Message key={message.message.id} message={message} />
              )
          )}
          <div className="mb-10" ref={endOfMessagesRef} />
        </div>

        <div className={styles.formContainer}>
          <form onSubmit={sendMessage} className={styles.form}>
            {isTyping && (
              <div className={styles.typingContainer}>
                <AiFillEdit className={styles.typingIcon} />
                <h1 className={styles.typingText}>
                  <span className={styles.typingName}>
                    {conversation.receiver.name}
                  </span>{' '}
                  is typing...
                </h1>
              </div>
            )}
            <div
              onClick={() => filePickerRef.current?.click()}
              className={styles.add}
            >
              <input
                type="file"
                accept="image/*"
                hidden
                ref={filePickerRef}
                onChange={addFile}
              />
              <AiOutlinePlus />
            </div>
            {message.message && (
              <div className={styles.answerContainer}>
                <h1 className={styles.answerName}>
                  {message.sender.name} {message.sender.secondName}
                </h1>
                <CgCloseR
                  onClick={() => dispatch(removeMessage())}
                  className={styles.closeAnswerIcon}
                />
                <h2 className={styles.answerText}>{message.message.text}</h2>
              </div>
            )}
            <input
              value={text}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={(e) => setText(e.target.value)}
              className={styles.input}
              type="text"
              placeholder="Type something..."
            />
            <button type="submit" className={styles.sendContainer}>
              <div className={styles.sendIconContainer}>
                <IoIosArrowUp className={` ${styles.sendIcon}`} />
              </div>
            </button>
          </form>
          {files.length > 0 && (
            <div className={styles.imagesContainer}>
              {files.map((file) => (
                <div className={styles.imageContainer} key={file.url}>
                  <IoCloseOutline
                    onClick={() => removeFile(file.url)}
                    className={styles.closeIcon}
                  />
                  <img className={styles.image} src={file.url} alt="url" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ConversationScreen
