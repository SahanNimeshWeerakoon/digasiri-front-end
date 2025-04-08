import {axiosClient} from '@/api/client.ts';
import { QUEUE } from '@/api/endpoints.ts';

const isInQueue = async (candidateId: string | undefined) => {
    try {
        const response = await axiosClient.get(`${QUEUE}/is-in-queue/${candidateId}`);
        return response.data;
    } catch (e) {
        throw e;
    }
};

const addToQueue = async (candidateId: string | undefined, countryId: string) => {
    try {
        const response = await axiosClient.post(`${QUEUE}`, { candidateId, countryId });
        return response.data;
    } catch (e) {
        throw e;
    }
};

const search = async (keyword: string, doctor: string) => {
    try {
        const params = new URLSearchParams({
            keyword,
            doctor
        });
        const response = await axiosClient.get(`${QUEUE}/search?${params}`);
        return response.data;
    } catch (e) {
        return null;
    }
}

const counts = async () => {
    try {
        const response = await axiosClient.get(`${QUEUE}/counts`);
        return response.data;
    } catch (e) {
        return null;
    }
}

const next = async () => {
    try {
        const response = await axiosClient.post(`${QUEUE}/next`);
        return response.data;
    } catch (e) {
        return null;
    }
}

const back = async () => {
    try {
        const response = await axiosClient.post(`${QUEUE}/back`);
        return response.data;
    } catch (e) {
        return null;
    }
}

const getStepperData = async (id: string | undefined) => {
    try {
        const response = await axiosClient.get(`${QUEUE}/stepper-data/${id}`);
        return response.data;
    } catch (e) {
        return null;
    }
};

const QueueService = {
    next,
    back,
    search,
    counts,
    isInQueue,
    addToQueue,
    getStepperData
};

export default QueueService;
