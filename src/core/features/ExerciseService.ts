import { listFilterParams } from "../../types/types";
import ExerciseApi from "../api/ExerciseApi";
import Exercise from "../entities/exercise/Exercise.ts";

export default class ExerciseService {
    

    /**
     * Gets a page of exercises based on params given.
     * @param params optional params for getting exercises, includes filtering, querying and page sizes.
     * @returns A list of exercise DTO's.
     */
    static async getExercises(params: listFilterParams)
    {
        // Gets the list of exercises based on params.
        const resp = await ExerciseApi.list(params);
        
        // transforms the dtos, to the objects.
        const mapped = resp.map(exercise => 
            Exercise.fromDto(exercise)
        );
        
        return mapped;
    }
}