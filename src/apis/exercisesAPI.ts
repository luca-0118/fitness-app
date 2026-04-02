import { ApiClient } from "../classes/api";
import {muscleGroups} from "../Hooks/UseMuscleFilters.ts";

export default class ExercisesAPI {
    public async list(): Promise<ExerciseDTO[]> {
        const result = await ApiClient.send<ExerciseDTO[]>("get_all_exercises");
        return ApiClient.assertOk(result);
    }

    public async filter(muscle: muscleGroups): Promise<ExerciseDTO[]> {
        const result = await ApiClient.send<ExerciseDTO[]>("get_exercises_by_muscle",{req: muscle});
        return ApiClient.assertOk(result);

    }

    public async get(id: string): Promise<ExerciseDTO> {
        const result = await ApiClient.send<ExerciseDTO>("get_exercise_by_id",{exerciseId: id});

        return ApiClient.assertOk(result);
    }
}
