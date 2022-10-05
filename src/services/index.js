import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../constants/Api';
import NetInfo from "@react-native-community/netinfo";

import Auth from './auth-service';
import Call from './call-service';

export const AuthService = new Auth();
export const CallService = new Call();

const backendAPI = axios.create({
    baseURL: BASE_URL,
});

backendAPI.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('Token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            config.headers['Content-Type'] = `application/json`;
        }
        return config;
    },
    error => {
        return Promise.reject(error)
    },
);
export default backendAPI;
