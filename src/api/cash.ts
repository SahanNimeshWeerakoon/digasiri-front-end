import {axiosClient} from '@/api/client.ts';
import { CASH } from '@/api/endpoints.ts';

const searchCashFlow = async (fromDate: string, toDate: string) => {
    try {
        const params = new URLSearchParams({
            fromDate,
            toDate
        });
        const response = await axiosClient.get(`${CASH}/search?${params}`);
        return response.data;
    } catch (e) {
        return null;
    }
};

const CandidateService = {
    searchCashFlow
};

export default CandidateService;
