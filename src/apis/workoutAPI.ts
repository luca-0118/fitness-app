import { ApiClient } from "../classes/api";

export default class workoutAPI {
    public async create(_name: string, _desc?: string): Promise<string> {
        if (!_name.trim()) {
            const errMessage = "Workout requires a name"
            console.error(errMessage);
            return errMessage;
        }

        const workout: WorkoutDTO = {
            uuid: "",
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
        return ApiClient.assertOk(result);
    }

    /**
     *  Gets a workout with it's connected exercises based on the provided Uuid.
     * @param _workoutUuid The Uuid provided from the backend list.
     * @returns a detailed list of workout information and connected exercises.
     */
    public async detailed(_workoutUuid: string): Promise<IdetailedWorkoutDTO | string> {
        if (!_workoutUuid) {
            const err = "workout requires username";
            console.error(err);
            return err;
        }

        const resp = await ApiClient.send<IdetailedWorkoutDTO>("get_workout", { workoutUuid: _workoutUuid });
        return ApiClient.assertOk(resp);
    }

    public async history(): Promise<IworkoutHistory[]> {
        const resp = await ApiClient.send<workoutHistoryDTO[]>("workout_history");

        const data = ApiClient.assertOk(resp);

        return data.map(historyObj => {
            let startDate = new Date(historyObj.start_date);
            let endDate = new Date(historyObj.end_date);

            return {
                workoutName: historyObj.workout_name,
                sessionUuid: historyObj.session_uuid,
                startDate,
                endDate
            }
        })
    }
}


