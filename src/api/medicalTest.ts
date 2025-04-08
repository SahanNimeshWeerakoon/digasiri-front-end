import {axiosClient} from '@/api/client.ts';
import { MEDICAL_TEST } from '@/api/endpoints.ts';
import {IUpdateResults} from "@/utils/types.ts";

const getAllTests = async () => {
    try {
        const response = await axiosClient.get(`${MEDICAL_TEST}/all-tests`);
        return response.data;
    } catch (e) {
        return null;
    }
};

const getUpdatedResults = async (id:any) => {
    try {
        const response = await axiosClient.get(`${MEDICAL_TEST}/updated-results/${id}`);
        return response.data;
    } catch (e) {
        return null;
    }
};

const postUpdatedResults = async (data: IUpdateResults) => {
    try {
        const response = await axiosClient.post(`${MEDICAL_TEST}/create-or-update-result`, data);
        return response.data;
    } catch (e) {
        return null;
    }
};

const postUpdatedEvaluationGroupResults = async (data: any) => {
    try {
        const response = await axiosClient.post(`${MEDICAL_TEST}/create-or-update-evaluation-group-result`, data);
        return response.data;
    } catch (e) {
        return null;
    }
};

// const updateStepper = async (data: any) => {
//     try {
//         const response = await axiosClient.post(`${MEDICAL_TEST}/update-stepper`, data);
//         return response.data;
//     } catch (e) {
//         return null;
//     }
// };

const MedicalTestService = {
    getAllTests,
    getUpdatedResults,
    postUpdatedResults,
    postUpdatedEvaluationGroupResults,
    // updateStepper
};

export default MedicalTestService;
