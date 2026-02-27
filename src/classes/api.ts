import { invoke, InvokeArgs } from "@tauri-apps/api/core";

// Default class used to make api calls to the backend
export default class API {
    // general used function to make the calls, encapsulated to catch errors
    protected static async Send<T>(_func: string, _params?: InvokeArgs): Promise<ApiSucess<T> | ApiError> {
        try {
            // Invoke is used to call functions on the backend in Rust.
            const resp: ApiSucess<T> = await invoke(_func, _params);
            return resp;
        } catch (error: any) {
            return error as ApiError;
        }
    }

    // Requests a list of all the workouts in the table
    public static async list_workouts(): Promise<Array<WorkoutDTO>> {
        const result = await this.Send<WorkoutDTO[]>("list_workouts");

        if (!result.ok) {
            throw new Error(`backend ${result.error_type}: ${result.message}`);
        }
        return result.data;
    }
}
