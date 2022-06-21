import Head from 'next/head'
import { GetServerSideProps } from 'next'

import MainPart from '../../components/MainPart/MainPart'
import { wrapper } from '../../app/store'
import { profileActionCreators } from '../../slices/profile/action-creators'
import { messangerActionCreators } from '../../slices/messanger/action-creators'

const messanger = () => {
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

export default messanger

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps((store) => async (ctx) => {
    await store.dispatch(profileActionCreators.refreshApi(ctx))

    if (ctx.params?.id) {
      await store.dispatch(
        messangerActionCreators.fetchConversations(Number(ctx.params?.id))
      )
    }

    return { props: {} }
  })
