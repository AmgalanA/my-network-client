import { IoCloseOutline } from 'react-icons/io5'
import { AiOutlineUpload } from 'react-icons/ai'

import styles from './styles'
import { useRef, useState } from 'react'
import { IImageFile } from '../../../../../types/file/file-type'
import { ChatApi } from '../../../../../http/chat/chat-api'
import { useTypedSelector } from '../../../../../app/hooks'
import { useDispatch } from 'react-redux'
import { setIsShowingCreateChatModal } from '../../../../../slices/toggle/toggleSlice'

const CreateChatModal = () => {
  const dispatch = useDispatch()

  const { profile } = useTypedSelector((store) => store.profileReducer)

  const avatarPickerRef = useRef<HTMLInputElement>(null)

  const [avatar, setAvatar] = useState<IImageFile>({} as IImageFile)
  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')

  const addAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const url = URL.createObjectURL(e.target.files[0])

      setAvatar({
        file: e.target.files[0],
        url,
      })
    }
  }

  const createGroup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!name || !description || !avatar.file || !profile) return

    const formData = new FormData()

    formData.append('name', name)
    formData.append('description', description)
    formData.append('avatar', avatar.file)
    formData.append('creatorId', profile.id.toString())

    await ChatApi.create(formData)
      .then((res) => {
        console.log(res)
      })
      .catch((error) => console.log(error))
      .finally(() => dispatch(setIsShowingCreateChatModal(false)))
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <IoCloseOutline
          onClick={() => dispatch(setIsShowingCreateChatModal(false))}
          className={styles.closeIcon}
        />
        <h1 className={styles.title}>Create Chat</h1>
        <form onSubmit={createGroup} className={styles.form}>
          <div className={styles.inputsContainer}>
            <div className={styles.inputContainer}>
              <span className={styles.subtitle}>Give group a name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.input}
                type="text"
                placeholder="Group name..."
              />
            </div>
            <div className={styles.inputContainer}>
              <span className={styles.subtitle}>Group description</span>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={styles.input}
                type="text"
                placeholder="Group description..."
              />
            </div>
          </div>
          <div className={styles.uploadAvatarContainer}>
            {avatar.url ? (
              <div className={styles.selectedImage}>
                <IoCloseOutline
                  onClick={() => setAvatar({} as IImageFile)}
                  className={styles.closeSelectedImageIcon}
                />
                <img
                  className={styles.image}
                  src={avatar.url}
                  alt="selected-image"
                />
              </div>
            ) : (
              <>
                <AiOutlineUpload
                  onClick={() => avatarPickerRef.current?.click()}
                  className={styles.uploadIcon}
                />
                <button
                  onClick={() => avatarPickerRef.current?.click()}
                  className={styles.uploadButton}
                  type="button"
                >
                  Upload Avatar
                </button>
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  ref={avatarPickerRef}
                  onChange={addAvatar}
                />
              </>
            )}
          </div>
          <button
            disabled={!name || !description || !avatar.file}
            className={styles.button}
            type="submit"
          >
            Create group
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreateChatModal
