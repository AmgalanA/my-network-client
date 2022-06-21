import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { io } from 'socket.io-client'
import { useDispatch } from 'react-redux'

import styles from './styles'
import { useTypedSelector } from '../../app/hooks'
import Header from './Header/Header'
import Feed from './Feed/Feed'
import Sidebar from './Sidebar/Sidebar'
import PostScreen from './Posts/PostScreen/PostScreen'
import EditScreen from './Edit/EditScreen'
import Page from './Page/Page'
import ConversationScreen from './Messanger/Conversation/ConversationScreen/ConversationScreen'
import {
  ConversationPathTypes,
  ProfilePathTypes,
} from '../../path-types/path-types'
import { setOnline } from '../../slices/online/onlineSlice'
import Messanger from './Messanger/Messanger'
import ChatScreen from './Messanger/Chat/ChatScreen/ChatScreen'

const MainPart = () => {
  const { pathname } = useRouter()

  const dispatch = useDispatch()

  const { profile } = useTypedSelector((store) => store.profileReducer)

  useEffect(() => {
    if (profile) {
      const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}/profile`)

      socket.on('connect', () => {
        socket.emit(ProfilePathTypes.BECOME_ONLINE, profile.id)
        // socket.emit(ConversationPathTypes.JOIN_ROOM, profile.id)
      })

      socket.on(ProfilePathTypes.GET_PROFILES_ONLINE, (data: number[]) => {
        dispatch(setOnline(data))
      })

      window.addEventListener('beforeunload', () =>
        socket.emit(ProfilePathTypes.BECOME_OFFLINE, profile.id)
      )

      return () => {
        socket.emit(ProfilePathTypes.BECOME_OFFLINE, profile.id)
        socket.emit(ConversationPathTypes.LEAVE_ROOM, profile.id)
      }
    }
  }, [profile])

  return (
    <div className={styles.wrapper}>
      <div
        className={`${pathname === '/page/[id]' && 'max-w-6xl'} ${
          styles.container
        }`}
      >
        <Sidebar />
        <div className={styles.contentContainer}>
          <Header />
          {pathname === '/post/[id]' && <PostScreen />}
          {pathname === '/' && <Feed />}
          {pathname === '/edit/[id]' && <EditScreen />}
          {pathname === '/page/[id]' && <Page />}
          {pathname === '/messanger/conversation/[id]' && (
            <ConversationScreen />
          )}
          {pathname === '/messanger/chats/chat/[id]' && <ChatScreen />}
          {(pathname === '/messanger/[id]' ||
            pathname === '/messanger/chats/[id]') && <Messanger />}
        </div>
      </div>
    </div>
  )
}

export default MainPart
