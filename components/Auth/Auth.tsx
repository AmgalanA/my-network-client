import Image from 'next/image'

import styles from './styles'
import Mountain from '../../assets/images/mountain.jpg'
import { useState } from 'react'
import Login from './Login'
import Register from './Register'

const Auth = () => {
  const [isShowingLogin, setIsShowingLogin] = useState(false)

  return (
    <div className={styles.wrapper}>
      <div className={styles.backgroundImage}>
        <Image layout="fill" objectFit="cover" src={Mountain} />
      </div>
      {isShowingLogin ? (
        <Login setIsShowingLogin={setIsShowingLogin} />
      ) : (
        <Register setIsShowingLogin={setIsShowingLogin} />
      )}
    </div>
  )
}

export default Auth
