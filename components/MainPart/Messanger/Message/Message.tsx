import Timeago from 'timeago-react'
import { BsReply } from 'react-icons/bs'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { IMessageSender } from '../../../../types/message/message-type'
import styles from './styles'
import Avatar from '../../../Utils/Profile/Avatar'
import { useTypedSelector } from '../../../../app/hooks'
import { setMessage } from '../../../../slices/conversation/reply-message/replyMessageSlice'
import { messageApi } from '../../../../http/message/message-api'
import ImageModal from '../../../Utils/Modals/Post/ImageModal/ImageModal'

interface IProp {
  message: IMessageSender
}

const Message = ({ message }: IProp) => {
  const dispatch = useDispatch()

  const { profile } = useTypedSelector((store) => store.profileReducer)

  const [answerMessage, setAnswerMessage] = useState<IMessageSender | null>(
    null
  )
  const [showingImage, setShowingImage] = useState<string | null>('')

  if (!profile) return <div></div>

  useEffect(() => {
    const getMessageAnswered = async () => {
      if (!message.message.messageId) return

      const messageAnswered = await messageApi.get(message.message.messageId)

      setAnswerMessage(messageAnswered)
    }

    getMessageAnswered()
  }, [message])

  return (
    <div
      className={`${
        message.sender.id === profile.id ? 'items-end' : 'items-start'
      } ${styles.wrapper}`}
    >
      {showingImage && (
        <ImageModal
          showingImage={showingImage}
          setShowingImage={setShowingImage}
        />
      )}
      <div className={styles.container}>
        <div
          className={`${
            message.sender.id === profile.id ? 'bg-[#197bf4]' : 'bg-gray-700'
          }  ${styles.messageContainer}`}
        >
          {message.message.images.length > 0 && (
            <div className={styles.imagesContainer}>
              {message.message.images.map((image) => (
                <img
                  onClick={() => setShowingImage(image)}
                  className={styles.image}
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}/${image}`}
                  alt="image"
                />
              ))}
            </div>
          )}
          <h1 className={styles.text}>{message.message.text}</h1>
          {answerMessage && (
            <div className={styles.answerContainer}>
              <div className={styles.answerSenderContainer}>
                <span className={styles.repliedTo}>Replied to</span>
                <h1 className={styles.answerName}>
                  {console.log(answerMessage)}
                  {answerMessage.sender.name} {answerMessage.sender.secondName}
                </h1>

                <Avatar
                  profile={answerMessage.sender}
                  propStyles={styles.answerSenderAvatar}
                />
              </div>
              {answerMessage.message.images.length > 1 ? (
                <h3 className={styles.answerMessageImagesLength}>
                  {answerMessage.message.images.length} images
                </h3>
              ) : (
                answerMessage.message.images.length > 0 && (
                  <h3 className={styles.answerMessageImagesLength}>
                    {answerMessage.message.images.length} image
                  </h3>
                )
              )}
              <h2 className={styles.answerText}>
                {answerMessage.message.text}
              </h2>
            </div>
          )}
          <BsReply
            onClick={() => dispatch(setMessage(message))}
            className={styles.replyIcon}
          />
        </div>
        <div className={styles.senderContainer}>
          <Timeago
            datetime={message.message.sentAt}
            className={styles.sentAt}
          />
          <h1 className={styles.senderName}>
            {message.sender.id === profile.id ? 'You' : message.sender.name}
          </h1>
          <Avatar profile={message.sender} propStyles={styles.avatar} />
        </div>
      </div>
    </div>
  )
}

export default Message
