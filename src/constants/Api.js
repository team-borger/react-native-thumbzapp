import environment from '../../environment';
//API URL
export const BASE_URL = `${environment.API_URL}`
//API End Points
export const SIGNUP_API = `${BASE_URL}/create-user`;
export const SIGNIN_API = `${BASE_URL}/login`;
export const CHECK_EMAIL_API = `${BASE_URL}/unique-email/`;
