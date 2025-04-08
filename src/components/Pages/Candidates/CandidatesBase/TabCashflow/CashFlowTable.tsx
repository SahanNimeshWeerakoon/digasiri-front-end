import {
    Paper,
    Table,
    TableRow,
    TableHead,
    TableCell,
    TableBody,
    TableContainer, CircularProgress,
} from '@mui/material';
import TabComponent from '@/components/UI/TabComponent.tsx';
import {CashFlowTableRow} from '@/utils/types.ts';

interface Props {
    columns: string[],
    rows: CashFlowTableRow[],
    loading: boolean;
}

const CashFlowTable = ({columns, rows, loading}: Props) => {
    return (
        <TabComponent tabs={[
            {
                tab: {
                    label: 'Inflow',
                },
                content: <TableContainer component={Paper} sx={{borderRadius: '0'}}>
                    <Table sx={{minWidth: 650}} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column,index) => (<TableCell key={index}>{column}</TableCell>))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row: CashFlowTableRow, index) => (
                                <TableRow
                                    key={index}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                >
                                    <TableCell component="td">{row.country}</TableCell>
                                    <TableCell component="td">{row.candidates}</TableCell>
                                    <TableCell component="td">{row.withoutMMR}</TableCell>
                                    <TableCell component="td">{row.total}</TableCell>
                                    <TableCell component="td">{row.refunds}</TableCell>
                                    <TableCell component="td">{row.refundsWithoutMMR}</TableCell>
                                    <TableCell component="td">{row.totalRefunds}</TableCell>
                                    <TableCell component="td">{row.profits}</TableCell>
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
                            {!loading && !rows.length ? (
                                <TableRow sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                                    <TableCell colSpan={8} component="td" scope="row"
                                               sx={{textAlign: 'center', fontSize: '18px', color: '#888888'}}>No Data Available</TableCell>
                                </TableRow>
                            ) : ""}
                        </TableBody>
                    </Table>
                </TableContainer>
            },
        ]}/>
    );
}

export default CashFlowTable;