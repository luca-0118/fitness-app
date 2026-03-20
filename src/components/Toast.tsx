import toast, { Toaster } from "react-hot-toast";

export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        className:
          "flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg text-sm",

        success: {
          className: "bg-green-600 text-white border-green-700",
        },

        error: {
          className: "bg-red-600 text-white border-red-700",
        },

        loading: {
          className: "bg-blue-600 text-white border-blue-700",
        },
      }}
    />
  );
}

export const Toast = {
  success: (message: string) => toast.success(message),

  error: (message: string) => toast.error(message),

  loading: (message: string) => toast.loading(message),

  promise: (promise: Promise<any>, messages: {
    loading: string;
    success: string;
    error: string;
  }) => {
    return toast.promise(promise, messages);
  },
};