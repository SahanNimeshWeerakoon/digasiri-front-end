import ApprovalService from '@/api/approval';

export default function useApproval() {
    const getApproval = async (keyword: string="") => {
        const response = await ApprovalService.getApproval(keyword);
        if (!response) return null;
        return response;
    }

    return {
        getApproval,
    }
}