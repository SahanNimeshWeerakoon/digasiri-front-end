import {
    Paper,
    Table,
    TableRow,
    TableHead,
    TableCell,
    TableBody,
    TableContainer, CircularProgress, IconButton,
} from '@mui/material';
import useGlobalStore from "@/store/useGlobalStore.ts";
import {Visibility} from '@mui/icons-material';
import {useNavigate} from "react-router";

interface Props {
    columns: string[],
    rows: any[],
    loading: boolean;
}

const CashFlowTable = ({columns, rows, loading}: Props) => {
    const countries = useGlobalStore((state:any) => state.countries);
    const navigate = useNavigate();

    const getCountryById = (id: string) => {
        let country = countries?.find((i:any) => i.id === id);
        if (country) return country?.name;
        else  return "";
    }

    const viewCandidate = (id: any) => {
        navigate(`/patients/${id}`);
    }

    return (
        <TableContainer component={Paper} sx={{borderRadius: '0'}}>
            <Table sx={{minWidth: 650}} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        {columns.map((column,index) => (<TableCell key={index}>{column}</TableCell>))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows?.map((row: any, index) => (
                        <TableRow
                            key={index}
                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                        >
                            <TableCell component="td">{`${row.firstName || ''} ${row.lastName || ''}`}</TableCell>
                            <TableCell component="td">{row.profession || ''}</TableCell>
                            <TableCell component="td">{getCountryById(row.travellingTo)}</TableCell>
                            <TableCell component="td">{row.withoutMMR}</TableCell>
                            <TableCell component="td">{row.total}</TableCell>
                            <TableCell component="td">{row.passportNumber || ''}</TableCell>
                            <TableCell component="td">{row.totalRefunds}</TableCell>
                            <TableCell component="td">
                                <IconButton onClick={() => viewCandidate(row?.id)}>
                                    <Visibility />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                    {loading && (
                        <TableRow sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                            <TableCell colSpan={8} component="td" scope="row"
                                       sx={{textAlign: 'center', fontSize: '18px', color: '#888888'}}>
                                <CircularProgress color='inherit' size={35}/>
                            </TableCell>
                        </TableRow>
                    )}
                    {!loading && !rows?.length ? (
                        <TableRow sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                            <TableCell colSpan={8} component="td" scope="row"
                                       sx={{textAlign: 'center', fontSize: '18px', color: '#888888'}}>No Data Available</TableCell>
                        </TableRow>
                    ) : ""}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default CashFlowTable;