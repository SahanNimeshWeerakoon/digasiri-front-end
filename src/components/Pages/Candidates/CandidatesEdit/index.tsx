import {useEffect, useMemo, useRef, useState} from "react";
import {
    Box,
    Button,
    Typography,
    Menu,
    MenuItem,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    ListItem,
    Stack,
    ListItemAvatar,
    LinearProgress,
    List, Skeleton,
} from '@mui/material';
import {
    MoreHoriz,
    ExpandMore,
    UploadFile,
    CheckCircleOutline
} from '@mui/icons-material';
import {grey} from '@mui/material/colors';
import toast, {Toaster} from 'react-hot-toast';
import {useNavigate, useParams} from "react-router";
import TabComponent from '@/components/UI/TabComponent.tsx';
import FormCandidateInformation, {FormHandles} from '@/components/Common/Forms/FormCandidateInformation.tsx';
import {IEvaluationGroup, ICandidate, IUpdatedResults, IUpdatedEvaluationGroupResults} from '@/utils/types.ts';
import useFiles from "@/hooks/useFiles.ts";
import useQueue from "@/hooks/useQueue.ts";
import useCandidate from '@/hooks/useCandidate.ts'
import useMedicalTest from "@/hooks/useMedicalTest.ts";
import UploadImage from "@/components/Common/UploadImage.tsx";
import ModalRefund from "@/components/Common/Modals/ModalRefund.tsx";
import UploadImageDnd from "@/components/Common/UploadImageDnd.tsx";
import ModalFingerprintAdd from "@/components/Common/fingerprints/ModalFingerprintSelect";
import FinalResults from "@/components/Pages/Candidates/CandidatesEdit/FinalResults";
import CandidateHeader from "@/components/Pages/Candidates/CandidatesEdit/CandidateHeader";
import EvaluationGroup from "@/components/Pages/Candidates/CandidatesEdit/EvaluationGroup";
import GetQR from "@/components/Pages/Candidates/CandidatesEdit/GetQR";
import StepperPatientRegistration
    from "@/components/Pages/Candidates/CandidatesEdit/StepperPatientRegistration";

import useAuth from "@/hooks/useAuth.ts";
import {userRoles} from "@/utils/globalVariables.ts";
import useAppointment from "@/hooks/useAppointment.ts";
import {throttle} from "lodash";
import ModalScanFromPassport from "@/components/Common/Modals/ModalScanFromPassport.tsx";

interface Candidate extends ICandidate {
    passportConfirmation: string;
}

export default function PatientsBase() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const [refresh, setRefresh] = useState<number>(0);
    const [documents, setDocuments] = useState<any[]>([]);
    const [uploading, setUploading] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [updating, setUpdating] = useState<boolean>(false);
    const [alreadyInQueue, setAlreadyInQueue] = useState<boolean>(false);
    const [refundModal, setRefundModal] = useState<boolean>(false);
    const [_updatedResult, setUpdatedResult] = useState<any[]>([]);
    const [patient, setPatient] = useState<Candidate | null>(null);
    const [form, setForm] = useState<IEvaluationGroup[] | null>(null);
    const [tests, setTests] = useState<IEvaluationGroup[] | null>(null);
    const [results, setResults] = useState<IUpdatedResults | null>(null);
    const [_updatedGroupResult, setUpdatedGroupResult] = useState<any[]>([]);
    const [finalResult, setFinalResult] = useState<any>({
        appointmentId: 0,
        statue: "",
        remark: "",
        doctor: 0
    });
    const [fingerPrint, setFingerPrint] = useState<{ modal: boolean, image: null | string }>({
        modal: false,
        image: null
    });
    const [loadingSendInQueue, setLoadingSendInQueue] = useState<boolean>(false);
    const formRef = useRef<FormHandles>(null);
    const [openModal, setOpenModal] = useState<boolean>(false);

    const {id} = useParams();
    const {isInQueue, addToQueue} = useQueue();
    const {getCandidate, updateCandidate} = useCandidate();
    const {editManagerApproval} = useAppointment();
    const {fetchAllTests, fetchUpdatedResults, prepTestResults} = useMedicalTest();
    const {getDocuments, uploadFiles, uploadDocuments} = useFiles();
    const Navigate = useNavigate();
    const {getUser} = useAuth();

    const user = getUser();

    const loadData = async () => {
        setLoading(true);
        try {
            const candidate = await getCandidate(id);
            let updatedData: any = { ...candidate, passportConfirmation: candidate?.passportNumber || ''};
            setPatient(updatedData);
            if (candidate?.appointmentId) {
                const fetchArray = [fetchAllTests(), fetchUpdatedResults(candidate?.appointmentId), getDocuments(candidate?.appointmentId), isInQueue(id)];
                const res = await Promise.all(fetchArray);
                const [tests, results, documents, isInTheQueue] = res;
                setTests(tests);
                setResults(results);
                setDocuments(documents);
                setForm(prepTestResults(tests, results));
                setAlreadyInQueue(isInTheQueue?.isInTheQueue);
                setRefresh(state => state + 1);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    const update = async () => {
        setUpdating(true);
        try {
            const data = await Promise.all([updateCandidate(id, patient), editManagerApproval({
                ...finalResult,
                appointmentId: patient?.appointmentId,
            })])
            const [_a, _] = data;
            setUpdating(false);
            toast.success('Updated Candidate data!');
            await loadData();
            setRefresh(state => state + 1);
        } catch (error) {
            setUpdating(false);
            toast.error('Updating the data failed!');
            console.log(error)
        }
    }

    const handleUpload = async (file: any) => {
        if (!file) return;
        setUploading(state => [...state, {
            name: file?.name,
            size: file?.size,
        }])
        const formData = new FormData();
        formData.append("image", file);
        const res = await uploadFiles(formData);

        if (!res) return;
        const doc = await uploadDocuments({
            candidateId: id,
            appointmentId: patient?.appointmentId,
            filePath: res?.imageUrl,
            fileType: file?.name
        });

        if (!doc) return;
        getDocuments(patient?.appointmentId).then((documents) => {
            setDocuments(documents);
            setUploading(uploading.filter(item => item.name !== documents.fileType));
        });
    };

    const handleSendInQueue = async () => {
        if (!patient?.travellingTo) {
            toast.error('Please enter traveling to');
            return;
        }
        setPatient((state: any) => {
            return {
                ...state,
                visitedDate: new Date().toISOString()
            }
        })
        setLoadingSendInQueue(true);
        await update();
        try {
            await addToQueue(id, patient.travellingTo);
            setAlreadyInQueue(true);
            setLoadingSendInQueue(false);
            setRefresh(state => state + 1);
            toast.success('Send in queue!');
        } catch (error) {
            console.log(error);
            setLoadingSendInQueue(false);
            toast.error('Send in queue failed!');
        }
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

    const onTestTypeFieldChange = (e: IUpdatedResults) => {
        setUpdatedResult(state => {
            const filtered = state?.filter((field: IUpdatedResults) => {
                return field.testTypeFieldId !== e.testTypeFieldId
            });
            return [...filtered, e]
        });
    }

    const onGroupChange = (e: IUpdatedEvaluationGroupResults) => {
        setUpdatedGroupResult(state => {
            const filtered = state?.filter((field: IUpdatedEvaluationGroupResults) => {
                return field.evaluationGroupId !== e.evaluationGroupId
            });
            return [...filtered, e]
        });
    }

    const evaluationFormFilterBasedUserRole = () => {
        switch (user?.userData?.userRole) {
            case userRoles.manager:
                return form;

            case userRoles.doctor:
                return form?.filter(group => {
                    return group?.name === "Medical Evaluation";
                })

            case userRoles.nurse:
                return form?.filter(group => {
                    return group?.name === "Blood Collection" || group?.name === "Vaccination";
                })

            case userRoles.pathologist:
            case userRoles.labTech:
                return form?.filter(group => {
                    return group?.name === "Blood Evaluation";
                })

            case userRoles.radiographer:
            case userRoles.radiologist:
                return form?.filter(group => {
                    return group?.name === "X-Ray";
                })

            default:
                return [];
        }
    }

    const handlePatientUpdate = useMemo(
        () => throttle((update: Partial<ICandidate>) => {
            setPatient((prev: any) => ({...prev, ...update}));
        }, 300),
        []
    );

    const tabsBasedOnUserRole = () => {
        const evaluation = {
            tab: {
                label: 'Evaluation',
            },
            content: <div>
                <StepperPatientRegistration candidateId={id} loading={loading}/>
                {
                    loading ? <Stack spacing={1} sx={{padding: 2}}>
                        <Skeleton variant="rectangular" width={'100%'} height={32}/>
                        <Skeleton variant="rectangular" width={'100%'} height={32}/>
                        <Skeleton variant="rectangular" width={'100%'} height={32}/>
                    </Stack> : <Box sx={{padding: 2}}>
                        {
                            user?.userData?.userRole === userRoles.manager &&
                            <FinalResults data={finalResult} setData={setFinalResult}/>
                        }

                        {(user?.userData?.userRole === userRoles.receptionist || user?.userData?.userRole === userRoles.manager) &&
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMore/>}
                                    aria-controls="panel1-content"
                                    id="panel1-header"
                                >
                                    <Box sx={{display: 'grid', gridTemplateColumns: '1fr 1fr', width: '100%'}}>
                                        <Typography component="span" variant="body1">Candidate
                                            Information</Typography>
                                        <Typography component="span" variant="body1" color="textSecondary">Personal
                                            Information</Typography>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        columnGap: '0.5rem',
                                        marginBottom: 4
                                    }}>
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            columnGap: '0.5rem'
                                        }}>
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
                                                {patient?.fingerPrintPath?.length ?
                                                    <CheckCircleOutline color="success"/> : ""}
                                                ADD FINGERPRINT
                                            </Button>
                                        </Box>
                                        <Button variant="contained" color="secondary" onClick={() => setOpenModal(true)}>Scan From Passport</Button>
                                    </Box>
                                    <FormCandidateInformation
                                        ref={formRef}
                                        candidate={patient}
                                        onChange={handlePatientUpdate}
                                        onSubmit={() => update()}
                                    />
                                    <ModalScanFromPassport open={openModal} setOpen={setOpenModal}
                                                           onAdd={(e: any) => setPatient(state => {
                                                               setRefresh(state => state + 1)
                                                               return {...state,...e};
                                                           })}/>
                                </AccordionDetails>
                            </Accordion>
                        }
                        {
                            evaluationFormFilterBasedUserRole()?.map(group => {
                                return <EvaluationGroup key={group?.id} data={group}
                                                        appointmentId={patient?.appointmentId}
                                                        onChangeGroup={onGroupChange}
                                                        onChange={onTestTypeFieldChange}
                                                        afterContent={group?.name === 'Blood Collection' ?
                                                            <GetQR/> : null}/>
                            })
                        }
                    </Box>
                }
            </div>
        }
        const document = {
            tab: {
                label: 'Documents',
            },
            content: <>
                <Box sx={{padding: 2}}>
                    <UploadImageDnd onFileChange={handleUpload}/>
                    <List dense sx={{
                        width: '100%',
                        bgcolor: 'background.paper',
                        display: 'flex',
                        flexDirection: 'column',
                        marginTop: 1,
                        rowGap: 2
                    }}>
                        {
                            documents.map((e, index) => <ListItem
                                key={index}
                                disablePadding
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Stack direction="row" sx={{color: '#1976D2'}}>
                                    <ListItemAvatar sx={{display: 'grid', placeItems: 'center'}}>
                                        <UploadFile sx={{color: 'currentColor'}}/>
                                    </ListItemAvatar>
                                    <Stack>
                                        <Typography component="a" target="_blank" href={e?.filePath}
                                                    variant="subtitle1" sx={{
                                            whiteSpace: 'wrap',
                                            color: 'inherit',
                                            textDecoration: 'none'
                                        }}>
                                            {e?.fileType}
                                        </Typography>
                                        {/*<Typography variant="body2" sx={{marginBottom: 0.5}}>{passport?.size}</Typography>*/}
                                        {/*{loading && <LinearProgress />}*/}
                                    </Stack>
                                </Stack>
                                {/*<IconButton>*/}
                                {/*    <Delete color="action"/>*/}
                                {/*</IconButton>*/}
                            </ListItem>)
                        }
                        {
                            uploading.map((e, index) => <ListItem
                                key={index}
                                disablePadding
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Stack direction="row" sx={{color: '#1976D2'}}>
                                    <ListItemAvatar sx={{display: 'grid', placeItems: 'center'}}>
                                        <UploadFile sx={{color: 'currentColor'}}/>
                                    </ListItemAvatar>
                                    <Stack>
                                        <Typography component="a" target="_blank" href={e?.filePath}
                                                    variant="subtitle1" sx={{whiteSpace: 'wrap'}}>
                                            {e?.name}
                                        </Typography>
                                        <Typography variant="body2"
                                                    sx={{marginBottom: 0.5}}>{e?.size}</Typography>
                                        <LinearProgress/>
                                    </Stack>
                                </Stack>
                            </ListItem>)
                        }
                    </List>
                </Box>
            </>
        }

        switch (user?.userData?.userRole) {
            case userRoles.manager:
            case userRoles.receptionist:
            case userRoles.radiographer:
            case userRoles.radiologist:
                return [evaluation, document];

            case userRoles.nurse:
            case userRoles.pathologist:
            case userRoles.labTech:
            case userRoles.doctor:
                return [evaluation];

            default:
                return [];
        }
    }

    const userActions = (<>
        <Button variant="contained" size="medium" onClick={() => Navigate('/patients')}
                sx={{backgroundColor: grey[300], color: '#000'}}>Cancel</Button>
        {
            (user?.userData?.userRole === userRoles.receptionist || user?.userData?.userRole === userRoles.manager) &&
            <div>
                <Button variant="contained" size="medium" color="secondary" endIcon={<MoreHoriz/>}
                        id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}>More</Button>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl || undefined}
                    open={open}
                    onClose={handleClose}
                    sx={{
                        marginTop: 1
                    }}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    <MenuItem onClick={() => Navigate(`/report/registration/${patient?.id}`)}>Print
                        Registration</MenuItem>
                    <MenuItem onClick={() => Navigate(`/report/medical/${patient?.id}`)}>Print/View Medical
                        Report</MenuItem>
                    <MenuItem onClick={() => setRefundModal(true)}>Refund</MenuItem>
                </Menu>
            </div>
        }
        <Button variant="contained" size="medium" loading={updating} onClick={() => {
            formRef.current?.submit();
        }}>Save</Button>
        <Button
            size="medium"
            variant="contained"
            disabled={alreadyInQueue}
            loading={loadingSendInQueue}
            onClick={() => !alreadyInQueue ? handleSendInQueue() : null}
        >
            {alreadyInQueue ? 'In Queue' : 'Send in Queue'}
        </Button>
    </>);

    useEffect(() => {
        setForm(prepTestResults(tests, results));
        setFinalResult({...results?.managerRemark, appointmentId: patient?.appointmentId});
    }, [tests, results, setTests, setResults]);

    useEffect(() => {
        if (id) {
            loadData();
        }
    }, [id]);

    return (
        <>
            <Stack direction="column" key={refresh}>
                <CandidateHeader
                    candidate={patient}
                    loading={loading}
                    children={
                        <>
                            {
                                loading ?
                                    <Skeleton variant="rectangular" sx={{borderRadius: 6}} width={500} height={40}/> :
                                    userActions
                            }
                        </>
                    }/>

                <TabComponent tabs={tabsBasedOnUserRole()}/>

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

                <ModalRefund
                    open={refundModal}
                    setOpen={setRefundModal}
                    appointmentId={patient?.appointmentId}
                    id={patient?.nic}
                    name={(patient?.firstName && patient?.lastName) ? `${patient?.firstName} ${patient?.lastName}` : 'Candidate Name'}
                    passpoort={patient?.passportNumber}
                    image={patient?.photoPath}
                />

                <Toaster/>
            </Stack>
        </>
    );
}