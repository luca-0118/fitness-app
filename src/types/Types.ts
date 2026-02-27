export type ApiResponse<T> = {
    ok: boolean;
    data: T;
};

export interface ApiError extends Error {
    ok: boolean;
    error_type: string;
    message: string;
}
