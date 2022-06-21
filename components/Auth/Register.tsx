import { Dispatch, SetStateAction, useState } from 'react'
import {
  AiOutlineMail,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from 'react-icons/ai'
import { RiAccountPinBoxLine } from 'react-icons/ri'
import { useDispatch } from 'react-redux'
import { profileActionCreators } from '../../slices/profile/action-creators'

import styles from './styles'

interface IProp {
  setIsShowingLogin: Dispatch<SetStateAction<boolean>>
}

const Register = ({ setIsShowingLogin }: IProp) => {
  const dispatch = useDispatch()

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [secondName, setSecondName] = useState<string>('')
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState(false)

  const register = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email || !password || !name || !secondName || loading) return

    const payload = {
      email,
      password,
      name,
      secondName,
    }

    dispatch(profileActionCreators.registerApi(payload))
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Create new account
        <span className={styles.dot}>.</span>
      </h1>
      <h2 className={styles.alreadyAMemberText}>
        Already a member?{' '}
        <span
          onClick={() => setIsShowingLogin(true)}
          className={styles.loginText}
        >
          Log In
        </span>
      </h2>

      <form onSubmit={register} className={styles.form}>
        <div className={styles.nameInputContainer}>
          <div className={`md:flex-[0.45] ${styles.inputContainer}`}>
            <label className={styles.label} htmlFor="first-name">
              First Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
              id="first-name"
              placeholder="John"
              type="text"
            />
            <RiAccountPinBoxLine className={styles.icon} />
          </div>
          <div className={`md:flex-[0.45] ${styles.inputContainer}`}>
            <label className={styles.label} htmlFor="last-name">
              Last Name
            </label>
            <input
              value={secondName}
              onChange={(e) => setSecondName(e.target.value)}
              className={styles.input}
              id="last-name"
              placeholder="Doe"
              type="text"
            />
            <RiAccountPinBoxLine className={styles.icon} />
          </div>
        </div>
        <div className={styles.inputContainer}>
          <label className={styles.label} htmlFor="email">
            Email
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            id="email"
            type="email"
            placeholder="johndoe@gmail.com"
          />
          <AiOutlineMail className={styles.icon} />
        </div>
        <div className={styles.inputContainer}>
          <label className={styles.label} htmlFor="password">
            Password
          </label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            id="password"
            placeholder="e.g. 123456"
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
          disabled={!email || !password || !name || !secondName || loading}
          className={styles.button}
          type="submit"
        >
          Create Account
        </button>
      </form>
    </div>
  )
}

export default Register
