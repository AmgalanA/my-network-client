import Timeago from 'timeago-react'
import { VscCommentDiscussion } from 'react-icons/vsc'
import { AiOutlineLike, AiOutlineSend, AiFillLike } from 'react-icons/ai'

import { IPostSender } from '../../../types/post/post-type'
import Avatar from '../../Utils/Profile/Avatar'
import styles from './styles'
import { useState } from 'react'
import ImageModal from '../../Utils/Modals/Post/ImageModal/ImageModal'
import { useTypedSelector } from '../../../app/hooks'
import { useDispatch } from 'react-redux'
import { postsActionCreators } from '../../../slices/posts/action-creators'
import Comment from './Comment/Comment'
import { useRouter } from 'next/router'

interface IProp {
  post: IPostSender
}

const Post = ({ post }: IProp) => {
  const dispatch = useDispatch()
  const { push } = useRouter()

  const { profile } = useTypedSelector((store) => store.profileReducer)
  const { loading } = useTypedSelector((store) => store.postsReducer)

  const [showingImage, setShowingImage] = useState<string | null>(null)
  const [text, setText] = useState<string>('')
  const [isShowingAllComments, setIsShowingAllComments] =
    useState<boolean>(false)

  const toggleLikePost = async () => {
    if (!profile) return

    const payload = {
      id: post.post.id,
      profileId: profile.id,
    }

    dispatch(postsActionCreators.toggleLikePostApi(payload))
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

      dispatch(postsActionCreators.sendCommentApi(payload))

      setText('')
    } catch (error) {
      console.log('Sending comment error: ', error)
    }
  }

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
        <div className={styles.senderInfo}>
          <h1
            onClick={() => push(`/page/${post.sender.id}`)}
            className={styles.name}
          >
            {post.sender.name} {post.sender.secondName}
          </h1>
          <Timeago className={styles.sentAt} datetime={post.post.postedAt} />
        </div>
      </div>

      <h1 onClick={() => push(`/post/${post.post.id}`)} className={styles.text}>
        {post.post.text}
      </h1>

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
          {isShowingAllComments
            ? post.comments.map((comment) => (
                <Comment key={comment.comment.id} comment={comment} />
              ))
            : post.comments
                .slice(post.comments.length - 2, post.comments.length)
                .map((comment) => (
                  <Comment key={comment.comment.id} comment={comment} />
                ))}
          {post.comments.length > 3 && (
            <h1
              onClick={() => setIsShowingAllComments(!isShowingAllComments)}
              className={styles.showAllCommentsText}
            >
              View all comments ({post.comments.length})
            </h1>
          )}
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

export default Post
