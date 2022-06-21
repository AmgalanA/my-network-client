import { GetServerSideProps } from 'next'
import Head from 'next/head'

import { wrapper } from '../../app/store'
import MainPart from '../../components/MainPart/MainPart'
import { postsActionCreators } from '../../slices/posts/action-creators'
import { profileActionCreators } from '../../slices/profile/action-creators'
import { showingProfileActionCreators } from '../../slices/showing-profile/action-creators'

const page = () => {
  return (
    <div className={`h-screen w-screen `}>
      <Head>
        <title>Show Post</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainPart />
    </div>
  )
}

export default page

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps((store) => async (ctx) => {
    await store.dispatch(profileActionCreators.refreshApi(ctx))

    if (ctx.params) {
      await store.dispatch(
        showingProfileActionCreators.fetchProfile(Number(ctx.params.id))
      )

      await store.dispatch(
        postsActionCreators.getBySenderIdApi(Number(ctx.params.id))
      )
    }

    return { props: {} }
  })
