import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { wrapper } from '../../app/store'
import MainPart from '../../components/MainPart/MainPart'
import { profileActionCreators } from '../../slices/profile/action-creators'
import { showingPostActionCreators } from '../../slices/showing-post/action-creators'

const post = () => {
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

export default post

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps((store) => async (ctx) => {
    await store.dispatch(profileActionCreators.refreshApi(ctx))

    if (ctx.params) {
      await store.dispatch(
        showingPostActionCreators.getPostApi(Number(ctx.params.id))
      )
    }

    return { props: {} }
  })
