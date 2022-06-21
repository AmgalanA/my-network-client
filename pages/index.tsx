import type { NextPage, GetServerSideProps } from 'next'
import Head from 'next/head'

import { useTypedSelector } from '../app/hooks'
import Auth from '../components/Auth/Auth'
import { profileActionCreators } from '../slices/profile/action-creators'
import { wrapper } from '../app/store'
import MainPart from '../components/MainPart/MainPart'
import { postsActionCreators } from '../slices/posts/action-creators'

const Home: NextPage = () => {
  const { profile } = useTypedSelector((store) => store.profileReducer)

  if (!profile) return <Auth />

  return (
    <div className={`h-screen w-screen `}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainPart />
    </div>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps((store) => async (ctx) => {
    await store.dispatch(profileActionCreators.refreshApi(ctx))

    await store.dispatch(postsActionCreators.getPostsApi(20))

    return { props: {} }
  })
