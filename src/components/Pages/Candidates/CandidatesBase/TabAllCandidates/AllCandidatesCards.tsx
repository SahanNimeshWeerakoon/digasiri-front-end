import {
    Box,
    Card, Skeleton,
    Typography
} from '@mui/material';
import useCandidate from "@/hooks/useCandidate.ts";
import {useEffect, useState} from "react";
import {IPatientsStats} from "@/utils/types.ts";

interface Props {
    totalCandidates: number
}

const AllCandidatesCards = ({ totalCandidates }: Props) => {
    const [stat, setStat] = useState<IPatientsStats | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const {getCandidateStat} = useCandidate();

    const loadData = () => {
        setLoading(true);
        getCandidateStat().then((res) => {
            setLoading(false);
            setStat(res ?? {});
        });
    }

    useEffect(() => {
        loadData();
    }, []);

    return (
        <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            columnGap: '1rem',
            p: 2
        }}
        >
            {
                loading ? <>
                        <Skeleton variant="rectangular" height={133}/>
                        <Skeleton variant="rectangular" height={133}/>
                        <Skeleton variant="rectangular" height={133}/>
                        <Skeleton variant="rectangular" height={133}/>
                        <Skeleton variant="rectangular" height={133}/>
                        <Skeleton variant="rectangular" height={133}/>
                    </> :
                    <>
                        <Card variant="outlined" sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            rowGap: '1.5rem'
                        }}>
                            <Typography variant="subtitle2" color="primary">Total Candidates</Typography>
                            <Typography variant="h6">{totalCandidates}</Typography>
                        </Card>
                        <Card variant="outlined" sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            rowGap: '1.5rem'
                        }}>
                            <Typography variant="subtitle2" color="primary">Total Appointments</Typography>
                            <Typography variant="h6">{stat?.total_candidates}</Typography>
                        </Card>
                        <Card variant="outlined" sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            rowGap: '1.5rem'
                        }}>
                            <Typography variant="subtitle2" color="error">Less than 14 days</Typography>
                            <Typography variant="h6">{stat?.candidates_in_0_to_14_days}</Typography>
                        </Card>
                        <Card variant="outlined" sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            rowGap: '1.5rem'
                        }}>
                            <Typography variant="subtitle2" color="warning">16-14 Days Remaining</Typography>
                            <Typography variant="h6">{stat?.candidates_in_14_to_16_days}</Typography>
                        </Card>
                        <Card variant="outlined" sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            rowGap: '1.5rem'
                        }}>
                            <Typography variant="subtitle2" sx={{color: '#FBC02D'}}>20-16 Days
                                Remaining</Typography>
                            <Typography variant="h6">{stat?.candidates_in_16_to_20_days}</Typography>
                        </Card>
                        <Card variant="outlined" sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            rowGap: '1.5rem'
                        }}>
                            <Typography variant="subtitle2" color="success">More than 20 days</Typography>
                            <Typography variant="h6">{stat?.candidates_more_than_20_days}</Typography>
                        </Card>
                    </>
            }
        </Box>
    );
}

export default AllCandidatesCards;