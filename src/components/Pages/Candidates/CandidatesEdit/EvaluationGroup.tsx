import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box, Chip, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField,
    Typography,
} from "@mui/material";
import {ExpandMore} from "@mui/icons-material";
import {IEvaluationGroup} from "@/utils/types.ts";
import TestType from "@/components/Pages/Candidates/CandidatesEdit/TestType";
import {useEffect, useState} from "react";
import TabComponent from "@/components/UI/TabComponent.tsx";
import useMedicalTest from "@/hooks/useMedicalTest.ts";
import useAuth from "@/hooks/useAuth.ts";
import {userRoles} from "@/utils/globalVariables.ts";

interface Props {
    data: IEvaluationGroup;
    appointmentId: number | undefined;
    onChange: any;
    onChangeGroup: any;
    afterContent?: any
}

export default function EvaluationGroup({data, appointmentId, onChange, onChangeGroup, afterContent}: Props) {
    const [remarks, setRemarks] = useState<string>('');
    const [result, setResult] = useState<string>('');

    const {getUser} = useAuth();
    const user = getUser();
    const {editUpdatedEvaluationGroupResults} = useMedicalTest()

    const onUpdateValue = async (remarks: any, result: any) => {
        const params = {
            remarks: remarks,
            result: result,
            appointmentId: appointmentId,
            evaluationGroupId: data?.id,

        };
        onChangeGroup(params);
        await editUpdatedEvaluationGroupResults(params);
    }

    const testTypes = data?.TestTypes?.map(type => {
        return <TestType key={type?.id} data={type} appointmentId={appointmentId} onChange={onChange}/>
    });

    const medicalEvaluation = <Box sx={{marginTop: 2}}>
        <TabComponent tabs={[
            {
                tab: {
                    label: 'General',
                },
                content: <>
                    {
                        data?.TestTypes?.map(type => {
                            if (type?.tabName !== "General") return;
                            return <TestType key={type?.id} data={type} appointmentId={appointmentId}
                                             onChange={onChange}/>
                        })
                    }
                </>
            },
            {
                tab: {
                    label: 'Systematic',
                },
                content: <>
                    {
                        data?.TestTypes?.map(type => {
                            if (type?.tabName !== "Systematic") return;
                            return <TestType key={type?.id} data={type} appointmentId={appointmentId}
                                             onChange={onChange}/>
                        })
                    }
                </>
            },
            {
                tab: {
                    label: 'Respiratory',
                },
                content: <>
                    {
                        data?.TestTypes?.map(type => {
                            if (type?.tabName !== "Respiratory") return;
                            return <TestType key={type?.id} data={type} appointmentId={appointmentId}
                                             onChange={onChange}/>
                        })
                    }
                </>
            },
            {
                tab: {
                    label: 'Veneral',
                },
                content: <>
                    {
                        data?.TestTypes?.map(type => {
                            if (type?.tabName !== "Veneral") return;
                            return <TestType key={type?.id} data={type} appointmentId={appointmentId}
                                             onChange={onChange}/>
                        })
                    }
                </>
            },
            {
                tab: {
                    label: 'Other',
                },
                content: <>
                    {
                        data?.TestTypes?.map(type => {
                            if (type?.tabName !== "Other") return;
                            return <TestType key={type?.id} data={type} appointmentId={appointmentId}
                                             onChange={onChange}/>
                        })
                    }
                </>
            },
        ]}/>
    </Box>

    useEffect(() => {
        if (result || remarks) onUpdateValue(remarks, result);
    }, [remarks, setRemarks, result, setResult]);

    useEffect(() => {
        setRemarks(data?._value?.remarks || "")
        setResult(data?._value?.result || "")
    }, [data])

    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMore/>}
                aria-controls="panel1-content"
                id="panel1-header"
            >
                <Box sx={{display: 'grid', gridTemplateColumns: '1fr 1fr', width: '100%'}}>
                    <Typography component="span" variant="body1">{data?.name}</Typography>
                    <Typography component="span" variant="body1"
                                color="textSecondary">{`All details about the ${data?.name}`}</Typography>
                </Box>
            </AccordionSummary>
            <AccordionDetails>
                {
                    [userRoles.manager, userRoles.doctor, userRoles.pathologist, userRoles.radiologist].includes(user?.userData?.userRole) && (data?.name !== "Blood Collection" && data?.name !== 'Vaccination') ?
                        <Box>
                            <FormControl sx={{minWidth: '100%', marginBottom: 2}}>
                                <FormLabel>Result</FormLabel>
                                <RadioGroup row value={result} onChange={e => setResult(e?.target.value)}>
                                    <FormControlLabel
                                        label=""
                                        value="fit"
                                        sx={{marginRight: 1}}
                                        control={
                                            <Radio
                                                sx={{paddingRight: 0}}
                                                icon={<Chip label="Fit" color="success"
                                                variant="outlined"/>}
                                                checkedIcon={
                                                    <Chip
                                                        label="Fit"
                                                        color="success"
                                                        variant="filled"/>
                                                }
                                            />
                                        }
                                    />
                                    <FormControlLabel value="unfit" label="" control={<Radio
                                        icon={<Chip label="Unfit" color="error" variant="outlined"/>}
                                        checkedIcon={<Chip label="Unfit" color="error" variant="filled"/>}
                                    />}/>
                                </RadioGroup>
                            </FormControl>
                            <TextField
                                label="Remarks if neccessary"
                                value={remarks}
                                onChange={e => setRemarks(e?.target.value)}
                                multiline
                                rows={4}
                                fullWidth
                            />
                        </Box> : null
                }
                {data?.name === "Medical Evaluation" ? medicalEvaluation : testTypes}
                {afterContent ? afterContent : ''}
            </AccordionDetails>
        </Accordion>
    );
}