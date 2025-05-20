import api from "../../../services/api";

export interface DataResponse {
    status: boolean;
    message: string;
    data: string;
}

export interface ErrorResponse {
    status: boolean;
    message: string;
    errors?: [];
}

const uploadService = {

    uploadImage: async (image: FormData, signal?: AbortSignal): Promise<DataResponse> => {
        try {
            const response = await api.post<DataResponse>('upload/image', image, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                signal,
            });
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse || 'Failed to upload image';
        }
    },

    uploadVideo: async (video: FormData, signal?: AbortSignal) => {
        try {
            const response = await api.post<DataResponse>('upload/video', video, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 30000,
                signal
            });
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse || 'Failed to upload video';
        }
    },

    deleteFile: async (url: string, signal?: AbortSignal): Promise<DataResponse> => {
        try {
            const filename = url.split('/').pop();
            const response = await api.delete<DataResponse>(`upload/${filename}`, {signal});
            return response.data;
        } catch (error: any) {
            throw error.response?.data || 'Failed to delete file';
        }
    },
    
}

export default uploadService;