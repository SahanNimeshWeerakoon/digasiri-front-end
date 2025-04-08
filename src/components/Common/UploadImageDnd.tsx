import {FileUploader} from "react-drag-drop-files";
import {Link, Stack, Typography} from "@mui/material";
import {UploadFile} from "@mui/icons-material";
import {styled} from "@mui/material/styles";
import {useEffect, useState} from "react";

const VisuallyHiddenInput = styled('div')({
    borderWidth: '1px',
    borderStyle: 'dashed',
    borderColor: 'gray',
    borderRadius: '0.25rem',
    padding: '1rem',
});

// @ts-expect-error
export default function UploadImageDnd({name = 'file', fileTypes = ['JPG','JPEG', 'PNG'], multiple = false, onFileChange = (files:any) => {}}) {
    const [file, setFile] = useState<File | null>(null);

    const handleChange = (newFile:any) => {
        setFile(newFile);
    };

    useEffect(() => {
        onFileChange(file);
    }, [file]);

    return (
        <>
            <FileUploader name={name} multiple={multiple} types={fileTypes} handleChange={handleChange}>
                <VisuallyHiddenInput>
                    <Stack sx={{
                        alignItems: 'center',
                        paddingBlock: '2rem'
                    }} spacing={0.5}>
                        <UploadFile sx={{color: '#1976D2'}}/>
                        <Typography variant="subtitle1" sx={{textAlign:'center'}}><Link>Link</Link> or drag and
                            drop</Typography>
                        <Typography variant="body2" sx={{textAlign:'center'}} color="textSecondary">{`${fileTypes.join(', ')} (max 3MB)`}</Typography>
                    </Stack>
                </VisuallyHiddenInput>
            </FileUploader>
        </>
    );
}