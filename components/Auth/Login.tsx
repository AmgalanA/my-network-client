import { Dispatch, SetStateAction, useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineMail,
} from 'react-icons/ai'

import styles from './styles'
import { profileActionCreators } from '../../slices/profile/action-creators'

interface IProp {
  setIsShowingLogin: Dispatch<SetStateAction<boolean>>
}

const Login = ({ setIsShowingLogin }: IProp) => {
  const dispatch = useDispatch()

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email || !password || loading) return

    const payload = {
      email,
      password,
    }

    dispatch(profileActionCreators.loginApi(payload))
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Sign in to account
        <span className={styles.dot}>.</span>
      </h1>
      <h2 className={styles.alreadyAMemberText}>
        Don't have an account?{' '}
        <span
          onClick={() => setIsShowingLogin(false)}
          className={styles.loginText}
        >
          Sign In
        </span>
      </h2>

      <form onSubmit={login} className={styles.form}>
        <div className={styles.inputContainer}>
          <label className={styles.label} htmlFor="email">
            Email
          </label>
          <input
            placeholder="johndoe@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            id="email"
            type="email"
          />
          <AiOutlineMail className={styles.icon} />
        </div>
        <div className={styles.inputContainer}>
          <label className={styles.label} htmlFor="password">
            Password
          </label>
          <input
            placeholder="e.g. 123456"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            id="password"
            type={`${isPasswordVisible ? 'text' : 'password'}`}
          />
          {isPasswordVisible ? (
            <AiOutlineEye
              className={`cursor-pointer ${styles.icon}`}
              onClick={() => setIsPasswordVisible(false)}
            />
          ) : (
            <AiOutlineEyeInvisible
              className={`cursor-pointer ${styles.icon}`}
              onClick={() => setIsPasswordVisible(true)}
            />
          )}
        </div>
        <button
          disabled={!email || !password || loading}
          className={styles.button}
          type="submit"
        >
          Login
        </button>
      </form>
    </div>
  )
}

export default Login
