import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import { useDispatch } from 'react-redux'

import Avatar from '../../Utils/Profile/Avatar'
import { useTypedSelector } from '../../../app/hooks'
// import { useAuthRedirect } from '../../../utils/auth/useAuthRedirect'
import emptyAvatar from '../../../assets/images/emptyAvatar.jpg'
import { profileActionCreators } from '../../../slices/profile/action-creators'

import styles from './styles'

const Header = () => {
  const dispatch = useDispatch()
  const { push } = useRouter()

  const { profile } = useTypedSelector((store) => store.profileReducer)

  const [isShowingOptions, setIsShowingOptions] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!profile) push('/')
  }, [profile, push])

  const logout = () => {
    if (!profile || loading) return
    setLoading(true)

    dispatch(profileActionCreators.logoutApi())

    setLoading(false)
  }

  return (
    <header className={styles.wrapper}>
      <div className={styles.searchContainer}>
        <AiOutlineSearch className={styles.searchIcon} />
        <input
          className={styles.input}
          type="text"
          placeholder="Search for something"
        />
      </div>
      {/* <ul className={styles.list}>
        <li className={styles.listItem}>Home</li>
        <li className={styles.listItem}>Messaging</li>
        <li className={styles.listItem}>Notifications</li>
      </ul> */}
      {/*62*/}
      <div
        onClick={() => setIsShowingOptions(!isShowingOptions)}
        className={styles.avatar}
      >
        {/* <Image
          onClick={() => setIsShowingOptions(!isShowingOptions)}
          objectFit="cover"
          layout="responsive"
          className="rounded-full"
          src={
            profile?.avatar
              ? `${process.env.NEXT_PUBLIC_BASE_URL}/${profile.avatar}`
              : emptyAvatar
          }
          alt="avatar"
        /> */}
        <Avatar />
        {isShowingOptions && (
          <div className={styles.options}>
            <button
              onClick={logout}
              className={styles.optionsButton}
              type="button"
            >
              Logout
            </button>
            <button
              onClick={() => profile && push(`/edit/${profile.id}`)}
              className={styles.optionsButton}
              type="button"
            >
              Edit
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
