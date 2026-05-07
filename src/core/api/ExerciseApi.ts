import { ExerciseDTO, listFilterParams } from "../../types/types";
import BaseApi from "./baseAPI";

/**
 * All API calls for exercises are made here.
 */
export default class ExerciseApi extends BaseApi {

    /**
     * Returns a list of all available exercises.
     */    
    static async list(param: listFilterParams): Promise<ExerciseDTO[]> {
        const req = {
            page_size: param.page_size || 99999,
            page: param.page || 1,
            filter: param.filter,
            query: param.query
        }
        const result = await this.fetch<ExerciseDTO[]>("get_all_exercises",{req});

        const data = this.handleError(result);

        return data.data;
    }
}