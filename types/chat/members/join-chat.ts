export interface IJoinChatPayload {
  profiles: IMemberPayload[]
  fromName: string
  chatId: number
  fromId: number
}

export interface IMemberPayload {
  name: string
  id: number
}
