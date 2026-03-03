type backendFunctions = "create_workout" | "list_workouts" | "link_exercise" | "create_exercise";

interface WorkoutDTO {
    UUID?: string;
    name: string;
    desc?: string;
}

interface ExerciseDTO {
    UUID?: string;
    name: string;
    desc?: string;
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
