import {
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    Stack,
    LinearProgress,
    Typography,
    RadioGroup,
    FormControlLabel, Radio, FormControl
} from "@mui/material";
import {useMemo, useState} from "react";
import useFiles from "@/hooks/useFiles.ts";
import UploadImageDnd from "@/components/Common/UploadImageDnd.tsx";
import {Delete, UploadFile} from "@mui/icons-material";
import ScanFromWebcam from "@/components/Common/ScanFromWebcam.tsx";

interface Props {
    onChange: (file: any) => void;
}

export default function ModalScanFromPassport({onChange}: Props) {
    const [selected, setSelected] = useState<string>('upload');
    const [preivew, setPreivew] = useState<any>(null);
    const [passport, setPassport] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const {uploadFiles} = useFiles();

    const handleChange = async (file: any) => {
        if (!file) return;
        setPassport({
            name: file.name,
            size: file.size,
            error: false
        });
        const formData = new FormData();
        formData.append("image", file);
        setLoading(true);
        const res = await uploadFiles(formData);
        if (res) {
            setPreivew(URL.createObjectURL(file));
            setLoading(false);
            onChange(res);
        }
    };

    const clearData = () => {
        setPreivew(null);
        setPassport(null);
        setLoading(false);
    }

    const selectedInputMethod = useMemo(() => {
        const upload = <>
            {preivew && <img src={preivew} style={{
                width: '100%',
                objectFit: 'cover',
                borderRadius: '4px'
            }}/>}
            <UploadImageDnd onFileChange={handleChange}/>
        </>;
        const device = <ScanFromWebcam onChange={handleChange}/>;

        switch (selected) {
            case "upload":
                return upload;
            case "device":
                return device;
            default:
                null
        }
    }, [selected, preivew]);

    const fileList = useMemo(() => {
        return <List dense sx={{
            width: '100%',
            bgcolor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
            marginTop: 1,
            rowGap: 2
        }}>
            {
                passport && <ListItem
                    disablePadding
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    <Stack direction="row" sx={{color: passport.error ? 'red' : '#1976D2'}}>
                        <ListItemAvatar sx={{display: 'grid', placeItems: 'center'}}>
                            <UploadFile sx={{color: 'currentColor'}}/>
                        </ListItemAvatar>
                        <Stack>
                            <Typography variant="subtitle1" sx={{whiteSpace: 'wrap'}}>{passport?.name}</Typography>
                            <Typography variant="body2" sx={{marginBottom: 0.5}}>{passport?.size}</Typography>
                            {loading && <LinearProgress/>}
                        </Stack>
                    </Stack>
                    <IconButton onClick={clearData}>
                        <Delete color="action"/>
                    </IconButton>
                </ListItem>
            }
        </List>
    }, [passport, loading]);

    return (
        <>
            <Stack direction="column" spacing={1}>
                <FormControl fullWidth>
                    <RadioGroup row value={selected} onChange={e => setSelected(e?.target?.value)}>
                        <FormControlLabel value="upload" control={<Radio/>} label="Upload"/>
                        <FormControlLabel value="device" control={<Radio/>} label="Scan from a device"/>
                    </RadioGroup>
                </FormControl>
                {selectedInputMethod}
                {fileList}
            </Stack>
        </>
    )
}