import {
    Box,
    Card, Skeleton,
    Typography
} from '@mui/material';

interface Props {
    counts: any;
    loading: boolean;
}

const CashFlowCards = ({ counts, loading }: Props) => {
    return (
        <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
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
                </> : <>
                    <Card variant="outlined" sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        rowGap: '1.5rem'
                    }}>
                        <Typography variant="subtitle2" color="primary">Total</Typography>
                        <Typography variant="h6">{counts?.Total ?? "0"}</Typography>
                    </Card>
                    <Card variant="outlined" sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        rowGap: '1.5rem'
                    }}>
                        <Typography variant="subtitle2" color="primary">Fit</Typography>
                        <Typography variant="h6">{counts?.fit ?? "0"}</Typography>
                    </Card>
                    <Card variant="outlined" sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        rowGap: '1.5rem'
                    }}>
                        <Typography variant="subtitle2" color="warning">Not Finished</Typography>
                        <Typography variant="h6">{counts?.NotFinished ?? "0"}</Typography>
                    </Card>
                    <Card variant="outlined" sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        rowGap: '1.5rem'
                    }}>
                        <Typography variant="subtitle2" color="success">Pending</Typography>
                        <Typography variant="h6">{counts?.Pending ?? "0"}</Typography>
                    </Card>
                </>
            }
        </Box>
    );
}

export default CashFlowCards;