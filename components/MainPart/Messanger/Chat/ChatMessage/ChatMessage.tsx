import TimeAgo from 'timeago-react'

import { useTypedSelector } from '../../../../../app/hooks'
import { IChatMessageSender } from '../../../../../types/chat/chat-messages/chat-message-type'
import Avatar from '../../../../Utils/Profile/Avatar'
import styles from './styles'

interface IProp {
  message: IChatMessageSender
}

const ChatMessage = ({ message }: IProp) => {
  const { profile } = useTypedSelector((store) => store.profileReducer)

  return (
    <div className={styles.wrapper}>
      <div
        className={`${
          profile?.id === message.sender.id ? 'bg-[#197bf4]' : 'bg-gray-500'
        } ${styles.messageContainer}`}
      >
        <header className={styles.header}>
          <div className={styles.avatar}>
            <Avatar profile={message.sender} />
          </div>
          <h1 className={styles.senderName}>
            {message.sender.id === profile?.id
              ? 'You'
              : `${message.sender.name} ${message.sender.secondName}`}
          </h1>
        </header>
        <h2 className={styles.text}>{message.message.text}</h2>
        <TimeAgo datetime={message.message.sentAt} className={styles.sentAt} />
      </div>
    </div>
  )
}

export default ChatMessage
