import {axiosClient} from '@/api/client.ts';
import { COUNTRY } from '@/api/endpoints.ts';

const getCountries = async () => {
    try {
        const response = await axiosClient.get(`${COUNTRY}/`);
        return response.data;
    } catch (e) {
        return null;
    }
};

const QueueService = {
    getCountries
};

export default QueueService;
