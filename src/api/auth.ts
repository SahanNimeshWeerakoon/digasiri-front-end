import {axiosClient} from '@/api/client.ts';
import {AUTH} from '@/api/endpoints.ts';
import {
    ILoginRequest,
} from '@/utils/types.ts';

const AuthServiceLogin = async (data: ILoginRequest) => {
    const response = await axiosClient.post(`${AUTH}/login`, data);
    return response;
};

const AuthService = {
    AuthServiceLogin,
};

export default AuthService;
