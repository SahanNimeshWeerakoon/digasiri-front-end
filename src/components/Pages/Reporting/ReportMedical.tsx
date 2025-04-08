import {Container, Paper, Typography, Divider, Box, Grid2, Fab, Stack} from "@mui/material";
import {useParams} from 'react-router';
// @ts-ignore
import {Preview, print} from 'react-html2pdf';
import useCandidate from "@/hooks/useCandidate.ts";
import {useEffect, useState} from "react";
import {ICandidate, IEvaluationGroup, ITestType, ITestTypeField} from "@/utils/types.ts";
import {format, parseISO} from "date-fns";
import useMedicalTest from "@/hooks/useMedicalTest.ts";
import {
    Download
} from '@mui/icons-material';
import { Margin, usePDF } from 'react-to-pdf';

const MedicalReport = () => {
    const {id} = useParams();
    const {getCandidate} = useCandidate();
    const {fetchAllTests, fetchUpdatedResults, prepTestResults} = useMedicalTest();

    const [Candidate, setCandidate] = useState<ICandidate | null>(null);
    const [prepedData, setPrepedData] = useState<any>(null);
    const [results, setResults] = useState<any>(null);

    const {toPDF, targetRef} = usePDF({filename: 'page.pdf',page: { margin: Margin.MEDIUM }});

    useEffect(() => {
        getCandidate(id).then((res: any) => {
            setCandidate(res);
            Promise.all([fetchAllTests(), fetchUpdatedResults(res?.appointmentId)]).then(res => {
                const [tests, results] = res;
                setResults(results);
                setPrepedData(prepTestResults(tests, results));
            })
        })
    }, [id]);

    const hrItems = ["Medical Evaluation","Blood Evaluation"];

    const pdf = () => {
        return <Paper sx={{padding: 4, margin: "20px auto", maxWidth: "800px"}}>
            <Box textAlign="center">
                <Typography variant="h5" fontWeight="bold">BUDAIR DIAGNOSTIC CENTER</Typography>
                <Typography variant="subtitle1">No. 58, Ground Floor, HKB 1/1, Basement Floor, Dharmapala,
                    Mawatha, Colombo-3, Sri Lanka</Typography>
                <Typography variant="subtitle2">Phone: +94112389251 | Email:
                    budair.diagnostic@gmail.com</Typography>
            </Box>
            <Divider sx={{marginY: 2}}/>
            <Box>
                <Stack direction="row" justifyContent="center">
                    <Typography variant="h6" fontWeight="bold" sx={{marginBottom: 2}}>Patient
                        Information</Typography>
                </Stack>
                <Grid2 container spacing={3}>
                    <Grid2 size={2}>
                        {Candidate?.photoPath ? <img alt="patient image" style={{width:'100%',objectFit: 'cover'}} src={Candidate?.photoPath}/> : <Box sx={{width:'100%',aspectRatio: '1/1',backgroundColor: 'grey'}}></Box>}
                    </Grid2>
                    <Grid2 size={5}>
                        <Typography><strong>First Name: </strong>{Candidate?.firstName}</Typography>
                        <Typography><strong>Last Name: </strong>{Candidate?.lastName}</Typography>
                        <Typography><strong>Gender: </strong>{Candidate?.gender === 'M' ? 'Male' : 'Female'}</Typography>
                        <Typography><strong>Date Of Birth: </strong>{Candidate?.dateOfBirth ? format(parseISO(Candidate?.dateOfBirth.toISOString()), 'dd/MM/yyyy') : ""}</Typography>
                        <Typography><strong>Nationality: </strong>{Candidate?.nationality}</Typography>
                    </Grid2>
                    <Grid2 size={5}>
                        <Typography><strong>Passport Number: </strong>{Candidate?.passportNumber}</Typography>
                        <Typography><strong>Passport Issued Place: </strong>{Candidate?.passportIssuePlace}</Typography>
                        <Typography><strong>Travelling To: </strong>{Candidate?.travellingTo}</Typography>
                        <Typography><strong>Marital Status: </strong>{Candidate?.maritalStatus}</Typography>
                        <Typography><strong>Position Applied For: </strong>{Candidate?.positionAppliedFor}</Typography>
                    </Grid2>
                </Grid2>
            </Box>
            <Divider sx={{marginY: 2}}/>
            <Grid2 container spacing={1.5}>
                {
                    prepedData?.filter((item: IEvaluationGroup) => hrItems.includes(item.name)).map((egroup: IEvaluationGroup) => {
                        return <>
                            <Grid2 size={6}>
                                <Box>
                                    <Typography variant="h6" fontWeight="bold" sx={{marginBottom: 1}}>{egroup?.name}</Typography>
                                    <Grid2 container>
                                        {
                                            egroup?._value?.result && <>
                                                <Grid2 size={2}>
                                                    <Typography variant="body2" fontWeight="bold">Result</Typography>
                                                </Grid2>
                                                <Grid2 size={10}>
                                                    <Typography variant="body2">{egroup?._value?.result}</Typography>
                                                </Grid2>
                                            </>
                                        }
                                        {
                                            egroup?._value?.remarks && <>
                                                <Grid2 size={2}>
                                                    <Typography variant="body2" fontWeight="bold">Remark</Typography>
                                                </Grid2>
                                                <Grid2 size={10}>
                                                    <Typography variant="body2">{egroup?._value?.remarks}</Typography>
                                                </Grid2>
                                            </>
                                        }
                                    </Grid2>

                                    {
                                        egroup?.TestTypes?.map((ttype: ITestType) => {
                                            return <>
                                                <Typography variant="body1" fontWeight="bold" sx={{
                                                    marginBottom: 2,
                                                    marginTop: 2
                                                }}>{ttype?.testName}</Typography>
                                                {ttype?.TestTypeFields?.map((ttfield: ITestTypeField) => {
                                                    return <>
                                                        {
                                                            ttfield?.inputType !== 'file' ?
                                                                <Typography>{ttfield?.testTypeFieldName}:{ttfield?._value?.result}</Typography> : ''
                                                        }
                                                    </>
                                                })}
                                            </>
                                        })
                                    }
                                </Box>
                            </Grid2>
                        </>
                    })
                }
            </Grid2>
            <Divider sx={{marginY: 2}}/>
            {
                prepedData?.filter((item: IEvaluationGroup) => !hrItems.includes(item.name)).map((egroup: IEvaluationGroup) => {
                    return <>
                        <Box>
                            <Typography variant="h6" fontWeight="bold" sx={{marginBottom: 1}}>{egroup?.name}</Typography>
                            <Grid2 container>
                                {
                                    egroup?._value?.result && <>
                                        <Grid2 size={2}>
                                            <Typography variant="body2" fontWeight="bold">Result</Typography>
                                        </Grid2>
                                        <Grid2 size={10}>
                                            <Typography variant="body2">{egroup?._value?.result}</Typography>
                                        </Grid2>
                                    </>
                                }
                                {
                                    egroup?._value?.remarks && <>
                                        <Grid2 size={2}>
                                            <Typography variant="body2" fontWeight="bold">Remark</Typography>
                                        </Grid2>
                                        <Grid2 size={10}>
                                            <Typography variant="body2">{egroup?._value?.remarks}</Typography>
                                        </Grid2>
                                    </>
                                }
                            </Grid2>

                            {
                                egroup?.TestTypes?.map((ttype: ITestType) => {
                                    return <>
                                        <Typography variant="body1" fontWeight="bold" sx={{
                                            marginBottom: 2,
                                            marginTop: 2
                                        }}>{ttype?.testName}</Typography>
                                        {ttype?.TestTypeFields?.map((ttfield: ITestTypeField) => {
                                            return <>
                                                {
                                                    ttfield?.inputType !== 'file' ?
                                                        <Typography>{ttfield?.testTypeFieldName}:{ttfield?._value?.result}</Typography> : ''
                                                }
                                            </>
                                        })}
                                    </>
                                })
                            }
                        </Box>
                        <Divider sx={{marginY: 2}}/>
                    </>
                })
            }
            <Box>
                <Typography variant="h6" fontWeight="bold"
                            sx={{marginBottom: 3}}>Final Results</Typography>
                <Grid2 container spacing={1.5}>
                    <Grid2 size={2}>
                        <Typography variant="body1" fontWeight="bold">Status</Typography>
                    </Grid2>
                    <Grid2 size={10}>
                        <Typography variant="body1">{results?.managerRemark?.status}</Typography>
                    </Grid2>
                    <Grid2 size={2}>
                        <Typography variant="body1" fontWeight="bold">Remark</Typography>
                    </Grid2>
                    <Grid2 size={10}>
                        <Typography variant="body1">{results?.managerRemark?.remark}</Typography>
                    </Grid2>
                </Grid2>
                <Typography variant="body2" marginTop={10}>
                    Signature of Candidate: ________________________
                </Typography>
            </Box>
        </Paper>
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{paddingBlock: 1, maxWidth: 864, marginInline: 'auto'}}>
                <Fab color="primary" aria-label="add" onClick={() => toPDF()}>
                    <Download/>
                </Fab>
            </Box>
            <div ref={targetRef}>
                {pdf()}
            </div>
        </Container>
    );
};

export default MedicalReport;