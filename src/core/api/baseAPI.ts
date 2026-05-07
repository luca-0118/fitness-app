import { invoke, InvokeArgs } from "@tauri-apps/api/core";
import { ApiSucess, backendFunctions } from "../../types/types";

/**
 * The default class for all api's, it contains methods we use in all api's
 */
export default class BaseApi {

    /**
     * Calls the backend function to return the data.
     * Only useable in classes that extend the BaseApi.
     * @param _func Any backend function name
     * @param _params params in the form of an {} object
     * @returns 
     *  T is the type we tell it when calling the funtion
     */
    protected static async fetch<T>(_func: backendFunctions, _params?: InvokeArgs): Promise<ApiSucess<T> | Error> {
        try {
            // Invoke is used to call functions on the backend in Rust.
            // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
            const resp: ApiSucess<T> = await invoke(_func, _params);
            return resp;
        } catch (error: any) {
            return new Error(error);
        }
    }

    protected static handleError<T>(data: T | Error): T
    {
        if(data instanceof Error) {
                console.error(data.message);
                throw new Error();
            }

        return data
    }

}