import { toast } from "react-hot-toast";

const errorToast = (message?: string) =>
  message ? toast.error(message) : toast.error("something went wrong!");

const successToast = (message?: string) =>
  message ? toast.success(message) : toast.success("", {});

export { errorToast, successToast };
