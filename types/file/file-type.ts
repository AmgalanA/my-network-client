import { PostFileType } from '../../components/MainPart/Feed/Feed'

export interface IFile {
  file: File
  url: string
  type: PostFileType
}

export interface IImageFile {
  file: File
  url: string
}
