import api from "../../../services/api";
import { Plan } from "./planService";
import { User } from "./userService";

export interface Subscription {
    id: number;
    user_id: number;
    plan_id: number;
    start_date: string;
    end_date: string;
    status: boolean;
    user: User | null;
    plan: Plan | null;
}

export interface CreatePayload {
    user_id: number;
    plan_id: number;
    start_date: string;
    end_date: string;
    status: boolean;
}

export interface PaginationLinks {
    url: string | null;
    label: string;
    active: boolean;
}

export interface DataResponse {
    current_page: number;
    data: Subscription[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLinks[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export interface SubscriptionResponse {
    status: boolean;
    message: string;
    data: DataResponse;
}

export interface SingleResponse {
    status: boolean;
    message: string;
    data: Subscription;
}

export interface DeleteResponse {
    status: boolean;
    message: string;
    data: {
        message: string;
    };
}

export interface ErrorResponse {
    status: boolean;
    message: string;
    errors?: {
        [key: string]: string[];
    };
}

const subscriptionService = {

    getSubscriptions: async (page: number = 1, keyword: string = ''): Promise<SubscriptionResponse> => {
        try {
            const response = await api.get<SubscriptionResponse>('/subscriptions', { params: { page, search: keyword || undefined } });
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse || 'Failed to get subscription';
        }
    },

    getSubscriptionByUser: async (user_id: number): Promise<SingleResponse> => {
        try {   
            const response = await api.get<SingleResponse>(`/subscriptions/user/${user_id}`);
            return response.data;
        }
        catch (error: any) {
            throw error.response?.data as ErrorResponse || 'Failed to get subscription by user';
        }   
    },

    getSubscriptionById: async (id: number): Promise<SingleResponse> => {
        try {
            const response = await api.get<SingleResponse>(`/subscriptions/${id}`);
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse || 'Failed to get subscription by id';
        }
    },

    createSubscription: async (data: CreatePayload): Promise<SingleResponse> => {
        try {
            const response = await api.post<SingleResponse>('subscriptions', data);
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse || "Failed to create subscription";
        }
    },

    updateSubscription: async (id: number, data: Partial<Subscription>): Promise<SingleResponse> => {
        try {
            const response = await api.put<SingleResponse>(`/subscriptions/${id}`, data);
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse || "Failed to update subscription";
        }
    },

    deleteSubscription: async (id: number): Promise<DeleteResponse> => {
        try {
            const response = await api.delete<DeleteResponse>(`/subscriptions/${id}`);
            return response.data;
        } catch (error: any) {
            throw error.response?.data as ErrorResponse;
        }
    },
}

export default subscriptionService;