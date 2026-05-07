import { ApiClient } from "../classes/api";
import {ExerciseDTO, listFilterParams} from "../types/types.ts";


export default class ExercisesAPI {
    public async list(param: listFilterParams): Promise<ExerciseDTO[]> {
        const req = {
            page_size: param.page_size || 99999,
            page: param.page || 1,
            filter: param.filter,
            query: param.query
        }
        const result = await ApiClient.send<ExerciseDTO[]>("get_all_exercises",{req});

        return ApiClient.assertOk(result);
    }

    public async get(id: string): Promise<ExerciseDTO> {
        const result = await ApiClient.send<ExerciseDTO>("get_exercise_by_id",{exerciseId: id});

        return ApiClient.assertOk(result);
    }
}
