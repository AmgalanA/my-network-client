import { TypedUseSelectorHook, useSelector } from 'react-redux'
import { AppState } from './store'

export const useTypedSelector: TypedUseSelectorHook<AppState> = useSelector
