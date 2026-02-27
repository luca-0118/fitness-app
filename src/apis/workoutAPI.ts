import { ApiClient } from "../classes/api";

export default class workoutAPI {
    public async create(_name: string, _desc?: string): Promise<string> {
        if (!_name) {
            const err = "workout requires username";
            console.error(err);
            return err;
        }

        const workout: WorkoutDTO = {
            name: _name,
            desc: _desc,
        };

        const result = await ApiClient.send<string>("create_workout", { workout });
        return ApiClient.assertOk(result);
    }

    public async list(): Promise<Array<WorkoutDTO>> {
        const result = await ApiClient.send<WorkoutDTO[]>("list_workouts");
        return ApiClient.assertOk(result);
    }

    public async linkExercise(_workoutID: string, _exerciseID: string) {
        const linkExercise: linkExerciseDTO = {
            workout_uuid: _workoutID,
            exercise_uuid: _exerciseID,
        };
        const result = await ApiClient.send<string>("link_exercise", { linkExercise });
    }
}
