import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useTypedSelector } from '../../app/hooks'
import { IProfile } from '../../types/profile/profile-type'

export const useAuthRedirect = () => {
  const { profile } = useTypedSelector((store) => store.profileReducer)
  const { query, push } = useRouter()

  const redirect = query.redirect ? String(query.redirect) : '/'

  useEffect(() => {
    if (profile) push(redirect)
  }, [profile, redirect, push])
}
