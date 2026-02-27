import { invoke, InvokeArgs } from "@tauri-apps/api/core";

// Default class used to make api calls to the backend
export default class API {
    // general used function to make the calls, encapsulated to catch errors
    protected static async Send<T>(
        _func: backendFunctions,
        _params?: InvokeArgs,
    ): Promise<ApiSucess<T> | ApiError> {
        try {
            // Invoke is used to call functions on the backend in Rust.
            // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
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

    public static async create_workout(_name: string, _desc?: string): Promise<string> {
        if (!_name) {
            const err = "workout requires username";
            console.error(err);
            return err;
        }

        const workout: WorkoutDTO = {
            name: _name,
            desc: _desc,
        };

        const result = await this.Send<string>("create_workout", { workout });

        if (!result.ok) {
            throw new Error(`backend ${result.error_type}: ${result.message}`);
        }
        return result.data;
    }
}
