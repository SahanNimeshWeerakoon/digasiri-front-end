import { useState, useEffect } from 'react';
import moment from 'moment';
import useCashFlow from '@/hooks/useCash';
import CashFlowCards from '@/components/Pages/Candidates/CandidatesBase/TabCashflow/CashFlowCards';
import CashFlowTable from '@/components/Pages/Candidates/CandidatesBase/TabCashflow/CashFlowTable';
import CashFlowDateFilter from '@/components/Pages/Candidates/CandidatesBase/TabCashflow/CashFlowDateFilter';

export default function TabCashflow() {
    const [rows, setRows] = useState([]);
    const [totals, setTotals] = useState({
        totalInflow: 0,
        totalProfit: 0,
        totalRefunds: 0,
        totalArrivals: 0,
        totalExpenses: 0,
    });
    const [dateFiler, setDateFilter] = useState({ fromDate: moment().format('YYYY-MM-DD'), toDate: "" });
    const [loading, setLoading] = useState<boolean>(false);

    const { searchCashFlow } = useCashFlow();

    useEffect(() => {
        setLoading(true);
        searchCashFlow(dateFiler.fromDate, dateFiler.toDate)
            .then(res => {
                setRows(res?.groupedAppointments?.length ? res?.groupedAppointments : [])
                setTotals(res?.totals);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            })
    }, [dateFiler]);

    const columns = ['Country', 'Candidates', 'Without MMR', 'Total', 'Refunds', 'Refunds Without MMR', 'Total Refunds', 'Profits']

    return (
        <>
            <CashFlowDateFilter setDateFilter={setDateFilter} />

            <CashFlowCards totals={totals} loading={loading} />

            <CashFlowTable
                loading={loading}
                rows={rows}
                columns={columns}
            />
        </>
    );
}