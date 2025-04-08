import {axiosClient} from '@/api/client.ts';
import {APPROVAL} from '@/api/endpoints.ts';

const getApproval = async (keyword="") => {
    try {
        const params = new URLSearchParams({
            keyword: keyword,
        });
        const response = await axiosClient.get(`${APPROVAL}/search?${params}`);
        return response.data;
    } catch (e) {
        return null;
    }
};

const ApprovalService = {
    getApproval,
};

export default ApprovalService;
