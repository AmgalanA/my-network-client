import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { IoMdClose, IoIosArrowBack } from 'react-icons/io'
import { useDispatch } from 'react-redux'
import { useDebounce } from 'use-debounce'
import { AiOutlineSearch } from 'react-icons/ai'

import { useTypedSelector } from '../../../../../../app/hooks'
import { profileApi } from '../../../../../../http/profile/profile-api'
import { setIsShowingChatModal } from '../../../../../../slices/toggle/toggleSlice'
import { IProfile } from '../../../../../../types/profile/profile-type'

import styles from './styles'
import Member from '../Member/Member'
import { Circles } from 'react-loader-spinner'
import { ChatApi } from '../../../../../../http/chat/chat-api'
import { chatActionCreators } from '../../../../../../slices/chat/action-creators'

interface IProp {
  setIsShowingAddMembersModal: Dispatch<SetStateAction<boolean>>
}

const AddMembersModal = ({ setIsShowingAddMembersModal }: IProp) => {
  const dispatch = useDispatch()

  const { profile } = useTypedSelector((store) => store.profileReducer)
  const { chat } = useTypedSelector((store) => store.chatReducer)

  const [friends, setFriends] = useState<IProfile[]>([])
  const [query, setQuery] = useState<string>('')
  const [localLoading, setLocalLoading] = useState<boolean>(true)
  const [potentialMembers, setPotentialMembers] = useState<IProfile[]>([])

  const [searchQuery] = useDebounce(query, 400)

  const close = () => {
    setIsShowingAddMembersModal(false)
    dispatch(setIsShowingChatModal(false))
  }

  const toggleFriend = (friend: IProfile) => {
    if (potentialMembers.map((member) => member.id).includes(friend.id)) {
      setPotentialMembers(
        potentialMembers.filter((member) => member.id !== friend.id)
      )
    } else {
      setPotentialMembers([...potentialMembers, friend])
    }
  }

  const addMembers = async () => {
    if (!profile) return

    const profiles = potentialMembers.map((member) => ({
      name: `${member.name} ${member.secondName}`,
      id: member.id,
    }))

    const payload = {
      fromName: `${profile.name} ${profile.secondName}`,
      fromId: profile.id,
      profiles,
      chatId: chat.chat.id,
    }

    await ChatApi.addMembers(payload)
      .then((res) => {
        console.log(res)
        dispatch(chatActionCreators.fetchChat(chat.chat.id))
      })
      .catch((error) => console.log(error))
  }

  useEffect(() => {
    const getFriends = async () => {
      if (!profile) return

      await profileApi.fetchFriends(profile.id).then((res) => {
        setFriends(res)

        setLocalLoading(false)
      })
    }

    getFriends()
  }, [profile])

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div
            onClick={() => setIsShowingAddMembersModal(false)}
            className={styles.backContainer}
          >
            <IoIosArrowBack className={styles.backIcon} />
            <span className={styles.backText}>Back</span>
          </div>
          <h1 className={styles.title}>Add Members</h1>

          <IoMdClose onClick={close} className={styles.closeIcon} />
        </header>

        {localLoading ? (
          <Circles />
        ) : (
          <div className="w-full">
            <div className={styles.searchContainer}>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                placeholder="Search..."
                className={styles.input}
              />
              <AiOutlineSearch className={styles.searchIcon} />
            </div>

            <div className={styles.friendsContainer}>
              {potentialMembers.length > 0 && (
                <div className={styles.potentialMembersContainer}>
                  {potentialMembers.map((member) => (
                    <div
                      key={member.id}
                      className={styles.potentialMemberContainer}
                    >
                      <h1 className={styles.potentialMemberName}>
                        {member.name} {member.secondName}
                      </h1>
                      <IoMdClose
                        onClick={() => toggleFriend(member)}
                        className={styles.removePotentialMemberIcon}
                      />
                    </div>
                  ))}
                </div>
              )}
              {friends.filter(
                (friend) =>
                  !chat.members.map((member) => member.id).includes(friend.id)
              ).length > 0 ? (
                friends

                  .filter(
                    (friend) =>
                      friend.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      friend.secondName
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                  )
                  .map((friend) => (
                    <div key={friend.id} className={styles.friendContainer}>
                      <Member member={friend} />
                      <button
                        onClick={() => toggleFriend(friend)}
                        type="button"
                      >
                        Add
                      </button>
                    </div>
                  ))
              ) : (
                <h1 className={styles.nobodyToAdd}>Nobody to add</h1>
              )}
              <button
                onClick={addMembers}
                disabled={potentialMembers.length === 0}
                className={styles.addMembers}
              >
                Add members
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AddMembersModal
