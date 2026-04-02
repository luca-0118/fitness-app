import { invoke, InvokeArgs } from "@tauri-apps/api/core";
import workoutAPI from "../apis/workoutAPI";
import ExercisesAPI from "../apis/exercisesAPI";
import sessionAPI from "../apis/sessionAPI";

/**
 * DIP: The public surface of each API property uses the abstraction interface
 * rather than the concrete class.  This ensures callers (hooks, components)
 * program against stable interfaces and are not coupled to implementation details.
 */
export default class API {
    public static workouts: workoutAPI = new workoutAPI();
    public static exercises: IExercisesAPI = new ExercisesAPI();
    public static session: ISessionAPI = new sessionAPI();
}

export class ApiClient {
    public static async send<T>(_func: backendFunctions, _params?: InvokeArgs): Promise<ApiSucess<T> | ApiError> {
        try {
            // Invoke is used to call functions on the backend in Rust.
            // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
            const resp: ApiSucess<T> = await invoke(_func, _params);
            return resp;
        } catch (error: any) {
            return error as ApiError;
        }
    }

    public static assertOk<T>(result: ApiSucess<T> | ApiError): T {
        if (!result.ok) {
            throw new Error(`backend ${result.error_type}: ${result.message}`);
        }
        return result.data;
    }
}
