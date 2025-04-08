import {
    Box,
    Card, Skeleton,
    Typography
} from '@mui/material';

interface Props {
  totals: any;
  loading: boolean;
}

const CashFlowCards = ({ totals, loading }: Props) => {
  return (
    <Box sx={{
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
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
            </> : <>
                <Card variant="outlined" sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    rowGap: '1.5rem'
                }}>
                    <Typography variant="subtitle2" color="primary">Total Arrivals</Typography>
                    <Typography variant="h6">{totals?.totalArrivals}</Typography>
                </Card>
                <Card variant="outlined" sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    rowGap: '1.5rem'
                }}>
                    <Typography variant="subtitle2" color="primary">Total Inflow</Typography>
                    <Typography variant="h6">{totals?.totalInflow}</Typography>
                </Card>
                <Card variant="outlined" sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    rowGap: '1.5rem'
                }}>
                    <Typography variant="subtitle2" color="primary">Profit</Typography>
                    <Typography variant="h6">{totals?.totalProfit}</Typography>
                </Card>
                <Card variant="outlined" sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    rowGap: '1.5rem'
                }}>
                    <Typography variant="subtitle2" color="warning">Refunds</Typography>
                    <Typography variant="h6">{totals?.totalRefunds}</Typography>
                </Card>
                <Card variant="outlined" sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    rowGap: '1.5rem'
                }}>
                    <Typography variant="subtitle2" color="warning">Expenses</Typography>
                    <Typography variant="h6">{totals?.totalExpenses}</Typography>
                </Card>
            </>
        }
  </Box>
  );
}

export default CashFlowCards;