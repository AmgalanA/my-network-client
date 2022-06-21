export enum ISex {
  NO = 'no',
  MALE = 'male',
  FEMALE = 'female',
}

export const Sex = [ISex.NO, ISex.MALE, ISex.FEMALE]

export enum IMaritalStatus {
  NO = 'no',
  NOTMARRIED = 'not-married',
  MARRIED = 'married',
  DATING = 'dating',
  COMPLICATED = 'complicated',
  ACTIVELY = 'actively',
  INLOVE = 'in-love',
}

export const MaritalStatus = [
  IMaritalStatus.NO,
  IMaritalStatus.NOTMARRIED,
  IMaritalStatus.MARRIED,
  IMaritalStatus.DATING,
  IMaritalStatus.COMPLICATED,
  IMaritalStatus.ACTIVELY,
  IMaritalStatus.INLOVE,
]

export interface IProfile {
  id: number
  name: string
  secondName: string
  sex: ISex
  from: string
  birthDate: string
  maritalStatus: IMaritalStatus
  lastSeen: string
  avatar: string
  authId: number
  friends: number[]
}
