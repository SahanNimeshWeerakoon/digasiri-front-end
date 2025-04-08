import CandidateService from '@/api/candidates.ts';
import {ICandidate} from '@/utils/types.ts';

export default function useCandidate() {
    const getCandidates = async (keyword: string="", page: number=1, perPage: number=10, country: string="") => {
        const response = await CandidateService.searchCandidate(keyword, page, perPage, country);
        if (!response) return;
        return response;
    }

    const getCandidateStat = async () => {
        const response = await CandidateService.getCandidateStat();
        if (!response) return;
        return response;
    }

    const getCandidate = async (id: string | undefined) => {
        const data:ICandidate = await CandidateService.getCandidate(id);
        if (!data) return null;
        return {
            ...data,
            dateOfBirth: data?.dateOfBirth ? new Date(data?.dateOfBirth) : null,
            passportIssueDate: data?.passportIssueDate ? new Date(data?.passportIssueDate) :null,
            passportExpDate: data?.passportExpDate ? new Date(data?.passportExpDate) : null,
            createdAt: data?.createdAt ? new Date(data?.createdAt) : null,
            updatedAt: data?.updatedAt ? new Date(data?.updatedAt) : null,
            visitedDate: data?.visitedDate ? new Date(data?.visitedDate) : null,
            appointmentDate: data?.appointmentDate ? new Date(data?.appointmentDate) : null
        };
    }

    const updateCandidate = async (id: string | undefined, data: ICandidate | null) => {
        const response = await CandidateService.updateCandidate(id, data);
        if (!response) return;
        return response;
    }

    const createCandidate = async (data: ICandidate | null) => {
        try {
            const response = await CandidateService.createNewCandidate(data);
            if (!response) return;
            return response;
        } catch(e: any) {
            throw e;
        }
    }

    return {
        getCandidates,
        getCandidate,
        getCandidateStat,
        updateCandidate,
        createCandidate,
    }
}