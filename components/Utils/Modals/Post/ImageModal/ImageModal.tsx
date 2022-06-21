import { Dispatch, SetStateAction } from 'react'
import { IoMdClose } from 'react-icons/io'

import styles from './styles'

interface IProp {
  showingImage: string
  setShowingImage: Dispatch<SetStateAction<string | null>>
}

const ImageModal = ({ showingImage, setShowingImage }: IProp) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.imageContainer}>
        <img
          className={styles.image}
          src={`${process.env.NEXT_PUBLIC_BASE_URL}/${showingImage}`}
          alt="image"
        />
        <IoMdClose
          className={styles.closeIcon}
          onClick={() => setShowingImage('')}
        />
      </div>
    </div>
  )
}

export default ImageModal
