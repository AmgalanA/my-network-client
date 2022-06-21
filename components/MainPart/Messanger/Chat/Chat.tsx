import { useRouter } from 'next/router'
import TimeAgo from 'timeago-react'
import { ChatState } from '../../../../types/chat/chat-type'
import Avatar from '../../../Utils/Profile/Avatar'
import styles from './styles'

interface IProp {
  chat: ChatState
}

const Chat = ({ chat }: IProp) => {
  const { push } = useRouter()

  return (
    <div className={styles.wrapper}>
      <img
        className={styles.chatImage}
        src={`${process.env.NEXT_PUBLIC_BASE_URL}/${chat.chat.avatar}`}
        alt="avatar"
      />
      <div className={styles.chatInfoContainer}>
        <h1
          onClick={() => push(`/messanger/chats/chat/${chat.chat.id}`)}
          className={styles.name}
        >
          {chat.chat.name}
        </h1>

        {chat.lastMessage.message ? (
          <div className={styles.lastMessageContainer}>
            <Avatar
              propStyles={styles.senderAvatar}
              profile={chat.lastMessage.sender}
            />
            <h2 className={styles.lastMessageText}>
              {chat.lastMessage.message.text}
            </h2>
            <TimeAgo
              datetime={chat.lastMessage.message.sentAt}
              className={styles.sentAt}
            />
          </div>
        ) : (
          <h1 className={styles.noMessages}>No Messages</h1>
        )}
      </div>
    </div>
  )
}

export default Chat
