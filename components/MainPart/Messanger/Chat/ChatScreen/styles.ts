export default {
  wrapper: `text-white h-screen `,
  container: `relative h-[80%]`,
  header: `flex justify-between pr-3 sticky top-0 bg-gray-800 text-white h-20 items-center`,
  backContainer: `hover:bg-gray-900 hover:bg-opacity-50 pr-5 flex cursor-pointer justify-center h-full flex-[0.2] transition-all duration-300  space-x-2 items-center`,
  backIcon: `ml-auto`,
  backText: `font-semibold`,
  infoContainer: `flex-1 flex flex-col items-center`,
  name: `font-semibold name`,
  members: `text-sm`,
  avatar: `w-12 h-12 cursor-pointer rounded-full object-cover`,
  inviteText: `text-center font-semibold text-gray-500`,
  leavingText: `text-center font-semibold text-gray-500`,
  formContainer: `w-full flex flex-col absolute bottom-0`,
  form: `relative flex items-center rounded-b-md px-2 h-[100px] bg-gray-700  w-full`,
  add: `bg-gray-600 p-3 rounded-lg cursor-pointer hover:opacity-70`,
  input: `mx-3 border-2 font-semibold placeholder:font-normal text-sm border-gray-500 rounded-xl pl-2 h-[60%] input outline hover:outline-4 placeholder:text-white flex-1`,
  sendContainer: `w-[55px] cursor-pointer shadow-2xl bg-[#197bf4] rounded-xl h-[55%] flex items-center justify-center`,
  sendIconContainer: `bg-white rounded-full p-[3px]`,
  sendIcon: ` text-[#197bf4] text-sm`,
  imagesContainer: `flex mt-4 space-x-3`,
  imageContainer: `h-16 relative object-contain`,
  closeIcon: `absolute text-white text-lg cursor-pointer -top-3 -right-3`,
  image: `w-full h-full`,
  typingContainer: `absolute -top-10 flex space-x-2 items-center`,
  typingIcon: `text-red-500`,
  typingAvatar: `w-[32px] h-[32px]`,
  typingText: `text-gray-400 text-sm`,
  typingName: `text-red-500`,
  answerContainer: `absolute -top-10 bg-opacity-50 border-l-2 border-gray-500 hover:border-gray-400 left-16 right-16 pl-2 py-1 bg-gray-700 `,
  answerName: `font-semibold text-sm`,
  answerText: `text-sm`,
  closeAnswerIcon: `absolute right-1 cursor-pointer top-[25%] text-gray-300`,
  messagesContainer: `flex flex-col w-full space-y-3 pt-3 overflow-y-scroll h-[60%] scrollbar-hide`,
}