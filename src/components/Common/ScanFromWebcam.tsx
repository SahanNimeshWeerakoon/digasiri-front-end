import {Box, Button, FormControl, InputLabel, MenuItem, Select, Stack} from "@mui/material";
import {useCallback, useMemo, useRef, useState} from "react";
import Webcam from "react-webcam";

const videoConstraints = {
    width: 540,
    facingMode: "environment"
};

const DEFAULT_PREVIEW = "/placeholder.png";
const WEBCAM = 'webcam';

interface Props {
    onChange: (file:any) => void;
}

export default function UploadImage({onChange}:Props) {
    const [device, setDevice] = useState<string>('');
    const [preview, setPreview] = useState<string>(DEFAULT_PREVIEW);
    const webcamRef = useRef(null);

    const dataURItoFile = (dataURI:string, fileName:string) => {
        try {
            // Validate input
            if (typeof dataURI !== "string" || !dataURI.startsWith("data:")) {
                throw new Error("Invalid Data URI format.");
            }
            if (typeof fileName !== "string" || !fileName.trim()) {
                throw new Error("Invalid file name.");
            }

            // Extract metadata and base64 content
            const [metadata, base64Data] = dataURI.split(",");
            if (!metadata || !base64Data) {
                throw new Error("Malformed Data URI.");
            }

            // Extract MIME type
            const mimeMatch = metadata.match(/^data:(.*?);base64$/);
            if (!mimeMatch) {
                throw new Error("Invalid MIME type in Data URI.");
            }
            const mimeType = mimeMatch[1];

            // Decode base64 data
            const byteString = atob(base64Data);
            const byteArray = new Uint8Array(byteString.length);
            for (let i = 0; i < byteString.length; i++) {
                byteArray[i] = byteString.charCodeAt(i);
            }

            // Create a Blob and convert to File
            const blob = new Blob([byteArray], { type: mimeType });
            return new File([blob], fileName, { type: mimeType });

        } catch (error) {
            console.error("Error converting Data URI to file:", error);
            return null; // Return null in case of failure
        }
    }

    const capturePhoto = useCallback(async () => {
        // @ts-ignore
        const imageSrc = webcamRef?.current?.getScreenshot();
        setPreview(imageSrc);
    }, [webcamRef]);

    const onSelect = useCallback(() => {
        if (preview !== DEFAULT_PREVIEW) onChange(dataURItoFile(preview, `${Date.now()}.png`));
    },[preview])

    const GetWebcam = useMemo(() => {
        const camera = <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/png"
            videoConstraints={videoConstraints}
        />

        return device === WEBCAM ? camera : null;
    },[device]);

    const GetActions = useMemo(() => {
        const capture = <Button variant="contained" color="secondary" disabled={device !== WEBCAM} onClick={capturePhoto}>
            Capture
        </Button>
        const captured = <>
            <Button variant="text" color="secondary" onClick={() => setPreview(DEFAULT_PREVIEW)}>
                Retake
            </Button>
            <Button variant="contained" color="secondary" onClick={onSelect}>
                Select
            </Button>
        </>

        return preview === DEFAULT_PREVIEW ? capture : captured;
    },[device,preview]);

    const getPreview = useMemo(() => {
        return <img alt="Image Preview" src={preview} style={{
            width: '540px',
            aspectRatio: '1/0.5',
            objectFit: 'contain',
            backgroundColor: 'grey',
            borderRadius: '4px'
        }}/>
    },[preview]);

    return (
        <Box sx={{paddingTop: 0.5}}>
            <Stack direction="column" spacing={2}>
                <Stack direction="row" spacing={1} justifyContent="space-between">
                    <FormControl fullWidth>
                        <InputLabel>Device</InputLabel>
                        <Select
                            label="Nationality"
                            value={device || ''}
                            onChange={e => setDevice(e?.target?.value)}
                        >
                            <MenuItem value="">Select</MenuItem>
                            <MenuItem value={WEBCAM}>Webcam</MenuItem>
                        </Select>
                    </FormControl>
                    {GetActions}
                </Stack>
                { preview === DEFAULT_PREVIEW ? GetWebcam : getPreview }
            </Stack>
        </Box>
    );
}