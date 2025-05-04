import { toast, ToastOptions, ToastPosition, Bounce } from "react-toastify";

const toastConfig: ToastOptions = {
    position: "top-right" as ToastPosition, 
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
};

export const showSuccessToast = (message: string) => {
    toast.success(message, toastConfig);
};

export const showErrorToast = (message: string) => {
    toast.error(message, toastConfig);
};

export const showInfoToast = (message: string) => {
    toast.info(message, toastConfig);
};

export const showWarningToast = (message: string) => {
    toast.warning(message, toastConfig);
};