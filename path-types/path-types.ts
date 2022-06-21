export enum PathTypes {
  GET_POSTS = 'get-posts',
  GET_POST = 'get-post',
  CREATE = 'create',
  DELETE = 'delete',
  COMMENT_POST = 'comment-post',
  REMOVE_COMMENT_POST = 'remove-comment-post',
  GET_SHOWING_POST = 'get-showing-post',
  TOGGLE_LIKE_POST = 'toggle-like-post',
  TOGGLE_LIKE_COMMENT = 'toggle-like-comment',
}

export enum ConversationPathTypes {
  GET_CONVERSATION = 'get-conversation',
  JOIN_ROOM = 'join-room',
  LEAVE_ROOM = 'leave-room',
  SEND_MESSAGE = 'send-message',
  DELETE_MESSAGE = 'delete-message',
  ADD_TYPING = 'add-typing',
  REMOVE_TYPING = 'remove-typing',
  GET_TYPING = 'get-typing',
  UPDATE_CONVERSATIONS = 'update-conversations',
}

export enum ProfilePathTypes {
  BECOME_ONLINE = 'become-online',
  BECOME_OFFLINE = 'become-offline',
  GET_PROFILES_ONLINE = 'get-profiles-online',
}
