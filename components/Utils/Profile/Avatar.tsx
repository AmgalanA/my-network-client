import Image from 'next/image'

import { useTypedSelector } from '../../../app/hooks'
import emptyAvatar from '../../../assets/images/emptyAvatar.jpg'
import { IProfile } from '../../../types/profile/profile-type'
import styles from './styles'

interface IProp {
  profile?: IProfile
  propStyles?: string
}

const Avatar = ({ propStyles, profile }: IProp) => {
  const loggedInProfile = useTypedSelector(
    (store) => store.profileReducer.profile
  )

  if (profile && profile?.avatar) {
    return (
      <img
        className={`${propStyles} ${styles.avatar}`}
        src={`${process.env.NEXT_PUBLIC_BASE_URL}/${profile.avatar}`}
      />
    )
  } else if (loggedInProfile && loggedInProfile.avatar) {
    return (
      <img
        className={`${propStyles} ${styles.avatar}`}
        src={`${process.env.NEXT_PUBLIC_BASE_URL}/${loggedInProfile.avatar}`}
      />
    )
  } else {
    return (
      <Image
        objectFit="cover"
        layout={`responsive`}
        className="rounded-full"
        src={emptyAvatar}
        alt="avatar"
      />
    )
  }
}

export default Avatar
