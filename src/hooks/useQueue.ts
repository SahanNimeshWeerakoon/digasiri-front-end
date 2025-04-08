import QueueService from '@/api/queue.ts';

export default function useQueue() {
    const isInQueue = async (candidateId: string | undefined) => {
        const response = await QueueService.isInQueue(candidateId);
        if (!response) return;
        return response;
    }

    const addToQueue = async (candidateId: string | undefined, countryId: string) => {
        const response = await QueueService.addToQueue(candidateId, countryId);
        if (!response) return;
        return response;
    }

    const search = async (keyword: string, doctor: string) => {
        const response = await QueueService.search(keyword, doctor);
        if (!response) return;
        return response;
    }

    const counts = async () => {
        const response = await QueueService.counts();
        if (!response) return;
        return response;
    }

    const next = async () => {
        const response = await QueueService.next();
        if (!response) return;
        return response;
    }

    const back = async () => {
        const response = await QueueService.back();
        if (!response) return;
        return response;
    }

    const getStepperData = async (id: string | undefined) => {
        const response = await QueueService.getStepperData(id);
        if (!response) return;
        return response;
    }

    return {
        next,
        back,
        search,
        counts,
        isInQueue,
        addToQueue,
        getStepperData
    }
}