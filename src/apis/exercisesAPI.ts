import { ApiClient } from "../classes/api";

/**
 * ISP + DIP: ExercisesAPI now implements IExercisesAPI, programming to an
 * abstraction.  The muscleGroups type is declared globally in types.ts so that
 * this API class no longer depends on a hook module.
 */
export default class ExercisesAPI implements IExercisesAPI {
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
