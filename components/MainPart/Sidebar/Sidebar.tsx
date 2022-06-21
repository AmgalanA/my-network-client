import Image from 'next/image'
import { useRouter } from 'next/router'
import { FiMessageCircle } from 'react-icons/fi'
import { AiOutlineHome } from 'react-icons/ai'
import { IoNewspaperOutline } from 'react-icons/io5'
import { BiSearchAlt2 } from 'react-icons/bi'

import emptyAvatar from '../../../assets/images/emptyAvatar.jpg'
import { useTypedSelector } from '../../../app/hooks'
import styles from './styles'
import Avatar from '../../Utils/Profile/Avatar'

const Sidebar = () => {
  const { push } = useRouter()

  const { profile } = useTypedSelector((store) => store.profileReducer)

  if (!profile) return <div></div>

  return (
    <div className={styles.wrapper}>
      <div className={styles.profileContainer}>
        <div className={styles.avatar}>
          <Avatar />
        </div>
        <h1 className={styles.name}>
          {profile.name} {profile.secondName}
        </h1>
      </div>
      <ul className={styles.list}>
        <li
          onClick={() => push(`/page/${profile.id}`)}
          className={styles.listItem}
        >
          <AiOutlineHome className={styles.icon} /> Home Feed
        </li>
        <li
          onClick={() => push(`/messanger/${profile.id}`)}
          className={styles.listItem}
        >
          <FiMessageCircle className={styles.icon} />
          Messages
        </li>
        <li onClick={() => push('/')} className={styles.listItem}>
          <IoNewspaperOutline className={styles.icon} />
          News
        </li>
        <li className={styles.listItem}>
          <BiSearchAlt2 className={styles.icon} />
          Search
        </li>
      </ul>
    </div>
  )
}

export default Sidebar
