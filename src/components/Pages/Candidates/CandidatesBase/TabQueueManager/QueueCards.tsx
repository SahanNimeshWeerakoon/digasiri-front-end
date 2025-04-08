import {
    Box,
    Card, Skeleton,
    Typography,
} from '@mui/material';
import {useEffect, useState} from "react";
import useQueue from "@/hooks/useQueue.ts";

const QueueCards = () => {
    const [cardData, setCardData] = useState({ todayRegistrations: 0, arrivals: 0, completed: 0, pending: 0 });
    const [loading, setLoading] = useState<boolean>(false);

    const { counts } = useQueue();

    useEffect(() => {
        setLoading(true);
        counts()
            .then(res => {
                setCardData(res);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });
    }, []);

  return (
    <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        columnGap: '1rem',
        p: 2,
        width: '100%',
    }}
    >
        {
            loading ? <>
                <Skeleton variant="rectangular" height={133} width="100%"/>
                <Skeleton variant="rectangular" height={133} width="100%"/>
                <Skeleton variant="rectangular" height={133} width="100%"/>
                <Skeleton variant="rectangular" height={133} width="100%"/>
                <Skeleton variant="rectangular" height={133} width="100%"/>
                <Skeleton variant="rectangular" height={133} width="100%"/>
            </> : <>
                <Card variant="outlined" sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    rowGap: '1.5rem'
                }}>
                    <Typography variant="subtitle2" color="primary">Today’s registration</Typography>
                    <Typography variant="h6">{cardData.todayRegistrations}</Typography>
                </Card>
                <Card variant="outlined" sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    rowGap: '1.5rem'
                }}>
                    <Typography variant="subtitle2" color="primary">Arrivals</Typography>
                    <Typography variant="h6">{cardData.arrivals}</Typography>
                </Card>
                <Card variant="outlined" sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    rowGap: '1.5rem'
                }}>
                    <Typography variant="subtitle2" color="primary">Completed</Typography>
                    <Typography variant="h6">{cardData.completed}</Typography>
                </Card>
                <Card variant="outlined" sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    rowGap: '1.5rem'
                }}>
                    <Typography variant="subtitle2" color="primary">Pending</Typography>
                    <Typography variant="h6">{cardData.pending}</Typography>
                </Card>
                <Card variant="outlined" sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    rowGap: '1.5rem'
                }}>
                    <Typography variant="subtitle2" color="primary">For DR. Miles</Typography>
                    <Typography variant="h6">40</Typography>
                </Card>
                <Card variant="outlined" sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    rowGap: '1.5rem'
                }}>
                    <Typography variant="subtitle2" color="primary">For DR. Dave</Typography>
                    <Typography variant="h6">40</Typography>
                </Card>
            </>
        }
    </Box>
  );
}

export default QueueCards