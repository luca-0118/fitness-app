import { ApiClient } from "../classes/api";
import DbDate from "../classes/DbDate";

interface createWorkoutInput {
    name:string;
    desc?:string;
    exercises?: string[];
}

export default class workoutAPI {
    public async create(dto: createWorkoutInput): Promise<string|{ok: false, msg: string}> {
        if (!dto.name.trim()) {
            const errMessage = "Workout requires a name"
            console.error(errMessage);
            return errMessage;
        }

        let result: ApiError | ApiSucess<string>;
        if (!dto.exercises || dto.exercises?.length < 1) return {ok: false, msg:"can't create workout without exercises."};

        const req = {
            uuid: "",
            name: dto.name,
            desc: dto.desc,
            exercises: dto.exercises
        };

        result = await ApiClient.send<string>("create_workout_with_exercises",{ req });

        return ApiClient.assertOk(result);
    }

    public async remove(workoutId: string) {
        const result = await ApiClient.send<string>("remove_workout",{req: workoutId});
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

        const resp = await ApiClient.send<IdetailedWorkoutDTO>("get_workout", { req: _workoutUuid });
        return ApiClient.assertOk(resp);
    }

    public async history(): Promise<IworkoutHistory[]> {
        const resp = await ApiClient.send<workoutHistoryDTO[]>("workout_history");

        const data = ApiClient.assertOk(resp);

        return data.map(historyObj => {
            let startDate = new DbDate(historyObj.start_date);
            let endDate = new DbDate(historyObj.end_date);

            return {
                workoutName: historyObj.workout_name,
                sessionUuid: historyObj.session_uuid,
                startDate,
                endDate
            }
        })
    }
}


