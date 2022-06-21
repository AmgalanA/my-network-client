import TimeAgo from 'timeago-react'
import { useTypedSelector } from '../../../../../../app/hooks'
import { IProfile } from '../../../../../../types/profile/profile-type'
import Avatar from '../../../../../Utils/Profile/Avatar'
import styles from './styles'

interface IProp {
  member: IProfile
}

const Member = ({ member }: IProp) => {
  const { online } = useTypedSelector((store) => store.onlineReducer)
  const { chat } = useTypedSelector((store) => store.chatReducer)

  return (
    <div className={styles.wrapper}>
      <Avatar propStyles={styles.avatar} profile={member} />
      <div className={styles.memberInfo}>
        <h1 className={styles.name}>
          {member.name} {member.secondName}
        </h1>
        <span className={styles.lastSeen}>
          {online.includes(member.id) ? (
            'Online'
          ) : (
            <TimeAgo datetime={member.lastSeen} />
          )}
        </span>
      </div>
      {member.id === chat.chat.creatorId && (
        <h2 className={styles.chatFounder}>Chat Founder</h2>
      )}
    </div>
  )
}

export default Member
