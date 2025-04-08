import axios from 'axios';
import {globalVariables,statusCode} from '@/utils/globalVariables';

const options = {
    timeout: globalVariables.API_DEFAULT_TIME_OUT,
};

export const axiosClient = axios.create(options);

axiosClient.interceptors.request.use(function (config) {
    if (config && config?.headers) {
        const state = window.sessionStorage.getItem('auth');
        if (state) {
            const data = JSON.parse(state);
            const headers = config.headers;
            headers['Authorization'] = `Bearer ${data?.token}`;
        }
        return config;
    }
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response.status === statusCode.UNAUTHORIZED_STATUS) {
            window.sessionStorage.removeItem('auth');
            window.location.replace('/');
            return;
        }
        // if (error?.response?.status && error?.response?.data) {
        //     notifications({
        //         type: NotificationType.ERROR,
        //         message: error?.response?.data?.Detail,
        //         dismissTime: 5000,
        //     });
        // }
        return Promise.reject(error);
    }
);