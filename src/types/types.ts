type backendFunctions = "create_workout" | "list_workouts";

interface WorkoutDTO {
    UUID?: string;
    name: string;
    desc?: string;
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
