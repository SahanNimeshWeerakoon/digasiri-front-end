import {axiosClient} from '@/api/client.ts';
import {APPOINTMENT} from '@/api/endpoints.ts';

const updateManagerApproval = async (data: any) => {
    try {
        const response = await axiosClient.post(`${APPOINTMENT}/manager-approval`, data);
        return response.data;
    } catch (e) {
        return null;
    }
};

const updateRefund = async (data: any) => {
    try {
        const response = await axiosClient.post(`${APPOINTMENT}/refund`, data);
        return response.data;
    } catch (e) {
        return null;
    }
};

const AppointmentService = {
    updateManagerApproval,
    updateRefund
};

export default AppointmentService;
