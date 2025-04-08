import {
    Box,
    Button,
    Stack,
    Typography,
    Chip,
    Card,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    IconButton,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Avatar
} from '@mui/material';
import {BarChart,PieChart} from '@mui/x-charts';
import {FilterAlt, Visibility, MoreVert} from '@mui/icons-material';

export default function PatientsBase() {

    const rows = [
        {
            Name: 'Damien Wells',
            Profession: 'Executive',
            CountryTraveling: 'Kuwait (KU)',
            AppointmentDate: '24/03/2025',
            ExpiryStatus: '12',
            PassportNumber: '373728819V',
            VisitedDate: '01/04/2025',
            Actions: '',
        }
    ];

    const columns = ['Name', 'Profession', 'Country Traveling', 'Appointment Date', 'Expiry/Status', 'Passport Number', 'Visited Date', 'Actions']

    return (
        <>
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                columnGap: '1rem',
                p: 2
            }}
            >
                <Card variant="outlined" sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    rowGap: '1.5rem'
                }}>
                    <Typography variant="subtitle2" color="primary">Total</Typography>
                    <Typography variant="h6">40</Typography>
                </Card>
                <Card variant="outlined" sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    rowGap: '1.5rem'
                }}>
                    <Typography variant="subtitle2" color="error">Less than 14 days</Typography>
                    <Typography variant="h6">40</Typography>
                </Card>
                <Card variant="outlined" sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    rowGap: '1.5rem'
                }}>
                    <Typography variant="subtitle2" color="warning">16-14 Days Remaining</Typography>
                    <Typography variant="h6">40</Typography>
                </Card>
                <Card variant="outlined" sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    rowGap: '1.5rem'
                }}>
                    <Typography variant="subtitle2" sx={{color: '#FBC02D'}}>20-16 Days Remaining</Typography>
                    <Typography variant="h6">40</Typography>
                </Card>
                <Card variant="outlined" sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    rowGap: '1.5rem'
                }}>
                    <Typography variant="subtitle2" color="success">More than 20 days</Typography>
                    <Typography variant="h6">40</Typography>
                </Card>
            </Box>

            <Stack direction="row" spacing={6} sx={{
                alignItems: 'center',
                padding: 4
            }}>
                <BarChart
                    series={[
                        { data: [35, 44, 24, 34] },
                        { data: [51, 6, 49, 30] },
                        { data: [15, 25, 30, 50] },
                        { data: [60, 50, 15, 25] },
                    ]}
                    height={290}
                    xAxis={[{ data: ['Q1', 'Q2', 'Q3', 'Q4'], scaleType: 'band' }]}
                    margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
                />
                <PieChart
                    series={[
                        {
                            data: [
                                { id: 0, value: 10, label: 'series A' },
                                { id: 1, value: 15, label: 'series B' },
                                { id: 2, value: 20, label: 'series C' },
                            ],
                        },
                    ]}
                    width={400}
                    height={200}
                />
            </Stack>

            <Stack sx={{p: 2, justifyContent: 'space-between', alignItems: 'center'}} direction="row">
                <Stack direction="row" sx={{alignItems: 'center', columnGap: 2}}>
                    <TextField id="outlined-basic" label="Search" variant="outlined"/>
                    <FormControl sx={{
                        minWidth: '14rem'
                    }}>
                        <InputLabel id="demo-simple-select-label">Country Traveling</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Country Traveling"
                        >
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl>
                    <IconButton aria-label="delete" size="medium">
                        <FilterAlt fontSize="inherit"/>
                    </IconButton>
                </Stack>
                <Stack direction="row" spacing={1} sx={{alignItems: 'center'}}>
                    <Button variant="contained" color="secondary" size="medium">Search Via Fingerprint</Button>
                </Stack>
            </Stack>

            <TableContainer component={Paper} sx={{borderRadius: '0'}}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (<TableCell>{column}</TableCell>))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => (
                            <TableRow
                                key={index}
                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                            >
                                <TableCell component="td" scope="row">
                                    <Stack direction="row" sx={{alignItems: 'center', columnGap: 1}}>
                                        <Avatar alt={row.Name}/>
                                        {row.Name}
                                    </Stack>
                                </TableCell>
                                <TableCell component="td">{row.Profession}</TableCell>
                                <TableCell component="td">{row.CountryTraveling}</TableCell>
                                <TableCell component="td">{row.AppointmentDate}</TableCell>
                                <TableCell component="td">
                                    <Chip label={row.ExpiryStatus} color="success" size="small"/>
                                </TableCell>
                                <TableCell component="td">{row.PassportNumber}</TableCell>
                                <TableCell component="td">{row.VisitedDate}</TableCell>
                                <TableCell component="td">
                                    <Stack direction="row" sx={{alignItems: 'center', columnGap: 1}}>
                                        <IconButton aria-label="delete" size="medium">
                                            <Visibility fontSize="inherit"/>
                                        </IconButton>
                                        <IconButton aria-label="delete" size="medium">
                                            <MoreVert fontSize="inherit"/>
                                        </IconButton>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}