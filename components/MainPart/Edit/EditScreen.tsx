import { Circles } from 'react-loader-spinner'
import { useState, useRef } from 'react'
import toast, { Toaster } from 'react-hot-toast'

import { useTypedSelector } from '../../../app/hooks'
import styles from './styles'
import Avatar from '../../Utils/Profile/Avatar'
import {
  ISex,
  Sex,
  MaritalStatus,
  IMaritalStatus,
} from '../../../types/profile/profile-type'
import { profileApi } from '../../../http/profile/profile-api'

interface IImage {
  file: File
  url: string
}

const EditScreen = () => {
  const { profile } = useTypedSelector((store) => store.profileReducer)

  const [name, setName] = useState<string>('')
  const [secondName, setSecondName] = useState<string>('')
  const [birthDate, setBirthDate] = useState<string>(profile?.birthDate || '')
  const [from, setFrom] = useState<string>('')
  const [avatar, setAvatar] = useState<IImage>({} as IImage)
  const [sex, setSex] = useState<string>(ISex.NO)
  const [maritalStatus, setMaritalStatus] = useState<string>(IMaritalStatus.NO)
  const [loading, setLoading] = useState<boolean>(false)

  const avatarPickerRef = useRef<HTMLInputElement>(null)

  const addImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const url = URL.createObjectURL(e.target.files[0])
      setAvatar({
        file: e.target.files[0],
        url,
      })
    }
  }
  const update = async () => {
    if (
      !profile ||
      (name &&
        secondName &&
        sex &&
        from &&
        birthDate &&
        maritalStatus &&
        avatar)
    )
      return

    setLoading(true)

    const formData = new FormData()

    formData.append('id', profile.id.toString())
    if (name) {
      formData.append('name', name)
    }
    if (secondName) {
      formData.append('secondName', secondName)
    }
    if (sex) {
      formData.append('sex', sex)
    }
    if (from) {
      formData.append('from', from)
    }
    if (birthDate) {
      formData.append('birthDate', birthDate)
    }
    if (maritalStatus) {
      formData.append('maritalStatus', maritalStatus)
    }
    if (avatar.file) {
      formData.append('avatar', avatar.file)
    }

    toast
      .promise(profileApi.update(formData), {
        loading: 'Updating profile...',
        success: <b>Profile Successfully Updated</b>,
        error: <b>Error updating profile</b>,
      })
      .then(() => setLoading(false))
  }

  if (!profile) return <Circles />

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputContainer}>
        <Toaster position="top-center" reverseOrder={false} />
        <span className={styles.text}>Name: </span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          className={styles.input}
          placeholder={`${profile.name}`}
        />
      </div>
      <div className={styles.inputContainer}>
        <span className={styles.text}>Second Name: </span>
        <input
          value={secondName}
          onChange={(e) => setSecondName(e.target.value)}
          type="text"
          className={styles.input}
          placeholder={`${profile.secondName}`}
        />
      </div>
      <div className={styles.inputContainer}>
        <span className={styles.text}>Sex: </span>
        <select
          onChange={(e) => setSex(e.target.value)}
          className={styles.select}
          defaultValue={profile.sex}
        >
          {Sex.map((sex) => (
            <option className={styles.option} key={sex}>
              {sex}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.inputContainer}>
        <span className={styles.text}>You from: </span>
        <input
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          type="text"
          className={styles.input}
          placeholder={profile.from ? `${profile.from}` : ''}
        />
      </div>
      <div className={styles.inputContainer}>
        <span className={styles.text}>Birth date: </span>
        <input
          onChange={(e) => setBirthDate(e.target.value)}
          value={birthDate}
          className={styles.input}
          type="date"
        />
      </div>
      <div className={styles.inputContainer}>
        <span className={styles.text}>Marital status: </span>
        <select
          onChange={(e) => setMaritalStatus(e.target.value)}
          className={styles.select}
          defaultValue={profile.maritalStatus}
        >
          {MaritalStatus.map((status) => (
            <option className={styles.option} key={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.pickerContainer}>
        {avatar.url ? (
          <img className={styles.selectedAvatar} src={avatar.url} />
        ) : (
          <Avatar propStyles={'w-24 h-24'} />
        )}
        <input type="file" hidden ref={avatarPickerRef} onChange={addImage} />
        <button
          onClick={() => avatarPickerRef.current?.click()}
          className={styles.upload}
        >
          Upload Avatar
        </button>
        <button disabled={loading} onClick={update} className={styles.update}>
          Save Changes
        </button>
      </div>
    </div>
  )
}

export default EditScreen
