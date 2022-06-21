import { MdOutlineArrowBackIosNew } from 'react-icons/md'
import { useRouter } from 'next/router'

import { useTypedSelector } from '../../../../../app/hooks'
import styles from './styles'

import { AiOutlinePlus, AiFillEdit } from 'react-icons/ai'
import { IoIosArrowUp } from 'react-icons/io'
import { IoCloseOutline } from 'react-icons/io5'

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
import { CgCloseR } from 'react-icons/cg'
import { removeMessage } from '../../../../../slices/conversation/reply-message/replyMessageSlice'
import { ChatApi } from '../../../../../http/chat/chat-api'
import { ChatPathTypes } from '../../../../../path-types/chat/path-types'
import { IChat } from '../../../../../types/chat/chat-type'
import { chatActionCreators } from '../../../../../slices/chat/action-creators'
import { setIsShowingChatModal } from '../../../../../slices/toggle/toggleSlice'
import ChatModal from '../ChatModal/ChatModal'
import ChatMessage from '../ChatMessage/ChatMessage'

const ChatScreen = () => {
  let socket: Socket<DefaultEventsMap, DefaultEventsMap>

  const { back, push } = useRouter()
  const dispatch = useDispatch()

  const { chat } = useTypedSelector((store) => store.chatReducer)
  const { profile } = useTypedSelector((store) => store.profileReducer)
  const { isShowingChatModal } = useTypedSelector(
    (store) => store.toggleReducer
  )

  const [text, setText] = useState<string>('')
  const [files, setFiles] = useState<IImageFile[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [isTyping, setIsTyping] = useState<boolean>(false)

  const filePickerRef = useRef<HTMLInputElement>(null)

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

    const formData = new FormData()
    formData.append('text', text)
    formData.append('senderId', profile.id.toString())
    formData.append('chatId', chat.chat.id.toString())
    if (files.length > 0) {
      files.map((file) => formData.append('files', file.file))
    }

    await ChatApi.sendMessage(formData)
      .then(() => {
        if (!socket) {
          socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}/chat`)
        }

        socket.emit(ChatPathTypes.SEND_MESSAGE, chat.chat.id)
        socket.emit(ChatPathTypes.UPDATE_CHATS, profile.id)
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setText('')
        if (files.length > 0) {
          setFiles([])
        }
      })
  }

  const handleFocus = () => {}
  const handleBlur = () => {}

  useEffect(() => {
    if (profile) {
      socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}/chat`)

      socket.on('connect', () => {
        socket.emit(ChatPathTypes.JOIN_ROOM, chat.chat.id)
      })

      socket.on(ChatPathTypes.GET_CHAT, (chat: IChat) => {
        dispatch(chatActionCreators.fetchChat(chat.id))
      })

      return () => {
        socket.on('connect', () => {
          socket.emit(ChatPathTypes.LEAVE_ROOM, chat.chat.id)
        })
      }
    }
  }, [profile])

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {isShowingChatModal && <ChatModal />}

        <header className={styles.header}>
          <div onClick={() => back()} className={styles.backContainer}>
            <MdOutlineArrowBackIosNew className={styles.backIcon} />
            <span className={styles.backText}>Back</span>
          </div>
          <div className={styles.infoContainer}>
            <h1 className={styles.name}>{chat.chat.name}</h1>
            <h2 className={styles.members}>{chat.members.length} members</h2>
          </div>
          <img
            onClick={() => dispatch(setIsShowingChatModal(true))}
            className={styles.avatar}
            src={`${process.env.NEXT_PUBLIC_BASE_URL}/${chat.chat.avatar}`}
            alt="chat-image"
          />
        </header>
        <div className={styles.messagesContainer}>
          {chat.messages.map(
            (message) => message.message && <ChatMessage message={message} />
          )}
          {chat.invites.map((invite) => (
            <h1 className={styles.inviteText}>
              <span
                onClick={() => push(`/page/${invite.fromId}`)}
                className={`${styles.name} mx-2 text-gray-400`}
              >
                {invite.fromName}
              </span>
              invited
              <span
                onClick={() => push(`/page/${invite.toId}`)}
                className={`${styles.name} mx-2 text-gray-400`}
              >
                {invite.toName}
              </span>
            </h1>
          ))}
          {chat.leavings.map((leaving) => {
            ;<h1 className={styles.leavingText}>
              <span
                onClick={() => push(`/page/${leaving.profileId}`)}
                className={styles.name}
              >
                {leaving.name}
              </span>
              left a chat
            </h1>
          })}
        </div>
        <div className={styles.formContainer}>
          <form onSubmit={sendMessage} className={styles.form}>
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

export default ChatScreen
