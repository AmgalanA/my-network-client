import { useEffect, useState } from 'react'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { MdOutlineDeleteOutline } from 'react-icons/md'
import { useRouter } from 'next/router'

import styles from './styles'
import { ICommentSender } from '../../../../types/post/comment/comment-type'
import Avatar from '../../../Utils/Profile/Avatar'
import TimeAgo from 'timeago-react'
import { useTypedSelector } from '../../../../app/hooks'
import { useDispatch } from 'react-redux'
import { postsActionCreators } from '../../../../slices/posts/action-creators'
import { commentApi } from '../../../../http/post/comment/comment-api'
import { io, Socket } from 'socket.io-client'
import { PathTypes } from '../../../../path-types/path-types'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'

interface IProp {
  comment: ICommentSender
  isShowingPost?: boolean
}

const Comment = ({ isShowingPost, comment }: IProp) => {
  let socket: Socket<DefaultEventsMap, DefaultEventsMap>

  const dispatch = useDispatch()
  const { push } = useRouter()

  const { loading } = useTypedSelector((store) => store.postsReducer)
  const { profile } = useTypedSelector((store) => store.profileReducer)

  const [hasLiked, setHasLiked] = useState<boolean>(false)

  useEffect(() => {
    const checkIfLiked = async () => {
      if (!profile) return

      const payload = {
        id: comment.comment.id,
        profileId: profile.id,
      }

      await commentApi
        .checkIfLiked(payload)
        .then((res) => setHasLiked(res))
        .catch((error) => console.log(error))
    }
    checkIfLiked()
  }, [profile, comment])

  const toggleLikeComment = async () => {
    if (!profile || loading) return

    const payload = {
      id: comment.comment.id,
      profileId: profile.id,
    }

    if (isShowingPost) {
      socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}/post`)

      socket.emit(PathTypes.TOGGLE_LIKE_COMMENT, payload)
    } else {
      dispatch(postsActionCreators.likeCommentApi(payload))
    }
  }

  const removeComment = async () => {
    if (loading || !profile) return

    try {
      const payload = {
        postId: comment.comment.postId,
        id: comment.comment.id,
      }

      if (!socket) {
        socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}/post`)
      }

      socket.emit(PathTypes.REMOVE_COMMENT_POST, payload)
    } catch (error) {
      console.log('Deleting comment error: ', error)
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.avatar}>
        <Avatar profile={comment.sender} />
      </div>
      <div className={styles.infoContainer}>
        <h1
          onClick={() => push(`/page/${comment.sender.id}`)}
          className={styles.name}
        >
          {comment.sender.name} {comment.sender.secondName}
        </h1>
        <h2 className={styles.text}>{comment.comment.text}</h2>
        <div className={styles.widgetsContainer}>
          <TimeAgo
            className={styles.sentAt}
            datetime={comment.comment.sentAt}
          />
          <div onClick={toggleLikeComment} className={styles.likeContainer}>
            {hasLiked ? (
              <AiFillHeart className={styles.likedIcon} />
            ) : (
              <AiOutlineHeart className={styles.likeIcon} />
            )}
            <span className={styles.likeText}>
              {comment.comment?.likes?.length}
            </span>
          </div>
          {profile && profile.id === comment.sender.id && (
            <MdOutlineDeleteOutline
              onClick={removeComment}
              className={styles.deleteIcon}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Comment
