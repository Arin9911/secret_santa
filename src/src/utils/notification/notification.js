import { toast } from "react-toastify";

const toastProps = {
  position: "top-right",
  autoClose: 1500,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: false,
};

const Toast = {
  SUCCESS: "Success",
  ERROR: "Error",
  INFO: "Information",
  WARNING: "Warning",
};

export const NotificationConfig = {
  warning: (msg = Toast.WARNING) => {
    toast.warning(msg, toastProps);
  },
  success: (msg = Toast.SUCCESS) => {
    toast.success(msg, toastProps);
  },
  info: (msg = Toast.INFO) => {
    toast.info(msg, toastProps);
  },
  error: (msg = Toast.ERROR) => {
    toast.error(msg, toastProps);
  },
};
