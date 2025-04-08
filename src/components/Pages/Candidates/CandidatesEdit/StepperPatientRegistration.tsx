import { useState, useEffect } from 'react';
import { grey } from "@mui/material/colors";
import { Box, Skeleton, Step, StepLabel, Stepper, Typography } from "@mui/material";
import useQueue from '@/hooks/useQueue';
import StepIcon from '@mui/material/StepIcon';

interface Props {
    loading: boolean;
    candidateId?: string;
}

export default function StepperPatientRegistration({ candidateId, loading }: Props) {
    const [data, setData] = useState<any>({});

    const loadUI = <Skeleton variant="rectangular" sx={{ borderRadius: 6 }} width={100} height={44} />;

    const { getStepperData } = useQueue();

    useEffect(() => {
        if (candidateId) {
            getStepperData(candidateId)
                .then((res: any) => {
                    setData(res ?? {});
                })
                .catch(err => console.log(err));
        }
    }, []);

    // Custom step icon component
    const CustomStepIcon = (props: any) => {
        const { icon } = props;
        const isPhysicalStep = icon === 3;
        
    let color = 'rgba(0, 0, 0, 0.38)';
        if (isPhysicalStep) {
            if (data?.physical?.status === "fit") {
                color = '#1976d2';
            } else if (data?.physical?.status === "unfit") {
                color = '#ff9800';
            }
        }

        return <StepIcon {...props} sx={{ color }} />;
    };

    return (
        <Box sx={{ width: '100%', padding: 2, borderBottom: '1px solid', borderColor: grey[300] }}>
            <Stepper nonLinear>
                <Step active={candidateId !== undefined}>
                    {loading ? loadUI : <StepLabel optional={<Typography variant="caption">Receptionist</Typography>}>Registration</StepLabel>}
                </Step>
                <Step active={data?.blood?.val}>
                    {loading ? loadUI : <StepLabel optional={<Typography variant="caption">{data?.blood?.user}</Typography>}>Collect Blood</StepLabel>}
                </Step>
                <Step>
                    {loading ? loadUI : (
                        <StepLabel
                            StepIconComponent={CustomStepIcon}
                            optional={<Typography variant="caption">{data?.physical?.user}</Typography>}
                        >
                            Physical
                        </StepLabel>
                    )}
                </Step>
                <Step active={data?.xray?.val}>
                    {loading ? loadUI : <StepLabel optional={<Typography variant="caption">{data?.xray?.user}</Typography>}>Take X-Ray</StepLabel>}
                </Step>
                <Step active={data?.blood?.val}>
                    {loading ? loadUI : <StepLabel optional={<Typography variant="caption">{data?.blood?.user}</Typography>}>Blood Test</StepLabel>}
                </Step>
                <Step active={data?.vaccination?.val}>
                    {loading ? loadUI : <StepLabel optional={<Typography variant="caption">{data?.vaccination?.user}</Typography>}>Vaccination</StepLabel>}
                </Step>
            </Stepper>
        </Box>
    );
}