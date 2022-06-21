import { useRouter } from 'next/router'
import TimeAgo from 'timeago-react'
import { ConversationState } from '../../../../types/conversation/conversation-type'
import Avatar from '../../../Utils/Profile/Avatar'
import styles from './styles'

interface IProp {
  conversation: ConversationState
}

const Conversation = ({ conversation }: IProp) => {
  const { push } = useRouter()

  return (
    <div
      onClick={() =>
        push(`/messanger/conversation/${conversation.conversation.id}`)
      }
      className={styles.wrapper}
    >
      <Avatar
        propStyles={styles.receiverAvatar}
        profile={conversation.receiver}
      />
      <div className={styles.container}>
        <header className={styles.messageHeader}>
          <h1 className={styles.name}>
            {conversation.receiver.name} {conversation.receiver.secondName}
          </h1>
          <TimeAgo
            className={styles.sentAt}
            datetime={conversation.lastMessage.message.sentAt}
          />
        </header>
        <div className={styles.messageContainer}>
          <Avatar propStyles={styles.avatar} />
          <h2 className={styles.text}>
            {conversation.lastMessage.message.text}
          </h2>
        </div>
      </div>
    </div>
  )
}

export default Conversation
