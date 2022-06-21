import Timeago from 'timeago-react'
import { VscCommentDiscussion } from 'react-icons/vsc'
import { AiFillLike, AiOutlineLike, AiOutlineSend } from 'react-icons/ai'
import { useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import Avatar from '../../../Utils/Profile/Avatar'
import { useTypedSelector } from '../../../../app/hooks'
import styles from './styles'
import Comment from '../Comment/Comment'
import ImageModal from '../../../Utils/Modals/Post/ImageModal/ImageModal'
import { io, Socket } from 'socket.io-client'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { PathTypes } from '../../../../path-types/path-types'
import { IPost } from '../../../../types/post/post-type'
import { setShowingPost } from '../../../../slices/showing-post/showingPostSlice'
import { postApi } from '../../../../http/post/post-api'

const PostScreen = () => {
  let socket: Socket<DefaultEventsMap, DefaultEventsMap>

  const dispatch = useDispatch()
  const { push } = useRouter()

  const { post } = useTypedSelector((store) => store.showingPostReducer)
  const { profile } = useTypedSelector((store) => store.profileReducer)

  const [text, setText] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [showingImage, setShowingImage] = useState<string | null>(null)

  const toggleLikePost = async () => {
    if (!profile) return

    const payload = {
      id: post.post.id,
      profileId: profile.id,
    }

    if (!socket) {
      socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}/post`)
    }

    socket.emit(PathTypes.TOGGLE_LIKE_POST, payload)
  }

  const sendComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (loading || !profile) return

    try {
      const payload = {
        text,
        senderId: profile.id,
        postId: post.post.id,
      }

      if (!socket) {
        socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}/post`)
      }

      socket.emit(PathTypes.COMMENT_POST, payload)

      setText('')
    } catch (error) {
      console.log('Sending comment error: ', error)
    }
  }

  useEffect(() => {
    if (profile) {
      socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}/post`)

      socket.on(PathTypes.GET_SHOWING_POST, async (post: IPost) => {
        const showingPost = await postApi.getPostSender([post])

        dispatch(setShowingPost(showingPost[0]))
      })
    }
  }, [])

  return (
    <div className={styles.wrapper}>
      {showingImage && (
        <ImageModal
          showingImage={showingImage}
          setShowingImage={setShowingImage}
        />
      )}
      <div className={styles.senderContainer}>
        <div className={styles.avatar}>
          <Avatar profile={post.sender} />
        </div>
        <div className={styles.senderInfoContainer}>
          <h1
            onClick={() => push(`/page/${post.sender.id}`)}
            className={styles.name}
          >
            {post.post.groupId ? 'Sent by Group' : post.sender.name}
          </h1>
          <Timeago className={styles.postedAt} datetime={post.post.postedAt} />
        </div>
      </div>
      <div className={styles.infoContainer}>
        <h2 className={styles.text}>{post.post.text}</h2>
        {post.post.images.length > 0 && (
          <div className={styles.firstImageContainer}>
            <img
              onClick={() => setShowingImage(post.post.images[0])}
              src={`${process.env.NEXT_PUBLIC_BASE_URL}/${post.post.images[0]}`}
              alt="image"
              className={styles.image}
            />
          </div>
        )}

        {post.post.images.length > 1 && (
          <div className={styles.imagesContainer}>
            {post.post.images.slice(1).map((image) => (
              <img
                key={image}
                onClick={() => setShowingImage(image)}
                src={`${process.env.NEXT_PUBLIC_BASE_URL}/${image}`}
                alt="image"
                className={styles.image}
              />
            ))}
          </div>
        )}
      </div>

      <div className={styles.widgetsContainer}>
        <div className={styles.widgetContainer}>
          <VscCommentDiscussion className={styles.icon} />
          <span className={styles.widgetText}>
            {post.comments && post.comments.length > 0
              ? post.comments.length
              : 0}
          </span>
        </div>
        <div
          onClick={toggleLikePost}
          className={`${
            profile && post.post.likes.includes(profile.id)
              ? styles.likedWidgetContainer
              : styles.widgetContainer
          }`}
        >
          {profile && post.post.likes.includes(profile.id) ? (
            <div className={styles.likedContainer}>
              <AiFillLike className={styles.likedIcon} />
            </div>
          ) : (
            <AiOutlineLike className={styles.icon} />
          )}
          <span
            className={
              profile && post.post.likes.includes(profile.id)
                ? 'text-white'
                : 'text-gray-300'
            }
          >
            {post.post.likes.length}
          </span>
        </div>
      </div>

      {post.comments.length > 0 && (
        <div className={styles.commentsContainer}>
          {post.comments.map((comment) => (
            <Comment
              isShowingPost={true}
              key={comment.comment.id}
              comment={comment}
            />
          ))}
        </div>
      )}

      {/* View all comments */}

      {/* Comment form */}
      <form onSubmit={sendComment} className={styles.commentForm}>
        <div className={styles.avatar}>
          <Avatar />
        </div>
        <div className={styles.inputContainer}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className={styles.input}
            type="text"
            placeholder="Write a comment..."
          />
          <button type="submit">
            <AiOutlineSend className={styles.sendIcon} />
          </button>
        </div>
      </form>
    </div>
  )
}

export default PostScreen
