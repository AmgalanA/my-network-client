import { AsyncThunkAction } from '@reduxjs/toolkit'
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  PreviewData,
} from 'next'
import Head from 'next/head'
import { ParsedUrlQuery } from 'querystring'
import { wrapper } from '../../../app/store'
import MainPart from '../../../components/MainPart/MainPart'
import { conversationActionCreators } from '../../../slices/conversation/action-creators'
import { profileActionCreators } from '../../../slices/profile/action-creators'
import { IProfile } from '../../../types/profile/profile-type'

const conversation = () => {
  return (
    <div className={`h-screen w-screen `}>
      <Head>
        <title>Messanger</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainPart />
    </div>
  )
}

export default conversation

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps((store) => async (ctx) => {
    const response = await store.dispatch<any>(
      profileActionCreators.refreshApi(ctx)
    )

    if (ctx.params?.id && response.payload.id) {
      const payload = {
        id: Number(ctx.params?.id),
        currentProfileId: response.payload.id,
      }

      await store.dispatch(
        conversationActionCreators.fetchConversation(payload)
      )
    }

    return { props: {} }
  })
