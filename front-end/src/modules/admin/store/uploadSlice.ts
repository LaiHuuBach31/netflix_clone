import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import uploadService, { DataResponse, ErrorResponse } from "../services/uploadService";

interface UploadState {
    imageUrl: string | null;
    videoUrl: string | null;
    loading: boolean;
    error: ErrorResponse | null;
}

const initialState: UploadState = {
    imageUrl: null,
    videoUrl: null,
    loading: false,
    error: null,
}

export const uploadImage = createAsyncThunk<DataResponse, FormData, { rejectValue: ErrorResponse }>(
    'upload/uploadImage',
    async (image, { rejectWithValue, signal }) => {
        try {
            const response = await uploadService.uploadImage(image, signal);
            return response;
        } catch (error: any) {
            return rejectWithValue(error || 'Failed to upload image');
        }
    }
)

export const uploadVideo = createAsyncThunk<DataResponse, FormData, { rejectValue: ErrorResponse }>(
    'upload/uploadVideo',
    async (video, { rejectWithValue, signal }) => {
        try {
            const response = await uploadService.uploadVideo(video, signal);
            return response;
        } catch (error: any) {
            return rejectWithValue(error || 'Failed to upload video');
        }
    }
)

export const deleteFile = createAsyncThunk<DataResponse, string, { rejectValue: ErrorResponse }>(
    'upload/deleteFile',
    async (url, { rejectWithValue, signal }) => {
        try {
            const response = await uploadService.deleteFile(url, signal);
            return response;
        } catch (error: any) {
            return rejectWithValue(error || 'Failed to delete file' );
        }
    }
);

const uploadSlice = createSlice({
    name: 'upload',
    initialState: initialState,
    reducers: {
        clearUploadState(state) {
            state.imageUrl = null;
            state.videoUrl = null;
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(uploadImage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(uploadImage.fulfilled, (state, action) => {
                state.loading = false;
                state.imageUrl = action.payload.data;
            })
            .addCase(uploadImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })
            .addCase(uploadVideo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(uploadVideo.fulfilled, (state, action) => {
                state.loading = false;
                state.videoUrl = action.payload.data;
            })
            .addCase(uploadVideo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })
    }
})

export const { clearUploadState } = uploadSlice.actions;
export default uploadSlice.reducer;