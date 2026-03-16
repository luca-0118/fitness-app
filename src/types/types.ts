/* eslint-disable @typescript-eslint/no-unused-vars */
type backendFunctions =
    | "create_workout"
    | "list_workouts"
    | "link_exercise"
    | "create_exercise"
    | "get_all_exercises"
    | "get_workout"
    | "start_session"
    | "get_session"
    | "update_set";

interface WorkoutDTO {
    uuid: string;
    name: string;
    desc?: string;
}

interface ExerciseDTO {
    instanceId: number;
    id: string;
    name: string;
    data: string;
}

interface linkExerciseDTO {
    workout_uuid: string;
    exercise_uuid: string;
}

interface ApiError extends ApiReponse {
    ok: false;
    error_type: string;
    message: string;
}

interface ApiReponse {
    ok: boolean;
}

interface ApiSucess<T> extends ApiReponse {
    ok: true;
    data: T;
}

interface IdetailedWorkoutDTO {
    uuid: string;
    name: string;
    desc: string;
    exercises: ExerciseDTO[];
}

interface ISessionState {
    workout_name: string,
    workout_uuid: string,
    session_uuid: string,
    start_time: string,
    end_time: string,
    exercises: ISessionExercises[]
}

interface ISessionExercises {
    exercise_id: string,
    gif_url: string,
    name: string,
    sets: ISessionSets[]
}
interface ISessionSets {
    reps: number,
    weight: number,
    time_completed: string
}

interface ISetUpdate {
    exercise_id: string,
    set_nr: number,
    reps: number,
    weight: number,
}
