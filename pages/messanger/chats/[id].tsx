import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { wrapper } from '../../../app/store'
import MainPart from '../../../components/MainPart/MainPart'
import { messangerActionCreators } from '../../../slices/messanger/action-creators'
import { profileActionCreators } from '../../../slices/profile/action-creators'

const chats = () => {
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

export default chats

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps((store) => async (ctx) => {
    await store.dispatch(profileActionCreators.refreshApi(ctx))

    if (ctx.params) {
      await store.dispatch(
        messangerActionCreators.fetchChats(Number(ctx.params?.id))
      )
    }

    return { props: {} }
  })
