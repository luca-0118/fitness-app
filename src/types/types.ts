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
  | "complete_session"
  | "update_session_set"
  | "get_exercises_by_muscle"
  | "create_workout_with_exercises"
  | "workout_history"
  | "get_exercise_by_id";

interface WorkoutDTO {
  uuid: string;
  name: string;
  desc?: string;
}

interface ExerciseDTO {
    exercise_id: string;
    name: string;
    gif_url: string;
    target_muscles: string;
    body_parts: string;
    equipments: string;
    secondary_muscles: string;
    instructions: string;
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
  workout_name: string;
  workout_uuid: string;
  session_uuid: string;
  start_time: string;
  end_time: string;
  exercises: ISessionExercises[];
}

interface ISessionExercises {
  exercise_id: string;
  gif_url: string;
  name: string;
  sets: IWeightedSet[] | ITimedSet[];
}
interface IBaseSet {
  time_completed: string;
}
interface IWeightedSet extends IBaseSet {
  type: "Weighted";
  weight: number;
  reps: number;
}
interface ITimedSet extends IBaseSet {
  type: "Timed";
  time: number;
  distance: number;
}

interface IBaseSetUpdate {
  exercise_id: string;
}

interface IWeightedSetUpdate extends IBaseSetUpdate {
  type: "Weighted";
  exercise_id: string;
  set_nr: number;
  weight: number;
  reps: number;
}

interface ITimedSetUpdate extends IBaseSetUpdate {
  type: "Timed";
  exercise_id: string;
  set_nr: number;
  time: number;
  distance: number;
}

interface workoutHistoryDTO {
  workout_name: string;
  session_uuid: string;
  start_date: string;
  end_date: string;
}

interface IworkoutHistory {
  workoutName: string;
  sessionUuid: string;
  startDate: Date;
  endDate: Date;
}
