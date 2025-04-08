import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid2, IconButton, List, ListItem, ListItemAvatar, Stack, LinearProgress,
    Typography
} from "@mui/material";
import FormPassportInformation from "@/components/Common/Forms/FormPassportInformation.tsx";
import {useState} from "react";
import useFiles from "@/hooks/useFiles.ts";
import UploadImageDnd from "@/components/Common/UploadImageDnd.tsx";
import {Delete, UploadFile} from "@mui/icons-material";
import _ from "lodash";
import { parse } from "date-fns";

const emptyPatient = {
    firstName: "",
    lastName: "",
    dateOfBirth: null,
    nationality: "",
    gender: "",
    passportNumber: "",
    passportIssueDate: null,
    passportIssuePlace: "",
    passportExpDate: null,
    nic: "",
}

export default function ModalScanFromPassport ({open, setOpen, onAdd }:{open:boolean, setOpen:any, onAdd:any}) {
    const [preivew, setPreivew] = useState<any>(null);
    const [passport, setPassport] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [patient, setPatient] = useState<any>(emptyPatient);
    const [refresh, setRefresh] = useState<number>(0);

    const { scanFromPassport } = useFiles();

    const handleChange = (file:any) => {
        if (!file) return;
        setPassport({
            name: file.name,
            size: file.size,
            error: false
        });
        const formData = new FormData();
        formData.append("image", file);
        setLoading(true);
        scanFromPassport(formData).then((res) => {
            if (res) {
                const { Sex, Surname, First_Name, Nic, Passport_Number, Nationality, Date_of_Birth, Date_of_Expiry, Date_of_Issue,Authority } = res.extractedData;
                setPreivew(URL.createObjectURL(file));
                setPatient((state: any) => {
                    return {
                        ...state,
                        gender: Sex,
                        lastName: Surname,
                        firstName: First_Name,
                        nic: Nic,
                        passportNumber: Passport_Number,
                        nationality: _.capitalize(Nationality),
                        dateOfBirth: parse(Date_of_Birth, "dd/MM/yyyy", new Date()),
                        passportExpDate: parse(Date_of_Expiry, "dd/MM/yyyy", new Date()),
                        passportIssueDate: parse(Date_of_Issue, "dd/MM/yyyy", new Date()),
                        passportIssuePlace: Authority,
                    }
                });
            }
            setLoading(false);
            setRefresh(state => state + 1);
        }).catch((err) => {
            console.log(err)
            setLoading(false);
            setPassport({
                name: file.name,
                size: file.size,
                error: true
            });
        });
    };

    const clearData = () => {
        setPreivew(null);
        setPassport(null);
        setLoading(false);
        setPatient(emptyPatient);
    }

    const addPatient = () => {
        onAdd(patient);
        setOpen(false);
        clearData();
    }

    return (
        <Dialog onClose={setOpen} open={open} maxWidth="xl">
            <DialogTitle>Scan From Passport</DialogTitle>
            <DialogContent>
                <Grid2 container key={refresh}>
                    <Grid2 size={4}>
                        <Typography variant="h6" sx={{marginBottom: 1.5}}>Preview</Typography>
                        {preivew && <img src={preivew} style={{
                            width: '100%',
                            objectFit: 'cover',
                            borderRadius: '4px'
                        }}/>}
                        <UploadImageDnd onFileChange={handleChange} />
                        <List dense sx={{
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
                                    <Stack direction="row" sx={{color: passport.error ? 'red':'#1976D2'}}>
                                        <ListItemAvatar sx={{display: 'grid', placeItems: 'center'}}>
                                            <UploadFile sx={{color: 'currentColor'}}/>
                                        </ListItemAvatar>
                                        <Stack>
                                            <Typography variant="subtitle1" sx={{whiteSpace:'wrap'}}>{passport?.name}</Typography>
                                            <Typography variant="body2" sx={{marginBottom: 0.5}}>{passport?.size}</Typography>
                                            {loading && <LinearProgress />}
                                        </Stack>
                                    </Stack>
                                    <IconButton onClick={clearData}>
                                        <Delete color="action"/>
                                    </IconButton>
                                </ListItem>
                            }
                        </List>
                    </Grid2>
                    <Grid2 size={8}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            paddingBlock: 1
                        }}>
                            <Divider orientation="vertical" flexItem sx={{marginInline: 2}}/>
                            <FormPassportInformation candidate={patient} onChange={setPatient} />
                        </Box>
                    </Grid2>
                </Grid2>
            </DialogContent>
            <DialogActions>
                <Button variant="text" color="primary" onClick={() => setOpen(false)}>Cancel</Button>
                <Button variant="contained" color="primary" onClick={addPatient}>Add</Button>
            </DialogActions>
        </Dialog>
    )
}