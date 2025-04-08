import {useEffect, useState, MouseEvent} from 'react'
import useAuth from '@/hooks/useAuth';
import {useNavigate} from "react-router";
import CircularProgress from '@mui/material/CircularProgress';
import {
    Alert,
    Box,
    Button,
    Divider,
    FormControl, IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Typography
} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";

export default function LoginBase() {
    const {login, user, isLoading} = useAuth(); // Get isLoading
    const navigate = useNavigate();
    const [isError, setIsError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [response, setResponse] = useState<any>(null);

    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const onLogin = async (e: any) => {
        e.preventDefault();
        try {
            setLoading(true);
            const formData = new FormData(e.target);
            const res = await login({
                username: String(formData.get('username')),
                password: String(formData.get('password')),
            });
            setResponse(res);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setIsError(true);
            setResponse(error)
        }
    }

    useEffect(() => {
        if (!isLoading && user !== null) { // Check if loading is done
            navigate("/patients");
        }
    }, [user, isLoading]); // Add isLoading to dependencies

    return (
        <Box sx={{display: 'grid', height: '100vh', width: '100%'}}>
            <Box sx={{
                width: '100%',
                height: '100%',
                position: 'fixed',
                inset: 0,
                zIndex: -1,
            }}>
                <img alt="backgroud image" src="/bg-login.png" style={{
                    objectFit: 'cover',
                    width: '100%',
                    height: '100%',
                }}/>
            </Box>
            <Box sx={{paddingInline: 3, height: '100%', display: 'grid', gridTemplateColumns: '1fr auto'}}>
                <Box>
                    <Box><img alt="logo" src="/logo.svg"/></Box>
                </Box>
                <Box sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.75)',
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    paddingInline: 4,
                    rowGap: 4,
                    maxWidth: '23rem',
                    minWidth: '23rem',
                }}>
                    <Typography variant="h5" sx={{fontWeight: 500}} component="h2">Enter Logins</Typography>
                    {isError && <Alert severity="error">{response?.response?.data?.message}</Alert>}
                    <form onSubmit={onLogin} style={{
                        display: 'flex',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        rowGap: '1rem'
                    }}>
                        <label style={{display: 'flex', flexDirection: 'column'}}>
                            <FormControl sx={{width: '100%'}} variant="outlined">
                                <InputLabel htmlFor="email">Email</InputLabel>
                                <OutlinedInput
                                    id="email"
                                    type="text"
                                    name="username"
                                    placeholder="Enter username"
                                    label="Email"
                                    sx={{width: '100%'}}
                                />
                            </FormControl>
                        </label>
                        <label style={{display: 'flex', flexDirection: 'column'}}>
                            <FormControl sx={{width: '100%'}} variant="outlined">
                                <InputLabel htmlFor="password">Password</InputLabel>
                                <OutlinedInput
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="Enter password"
                                    sx={{width: '100%'}}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label={
                                                    showPassword ? 'hide the password' : 'display the password'
                                                }
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                onMouseUp={handleMouseUpPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff/> : <Visibility/>}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label="Password"
                                />
                            </FormControl>
                        </label>
                        <Box sx={{display: 'flex', justifyContent: 'end'}}>
                            <Button variant="text" color="primary">Forgot password</Button>
                        </Box>
                        <Button variant="contained" color="primary" type="submit">
                            {loading ? <CircularProgress color='inherit' size={25}/> : 'Login'}
                        </Button>
                    </form>
                    <Box sx={{display: 'flex', justifyContent: 'center', justifySelf: 'end'}}>
                        <Button variant="text" color="primary">Terms Of use</Button>
                        <Divider orientation="vertical" variant="middle" flexItem/>
                        <Button variant="text" color="primary">Privacy Policy</Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}