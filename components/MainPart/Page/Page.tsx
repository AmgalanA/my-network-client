import { FiImage } from 'react-icons/fi'
import { useRef, useState } from 'react'

import styles from './styles'
import { useTypedSelector } from '../../../app/hooks'
import Avatar from '../../Utils/Profile/Avatar'
import Post from '../Posts/Post'
import { ISex } from '../../../types/profile/profile-type'
import { IFile } from '../../../types/file/file-type'
import { AiOutlinePaperClip, AiOutlineSend } from 'react-icons/ai'
import { PostFileType } from '../Feed/Feed'
import { CgCloseR } from 'react-icons/cg'
import { addPost } from '../../../slices/posts/postsSlice'
import { postApi } from '../../../http/post/post-api'
import { io } from 'socket.io-client'
import { useDispatch } from 'react-redux'
import { conversationApi } from '../../../http/conversation/conversation-api'
import { useRouter } from 'next/router'
import { profileApi } from '../../../http/profile/profile-api'

const Page = () => {
  const dispatch = useDispatch()

  const { push } = useRouter()

  const showingProfile = useTypedSelector(
    (store) => store.showingProfileReducer
  )
  const { profile } = useTypedSelector((store) => store.profileReducer)
  const { posts } = useTypedSelector((store) => store.postsReducer)

  const videoRef = useRef<HTMLVideoElement>(null)
  const imagePickerRef = useRef<HTMLInputElement>(null)

  const [text, setText] = useState<string>('')
  const [files, setFiles] = useState<IFile[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const addImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      let type = PostFileType.IMAGE

      switch (e.target.files[0].type.split('/')[0]) {
        case 'audio':
          type = PostFileType.AUDIO
          break
        case 'video':
          type = PostFileType.VIDEO
          break
        default:
          break
      }

      setFiles([
        ...files,
        {
          file: e.target.files[0],
          url: URL.createObjectURL(e.target.files[0]),
          type,
        },
      ])
    }
  }

  const sendPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if ((!text && files.length < 0) || !profile) return
    const formData = new FormData()
    formData.append('text', text)
    formData.append('senderId', profile.id.toString())

    files.map((file) => formData.append('files', file.file))

    try {
      const response = await postApi.createPost(formData).then((res) => {
        dispatch(addPost(res))

        const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}/post`)
        socket.emit('create', res.post.id)
        setFiles([])
        setText('')
      })
    } catch (error) {
      console.log('Error: ', error)
    }
  }

  const createConversation = async () => {
    if (!profile || !showingProfile || loading) return

    setLoading(true)

    const ids = [profile.id, showingProfile.profile.id]

    await conversationApi
      .create(ids)
      .then((res) => push(`/messanger/conversation/${res.id}`))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false))
  }

  const File = ({ file }: { file: IFile }) => {
    switch (file.type) {
      case PostFileType.IMAGE:
        return (
          <div className={styles.fileContainer}>
            <img className={styles.imageFile} src={file.url} key={file.url} />
            <CgCloseR
              onClick={() => removeFile(file)}
              className={styles.closeIcon}
            />
          </div>
        )
      case PostFileType.VIDEO:
        return (
          <div className={styles.fileContainer}>
            <video className={styles.videoFile} ref={videoRef} src={file.url} />
            <span className={styles.videoDuration}>
              {videoRef.current &&
                `${parseInt(
                  (videoRef.current?.duration / 60).toString(),
                  10
                ).toString()}:${Math.ceil(videoRef.current?.duration % 60)}`}
            </span>
            <CgCloseR
              onClick={() => removeFile(file)}
              className={styles.closeIcon}
            />
          </div>
        )

      default:
        return <div></div>
    }
  }

  const removeFile = (selectedFile: IFile) => {
    setFiles(files.filter((file) => file.url !== selectedFile.url))
  }

  const addFriend = async () => {
    if (!profile) return

    const payload = {
      currentProfileId: profile.id,
      profileId: showingProfile.profile.id,
    }

    await profileApi.toggleFriend(payload)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.infoContainer}>
          <h1 className={styles.name}>
            {showingProfile.profile.name} {showingProfile.profile.secondName}
          </h1>
          {showingProfile.profile.from && (
            <div className={styles.info}>
              <h1 className={styles.infoName}>City: </h1>
              <h2 className={styles.infoValue}>
                {showingProfile.profile.from}
              </h2>
            </div>
          )}

          {showingProfile.profile.sex !== ISex.NO && (
            <div className={styles.info}>
              <h1 className={styles.infoName}>Gender: </h1>
              <h2 className={styles.infoValue}>{showingProfile.profile.sex}</h2>
            </div>
          )}

          {showingProfile.profile.birthDate && (
            <div className={styles.info}>
              <h1 className={styles.infoName}>Birth Date: </h1>
              <h2 className={styles.infoValue}>
                {showingProfile.profile.birthDate}
              </h2>
            </div>
          )}

          <div className={styles.info}>
            <h1 className={styles.infoName}>Marital Status: </h1>
            <h2 className={styles.infoValue}>
              {showingProfile.profile.maritalStatus}
            </h2>
          </div>
        </div>
        <div className={styles.postsContainer}>
          {!profile ||
            (showingProfile.profile.id === profile.id && (
              // <form className={styles.form}>
              //   <input
              //     type="file"
              //     hidden
              //     ref={imagePickerRef}
              //     onChange={addImage}
              //   />
              //   {image.url ? (
              //     <img
              //       src={image.url}
              //       className={styles.selectedImage}
              //       alt="selected-image"
              //     />
              //   ) : (
              //     <FiImage
              //       onClick={() => imagePickerRef.current?.click()}
              //       className={styles.icon}
              //     />
              //   )}
              //   <input
              //     value={text}
              //     onChange={(e) => setText(e.target.value)}
              //     className={styles.input}
              //     type="text"
              //     placeholder="Tell, what you have new?"
              //   />
              // </form>
              <form onSubmit={sendPost} className={styles.sendContainer}>
                {files.length > 0 && (
                  <div className={styles.filesContainer}>
                    {files.map((file) => (
                      <File key={file.url} file={file} />
                    ))}
                  </div>
                )}
                <Avatar propStyles={styles.profileAvatar} />
                <div className={styles.inputContainer}>
                  <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className={styles.input}
                    type="text"
                    placeholder={`What's new, ${profile.name}?`}
                  />
                  {files.length < 10 && (
                    <AiOutlinePaperClip
                      onClick={() => imagePickerRef.current?.click()}
                      className={styles.icon}
                    />
                  )}
                  <button disabled={!text && files.length < 0} type="submit">
                    <AiOutlineSend className={styles.sendIcon} />
                  </button>
                  <input
                    hidden
                    ref={imagePickerRef}
                    onChange={addImage}
                    type="file"
                    accept="image/*, video/*"
                  />
                </div>
              </form>
            ))}
          {posts.map((post) => (
            <Post key={post.post.id} post={post} />
          ))}
        </div>
      </div>
      <div className={styles.profileContainer}>
        <Avatar propStyles={styles.avatar} profile={showingProfile.profile} />
        <div className={styles.buttonsContainer}>
          <button
            onClick={addFriend}
            disabled={!profile || showingProfile.profile.id === profile.id}
            className={styles.button}
          >
            Add to Friend
          </button>
          <button
            onClick={createConversation}
            disabled={!profile || showingProfile.profile.id === profile.id}
            className={styles.button}
          >
            Write a message
          </button>
        </div>
      </div>
    </div>
  )
}

export default Page
