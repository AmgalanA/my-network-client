import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { io } from 'socket.io-client'
import { IoAddOutline } from 'react-icons/io5'

import { useTypedSelector } from '../../../app/hooks'
import { ConversationPathTypes } from '../../../path-types/path-types'
import { messangerActionCreators } from '../../../slices/messanger/action-creators'
import Conversation from './Conversation/Conversation'
import styles from './styles'
import { setIsShowingCreateChatModal } from '../../../slices/toggle/toggleSlice'
import CreateChatModal from '../Modals/Messanger/CreateChatModal/CreateChatModal'
import Chat from './Chat/Chat'
import { ChatPathTypes } from '../../../path-types/chat/path-types'

const Messanger = () => {
  const dispatch = useDispatch()

  const { push, pathname } = useRouter()

  const { conversations, chats } = useTypedSelector(
    (store) => store.messangerReducer
  )
  const { profile } = useTypedSelector((store) => store.profileReducer)
  const { isShowingCreateChatModal } = useTypedSelector(
    (store) => store.toggleReducer
  )

  useEffect(() => {
    const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}/conversation`)

    const chatSocket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}/chat`)

    socket.on(ConversationPathTypes.UPDATE_CONVERSATIONS, () => {
      if (profile) {
        dispatch(messangerActionCreators.fetchConversations(profile.id))
      }
    })

    chatSocket.on(ChatPathTypes.UPDATE_CHAT, () => {
      if (profile) {
        dispatch(messangerActionCreators.fetchChats(profile.id))
      }
    })

    socket.on('connect', () => {
      if (profile) {
        socket.emit(ConversationPathTypes.JOIN_ROOM, profile.id)
        chatSocket.emit(ChatPathTypes.JOIN_ROOM, profile.id)
      }
    })
  }, [profile])

  if (!profile) return <div></div>

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        {isShowingCreateChatModal && <CreateChatModal />}

        <ul className={styles.list}>
          <li
            onClick={() => push(`/messanger/${profile.id}`)}
            className={styles.listItem}
          >
            Conversations
          </li>
          <li
            onClick={() => push(`/messanger/chats/${profile.id}`)}
            className={styles.listItem}
          >
            Group Chats
          </li>
        </ul>
        {pathname === '/messanger/chats/[id]' && (
          <div
            onClick={() => dispatch(setIsShowingCreateChatModal(true))}
            className={styles.createChatContainer}
          >
            <IoAddOutline className={styles.createChatIcon} />
          </div>
        )}
      </header>
      {pathname === '/messanger/[id]' ? (
        <div className={styles.conversationsContainer}>
          {conversations.map((conversation) => (
            <Conversation
              key={conversation.conversation.id}
              conversation={conversation}
            />
          ))}
        </div>
      ) : (
        <div className={styles.chatsContainer}>
          {chats.map((chat) => (
            <Chat key={chat.chat.id} chat={chat} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Messanger
