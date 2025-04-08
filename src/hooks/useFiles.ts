import FileService from '@/api/file.ts';

export default function useFiles() {
    const scanFromPassport = async (data: any) => {
        const response = await FileService.FileServiceReadPassport(data);
        if (!response) return null;
        return response;
    }

    const uploadFiles = async (data: any) => {
        const response = await FileService.FileServiceUploadFiles(data);
        if (!response) return null;
        return response;
    }

    const uploadDocuments = async (data: any) => {
        const response = await FileService.FileServiceSaveDocuments(data);
        if (!response) return null;
        return response;
    }

    const getDocuments = async (id: any) => {
        const response = await FileService.FileServiceGetDocuments(id);
        if (!response) return null;
        return response;
    }

    return {
        scanFromPassport,
        uploadFiles,
        uploadDocuments,
        getDocuments
    }
}