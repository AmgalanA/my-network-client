import { BsCardImage } from 'react-icons/bs'
import { MdAudiotrack } from 'react-icons/md'
import { AiOutlinePaperClip, AiOutlineSend } from 'react-icons/ai'
import { CgCloseR } from 'react-icons/cg'
import { Circles } from 'react-loader-spinner'
import { io, Socket } from 'socket.io-client'

import styles from './styles'
import { useTypedSelector } from '../../../app/hooks'
import Avatar from '../../Utils/Profile/Avatar'
import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { postsActionCreators } from '../../../slices/posts/action-creators'
import Post from '../Posts/Post'
import { IPostSender, IPost, IFeedPost } from '../../../types/post/post-type'
import { postApi } from '../../../http/post/post-api'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { addPost, setPosts } from '../../../slices/posts/postsSlice'

export enum PostFileType {
  AUDIO = 'audio',
  VIDEO = 'video',
  IMAGE = 'image',
}

interface IFile {
  file: File
  url: string
  type: PostFileType
}

const Feed = () => {
  let socket: Socket<DefaultEventsMap, DefaultEventsMap>

  const dispatch = useDispatch()

  const { profile } = useTypedSelector((store) => store.profileReducer)
  const { posts, loading } = useTypedSelector((store) => store.postsReducer)

  const filePickerRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const [files, setFiles] = useState<IFile[]>([])
  const [text, setText] = useState<string>('')
  const [addedPosts, setAddedPosts] = useState<IPostSender[]>([])

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

        if (!socket) {
          socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}/post`)
        }
        socket.emit('create', res.post.id)
        setFiles([])
        setText('')
      })
    } catch (error) {
      console.log('Error: ', error)
    }

    // try {
    //   dispatch(postsActionCreators.sendPostApi(formData))

    //   if (!socket) {
    //     socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}/post`)
    //   }
    //   socket.emit('create', {
    //     senderId: profile.id,
    //     limit: 20,
    //   })

    //   setFiles([])
    //   setText('')
    // } catch (error) {
    //   dispatch(postsActionCreators.sendPostApi(formData))
    //   console.log(error)
    // }
  }
  const removeFile = (selectedFile: IFile) => {
    setFiles(files.filter((file) => file.url !== selectedFile.url))
  }

  useEffect(() => {
    if (profile) {
      socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}/post`)

      // socket.on('get-posts', async (data: IPost[]) => {
      //   const filteredPosts = data.filter(
      //     (post) =>
      //       ![...posts, ...addedPosts]
      //         .map((post) => post.post.id)
      //         .includes(post.id)
      //   )
      //   console.log([...posts, ...addedPosts].map((post) => post.post.id))

      //   const addedPostsSender = await postApi.getPostSender(
      //     filteredPosts.filter((post) => post.senderId !== profile.id)
      //   )

      //   setAddedPosts(addedPostsSender)
      // })

      socket.on('get-post', async (data: IPost) => {
        if (data.senderId !== profile.id) {
          const addedPost = await postApi.getPostSender([data])
          setAddedPosts((prev) => [...prev, addedPost[0]])
        }
      })
    }
  }, [])

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

  if (!profile) return <div></div>

  return (
    <div className={styles.wrapper}>
      {loading ? (
        <Circles color="gray" wrapperClass="mx-auto my-3" />
      ) : (
        <form onSubmit={sendPost} className={styles.sendContainer}>
          {files.length > 0 && (
            <div className={styles.filesContainer}>
              {files.map((file) => (
                <File key={file.url} file={file} />
              ))}
            </div>
          )}
          <div className={styles.avatar}>
            <Avatar />
          </div>
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
                onClick={() => filePickerRef.current?.click()}
                className={styles.icon}
              />
            )}
            <button disabled={!text && files.length < 0} type="submit">
              <AiOutlineSend className={styles.sendIcon} />
            </button>
            <input
              hidden
              ref={filePickerRef}
              onChange={addImage}
              type="file"
              accept="image/*, video/*"
            />
          </div>
        </form>
      )}
      {/* Posts */}
      <div className={styles.postsContainer}>
        {posts.length > 0 ? (
          posts.map(
            (post) =>
              post && post.post && <Post key={post.post.id} post={post} />
          )
        ) : (
          <h1>No posts currently</h1>
        )}
        {addedPosts.length > 0 && (
          <div className={styles.addedPostsContainer}>
            <h1 className={styles.addedPostsText}>
              You have {addedPosts.length} new posts
            </h1>
            <button
              className={styles.refreshButton}
              onClick={() => {
                dispatch(setPosts([...posts, ...addedPosts]))
                setAddedPosts([])
              }}
            >
              Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Feed
