import { useNavigate } from "react-router";
import useAuth from '@/hooks/useAuth';
import {useEffect} from "react";

const ProtectedRoute = ({layout=<div></div>}) => {
    const { isLogedin, isLoading } = useAuth(); // Get isLoading
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && !isLogedin) { // Check if loading is done
            navigate("/");
        }
    }, [isLogedin, isLoading, navigate]); // Add isLoading to dependencies

    if (isLoading) return null; // Show loading until check completes

    return <>{layout}</>;
};

export default ProtectedRoute;