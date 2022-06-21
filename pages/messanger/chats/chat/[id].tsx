import { GetServerSideProps } from 'next'
import Head from 'next/head'
import React from 'react'
import { wrapper } from '../../../../app/store'
import MainPart from '../../../../components/MainPart/MainPart'
import { profileActionCreators } from '../../../../slices/profile/action-creators'
import { chatActionCreators } from '../../../../slices/chat/action-creators'

const chat = () => {
  return (
    <div className={`h-screen w-screen `}>
      <Head>
        <title>Show Chat</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainPart />
    </div>
  )
}

export default chat

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps((store) => async (ctx) => {
    await store.dispatch(profileActionCreators.refreshApi(ctx))

    if (ctx.params) {
      await store.dispatch(chatActionCreators.fetchChat(Number(ctx.params.id)))
    }

    return { props: {} }
  })
