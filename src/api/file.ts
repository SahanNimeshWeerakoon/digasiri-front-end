// read-passport
import {axiosClient} from '@/api/client.ts';
import {FILE} from '@/api/endpoints.ts';

const FileServiceReadPassport = async (data: any) => {
    try {
        const response = await axiosClient.post(`${FILE}/read-passport`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (e) {
        return null;
    }
};

const FileServiceUploadFiles = async (data: any) => {
    try {
        const response = await axiosClient.post(`${FILE}/upload-image`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (e) {
        return null;
    }
};

const FileServiceGetDocuments = async (id:any) => {
    try {
        const response = await axiosClient.get(`${FILE}/get-documents/${id}`);
        return response.data;
    } catch (e) {
        return null;
    }
};

const FileServiceSaveDocuments = async (data: any) => {
    try {
        const response = await axiosClient.post(`${FILE}/save-image-url`, data);
        return response.data;
    } catch (e) {
        return null;
    }
};

const FileService = {
    FileServiceReadPassport,
    FileServiceUploadFiles,
    FileServiceGetDocuments,
    FileServiceSaveDocuments
};

export default FileService;
