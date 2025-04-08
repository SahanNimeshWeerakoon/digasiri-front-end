import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {useCallback, useEffect, useState} from "react";
import TakePhoto from "@/components/Common/TakePhoto.tsx";

interface Props {
    src: string | undefined,
    label?: string,
    onUpload: any
}

export default function UploadImage({src, label = 'Upload Image', onUpload}: Props) {
    const [preivew, setPreivew] = useState<string | undefined>("/placeholder.png");
    const [url, setUrl] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [upload, setUpload] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<number>(0);

    const handleChange = useCallback(async (res: any) => {
        if (res) {
            setPreivew(res.imageUrl);
            setUrl(res.imageUrl);
            setLoading(false);
            setUpload(false);
        }
    },[]);

    useEffect(() => {
        if (url) onUpload(url);
    }, [url]);

    useEffect(() => {
        if (src) {
            setUrl(src);
            setPreivew(src);
            setRefresh(state => state + 1);
        }
    }, [src]);

    return (
        <Box sx={{display: 'flex', alignItems: 'center', columnGap: '0.5rem'}} key={refresh}>
            <img alt='Image Preview' src={preivew} onClick={() => {
                if(src) setOpen(true);
            }} style={{
                width: '40px',
                height: '40px',
                objectFit: 'cover',
                borderRadius: '4px'
            }}/>
            <Button variant="text" color="primary" onClick={() => setUpload(true)}>{loading ? 'Loading' : label}</Button>
            <Dialog onClose={setUpload} open={upload} maxWidth="sm">
                <DialogTitle>Take Photo</DialogTitle>
                <DialogContent>
                    <Box sx={{minWidth: 500}}>
                        <TakePhoto onChange={handleChange} />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button variant="text" color="primary" onClick={() => setUpload(false)}>Cancel</Button>
                    <Button variant="contained" color="primary" disabled={url===''}>Add</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md">
                <Box sx={{
                    backgroundImage: 'url(/placeholder.png)',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    minHeight: '20%',
                    display: 'flex',
                }}>
                    <img alt='Image Preview' src={preivew} style={{
                        width: '500px',
                        maxWidth: '500px',
                        objectFit: 'cover',
                        borderRadius: '4px'
                    }}/>
                </Box>
            </Dialog>
        </Box>
    );
}