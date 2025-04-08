import {axiosClient} from '@/api/client.ts';
import { AUTH, CANDIDATE } from '@/api/endpoints.ts';

const getCandidatesAll = async () => {
    try {
        const response = await axiosClient.get(`${CANDIDATE}`);
        return response.data;
    } catch (e) {
        return null;
    }
};

const getCandidate = async (id: string | undefined) => {
    try {
        const response = await axiosClient.get(`${CANDIDATE}/${id}`);
        return response.data;
    } catch (e) {
        return null;
    }
};

const searchCandidate = async (keyword:string = "", page:number = 1, perPage: number = 10, country: string="") => {
    try {
        const params = new URLSearchParams({
            keyword: keyword,
            page: String(page),
            perPage: String(perPage),
            country: String(country),
        });
        const response = await axiosClient.get(`${CANDIDATE}/search?${params}`);
        return response.data;
    } catch (e) {
        return null;
    }
};

const createNewCandidate = async (data: any) => {
    try {
        console.log("from api call payload", data);
        const response = await axiosClient.post(`${CANDIDATE}`, data);
        console.log({puka: response});
        return response.data;
    } catch (e: any) {
        throw e?.response?.data ?? null;
    }
};

const updateCandidate = async (id: string | undefined, data: any) => {
    try {
        const response = await axiosClient.put(`${CANDIDATE}/${id}`, data);
        return response.data;
    } catch (e) {
        return null;
    }
};

const getCandidateStat = async () => {
    try {
        const response = await axiosClient.get(`${CANDIDATE}/counts`);
        return response.data;
    } catch (e) {
        return null;
    }
};

const compareFingerPrints = async (fingerprint: string, fingerprintId: string) => {
    try {
        const response = await axiosClient.post(`${AUTH}/fingerprint`, {fingerprint, fingerprintId});
        return response.data;
    } catch(err) {
        return null;
    }
}

const CandidateService = {
    getCandidate,
    updateCandidate,
    searchCandidate,
    getCandidateStat,
    getCandidatesAll,
    createNewCandidate,
    compareFingerPrints,
};

export default CandidateService;
