export const API_ROUTES = {
  LOGIN: 'login',
  LOGOUT: 'user/logout',
  REGISTER: 'register',
  SOCIAL_LOGIN: 'social-login',
  VERIFY_EMAIL: 'verify-otp',
  FORGOT_PASSWORD: 'forgot-password',
  RESET_PASSWORD: 'reset-password',
  CHANGE_PASSWORD: 'user/update-password',
  UPDATE_PROFILE: 'user/update',
  UPLOAD_PROFILE_PICTURE: 'user/profile/picture/upload',
  GET_PROFILE: 'user/user',
  GET_NOTIFICATIONS: 'notification',
} as const;
