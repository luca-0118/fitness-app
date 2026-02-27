import { invoke, InvokeArgs } from "@tauri-apps/api/core";
import workoutAPI from "../apis/workoutAPI";
import ExercisesAPI from "../apis/exercisesAPI";

export default class API {
    public static workouts: workoutAPI = new workoutAPI();
    public static exercises: ExercisesAPI = new ExercisesAPI();
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
