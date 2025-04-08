import AuthService from '@/api/auth.ts';
import {ILoginRequest} from '@/utils/types.ts';
import {useEffect, useState} from "react";
import {useNavigate} from "react-router";
import {statusCode} from "@/utils/globalVariables.ts";

export default function useAuth() {
    const [user, setUser] = useState(null);
    const [isLogedin, setIsLogedin] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Add loading state
    const Navigate = useNavigate();

    const login = async (data: ILoginRequest) => {
        setIsLoading(true);
        const response = await AuthService.AuthServiceLogin(data);
        setIsLoading(false);
        if (response.status === statusCode.BAD_REQUEST_STATUS) return response.data;
        window.sessionStorage.setItem('auth', JSON.stringify(response.data));
        setUser(response.data);
        setIsLogedin(true);
        return response.data;
    }

    const logout = () => {
        window.sessionStorage.removeItem('auth');
        setUser(null);
        setIsLogedin(false);
        Navigate('/')
    }

    const getUser = () => {
        const data = window.sessionStorage.getItem("auth");
        if (!data) return ;
        const us = JSON.parse(data);
        return us;
    }

    useEffect(() => {
        const data = window.sessionStorage.getItem("auth");
        if (data && !user) {
            const us = JSON.parse(data);
            setUser(us);
            setIsLogedin(true);
        }
        setIsLoading(false); // Mark loading as complete
    }, []);

    return {
        login, logout, user, setUser, isLogedin, isLoading, getUser // Return isLoading
    }
}