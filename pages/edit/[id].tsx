import Head from 'next/head'
import { GetServerSideProps } from 'next'

import MainPart from '../../components/MainPart/MainPart'
import { wrapper } from '../../app/store'
import { profileActionCreators } from '../../slices/profile/action-creators'

const edit = () => {
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

export default edit

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps((store) => async (ctx) => {
    await store.dispatch(profileActionCreators.refreshApi(ctx))

    return { props: {} }
  })
