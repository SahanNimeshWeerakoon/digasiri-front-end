import CashService from '@/api/cash.ts';

export default function useCashFlow() {
    const searchCashFlow = async (fromDate: string, toDate: string) => {
        const response = await CashService.searchCashFlow(fromDate, toDate);
        if (!response) return;
        return response;
    }

    return {
        searchCashFlow
    }
}