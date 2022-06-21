import { useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { IoMdClose } from 'react-icons/io'
import { useDispatch } from 'react-redux'

import { useTypedSelector } from '../../../../../app/hooks'
import { setIsShowingChatModal } from '../../../../../slices/toggle/toggleSlice'
import AddMembersModal from './AddMembersModal/AddMembersModal'
import Member from './Member/Member'
import styles from './styles'

const ChatModal = () => {
  const dispatch = useDispatch()

  const { chat } = useTypedSelector((store) => store.chatReducer)

  const [isShowingAddMembersModal, setIsShowingAddMembersModal] =
    useState<boolean>(false)

  if (isShowingAddMembersModal)
    return (
      <AddMembersModal
        setIsShowingAddMembersModal={setIsShowingAddMembersModal}
      />
    )

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.chatInfoContainer}>
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_URL}/${chat.chat.avatar}`}
            alt="chat-avatar"
            className={styles.chatAvatar}
          />
          <h1 className={styles.chatName}>{chat.chat.name}</h1>
        </div>

        <div className={styles.membersContainer}>
          <IoMdClose
            onClick={() => dispatch(setIsShowingChatModal(false))}
            className={styles.closeIcon}
          />
          <div className={styles.addMemberContainer}>
            <div
              onClick={() => setIsShowingAddMembersModal(true)}
              className={styles.addContainer}
            >
              <AiOutlinePlus className={styles.addIcon} />
            </div>
            <h1
              onClick={() => setIsShowingAddMembersModal(true)}
              className={styles.addMembersText}
            >
              Add Members
            </h1>
          </div>
          {chat.members.map((member) => (
            <Member member={member} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ChatModal
