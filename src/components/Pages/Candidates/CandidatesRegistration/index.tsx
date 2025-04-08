import {useState} from "react";
import {
    Box,
    Button,
    Accordion,
    Typography,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from "react-router";
import { grey } from '@mui/material/colors';
import { ExpandMore, CheckCircleOutline } from '@mui/icons-material';

import TabComponent from '@/components/UI/TabComponent.tsx';
import UploadImage from '@/components/Common/UploadImage.tsx'
import UploadImageDnd from "@/components/Common/UploadImageDnd.tsx";
import ModalScanFromPassport from "@/components/Common/Modals/ModalScanFromPassport.tsx";
import ModalFingerprintAdd from '@/components/Common/fingerprints/ModalFingerprintSelect';
import CandidateHeader from "@/components/Pages/Candidates/CandidatesEdit/CandidateHeader";
import FormCandidateInformation from '@/components/Common/Forms/FormCandidateInformation.tsx';
import StepperPatientRegistration from "@/components/Pages/Candidates/CandidatesEdit/StepperPatientRegistration";

import useFiles from '@/hooks/useFiles.ts';
import { ICandidate} from '@/utils/types.ts';
import useCandidate from '@/hooks/useCandidate.ts'

interface Candidate extends ICandidate {
    passportConfirmation: string;
}

export default function PatientsBase() {
    const [patient, setPatient] = useState<Candidate | null>({
        appointmentId: 0,
        id: 0,
        firstName: "",
        lastName: "",
        dateOfBirth: null,
        nationality: "",
        gender: "",
        passportNumber: "",
        slipNumber: 0,
        phone: "",
        email: "",
        photoPath: "",
        fingerPrintPath: [],
        profession: "",
        travellingTo: "",
        maritalStatus: "",
        passportIssueDate: null,
        passportIssuePlace: "",
        passportExpDate: null,
        visaType: "",
        agencyName: "",
        agencyNumber: 0,
        gamcaNumber: "",
        nic: "",
        positionAppliedFor: "",
        vaccination: "",
        other: "",
        createdBy: 0,
        updatedBy: 0,
        queueId: 0,
        createdAt: null,
        updatedAt: null,
        appointmentDate: null,
        visitedDate: null,
        passportConfirmation: ""
    });
    const [open, setOpen] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<number>(0);
    const [fingerPrint, setFingerPrint] = useState<{ modal: boolean, image: null | string }>({
        modal: false,
        image: null
    });
    const [updating, setUpdating] = useState<boolean>(false);

    const { uploadFiles } = useFiles();
    const {createCandidate} = useCandidate();
    const Navigate = useNavigate();

    const create = () => {
        setUpdating(true);
        createCandidate(patient).then((res: any) => {
            setRefresh(state => state + 1);
            setUpdating(false);
            toast.success('New Candidate Created Successfully!');
            if (res?.id) Navigate(`/patients/${res?.id}`);
        }).catch(err => {
            toast.error(err?.message ?? "New Candidate Creation failed!");
            setUpdating(false);
        })
    }

    const handleFingerPrintAdd = async () => {
        setFingerPrint(prev => ({...prev, modal: false, image}));
        const image = localStorage.getItem("fingerPrintImageSrc") ?? "";
        if (!image) {
            alert("Please Add a Fingerprint");
            return;
        }

        const formData = new FormData();
        formData.append("image", image);
        const res = await uploadFiles(formData);
        setPatient((prev: any) => ({...prev, fingerPrintPath: res.imageUrl}));
    }

    return (
        <>
            <CandidateHeader isRegister candidate={patient} children={<>
                <Button variant="contained" size="medium" sx={{backgroundColor: grey[300], color: '#000'}} onClick={() => Navigate('/patients')}>Cancel</Button>
                <Button variant="contained" size="medium" loading={updating} onClick={create}>Save</Button>
            </>} />

            <TabComponent tabs={[
                {
                    tab: {
                        label: 'Evaluation',
                    },
                    content: <div>
                        <StepperPatientRegistration loading={false} />
                        <Box sx={{padding: 2}}>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMore/>}
                                    aria-controls="panel1-content"
                                    id="panel1-header"
                                >
                                    <Box sx={{display: 'grid', gridTemplateColumns: '1fr 1fr', width: '100%'}}>
                                        <Typography component="span" variant="body1">Candidate Information</Typography>
                                        <Typography component="span" variant="body1" color="textSecondary">Personal Information</Typography>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        marginBottom: 2
                                    }}>
                                        <Box sx={{display: 'flex', alignItems: 'center', columnGap: '0.5rem', marginBottom: 1.5}}>
                                            <UploadImage src={patient?.photoPath} onUpload={(url: string) => {
                                                setPatient((prevState: any): any => {
                                                    return {
                                                        ...prevState,
                                                        photoPath: url
                                                    };
                                                });
                                            }}/>
                                            <Button sx={{display: 'flex', gap: '5px'}} onClick={() => {
                                                setFingerPrint((prev) => ({...prev, modal: true}))
                                            }}>
                                                {patient?.fingerPrintPath?.length ? <CheckCircleOutline color="success" /> : ""}
                                                ADD FINGERPRINT
                                            </Button>
                                        </Box>
                                        <Button variant="contained" color="secondary" onClick={() => setOpen(true)}>Scan From Passport</Button>
                                    </Box>
                                    <FormCandidateInformation key={refresh} candidate={patient} onChange={setPatient} />
                                    <ModalScanFromPassport open={open} setOpen={setOpen}
                                                           onAdd={(e: any) => setPatient(state => {
                                                               setRefresh(state => state + 1)
                                                               return {...state,...e};
                                                           })}/>
                                </AccordionDetails>
                            </Accordion>
                        </Box>
                    </div>
                },
                {
                    tab: {
                        label: 'Documents',
                    },
                    content: <>
                        <Box sx={{padding: 2}}>
                            <UploadImageDnd multiple/>
                        </Box>
                    </>
                }
            ]}/>

            <ModalFingerprintAdd
                isNew={true}
                patient={patient}
                setPatient={setPatient}
                open={fingerPrint.modal}
                add={handleFingerPrintAdd}
                setOpen={(val: boolean) => {
                    setFingerPrint((prev) => ({...prev, modal: val}))
                }}
            />
            
            <Toaster />
        </>
    );
}