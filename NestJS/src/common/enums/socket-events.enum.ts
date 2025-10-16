/**
 * События WebSocket для чатов
 */
export enum SocketEvent {
  // Подключение/отключение
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  AUTHENTICATE = 'authenticate',
  AUTHENTICATED = 'authenticated',

  // Управление чатами
  JOIN_CHAT = 'joinChat',
  LEAVE_CHAT = 'leaveChat',
  JOINED_CHAT = 'joinedChat',
  LEFT_CHAT = 'leftChat',
  CREATE_CHAT = 'createChat',
  CHAT_CREATED = 'chatCreated',
  UPDATE_CHAT = 'updateChat',
  CHAT_UPDATED = 'chatUpdated',
  DELETE_CHAT = 'deleteChat',
  CHAT_DELETED = 'chatDeleted',
  GET_CHATS = 'getChats',
  CHATS_LIST = 'chatsList',
  GET_CHAT = 'getChat',
  CHAT_DETAILS = 'chatDetails',

  // Сообщения
  SEND_MESSAGE = 'sendMessage',
  MESSAGE_SENT = 'messageSent',
  NEW_MESSAGE = 'newMessage',
  EDIT_MESSAGE = 'editMessage',
  MESSAGE_EDITED = 'messageEdited',
  DELETE_MESSAGE = 'deleteMessage',
  MESSAGE_DELETED = 'messageDeleted',
  GET_MESSAGES = 'getMessages',
  MESSAGES_LIST = 'messagesList',
  
  // Статусы сообщений
  MESSAGE_DELIVERED = 'messageDelivered',
  MESSAGE_READ = 'messageRead',
  MARK_AS_READ = 'markAsRead',
  
  // Typing индикаторы
  TYPING_START = 'typingStart',
  TYPING_STOP = 'typingStop',
  USER_TYPING = 'userTyping',
  USER_STOPPED_TYPING = 'userStoppedTyping',

  // Участники
  ADD_PARTICIPANT = 'addParticipant',
  REMOVE_PARTICIPANT = 'removeParticipant',
  PARTICIPANT_ADDED = 'participantAdded',
  PARTICIPANT_REMOVED = 'participantRemoved',
  PARTICIPANT_LEFT = 'participantLeft',
  PARTICIPANT_JOINED = 'participantJoined',
  
  // Онлайн статус
  USER_ONLINE = 'userOnline',
  USER_OFFLINE = 'userOffline',
  GET_ONLINE_USERS = 'getOnlineUsers',
  ONLINE_USERS_LIST = 'onlineUsersList',

  // Ошибки
  ERROR = 'error',
  EXCEPTION = 'exception',
}

