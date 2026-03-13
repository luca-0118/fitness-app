/* eslint-disable @typescript-eslint/no-unused-vars */
type backendFunctions =
    | "create_workout"
    | "list_workouts"
    | "link_exercise"
    | "create_exercise"
    | "get_all_exercises"
    | "get_workout"
    | "start_session"
    | "get_session";

interface WorkoutDTO {
    uuid: string;
    name: string;
    desc?: string;
}

interface ExerciseDTO {
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
    workout_name: String,
    session_uuid: String,
    start_time: String,
    end_time: String,
    exercises: SessionExercises[]
}

interface SessionExercises {
    exercise_id: String,
    name: String,
    reps: Number,
    weight: Number,
    time_completed: String
}
