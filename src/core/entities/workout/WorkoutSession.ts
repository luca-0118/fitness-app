import {IdetailedWorkoutHistory, WorkoutHistoryDTO} from "../../../types/types.ts";
import Workout from "./Workout.ts";
import ExerciseExecution from "../exercise/ExerciseExecution.ts";
import {DbDate} from "../../../classes/dbDate.ts";


/**
 * The object created for an active Workout.
 * Contains an workout object and some executable exercises.
 */
export default class WorkoutSession {
      readonly sessionUuid: string;
      readonly workout: Workout;
      readonly exercises?: ExerciseExecution[];

      readonly startedAt: DbDate;

      completedAt? :DbDate;
    
    
    constructor(
        _sessionUuid: string,
        _workout: Workout,
        _startedAt: string,
        _exercises?: ExerciseExecution[],
        _completedAt?: string
    )
    {
        this.sessionUuid = _sessionUuid;
        this.workout = _workout;
        this.exercises = _exercises;
        this.startedAt = new DbDate(_startedAt);
        this.completedAt = _completedAt ? new DbDate(_completedAt) : undefined;
    }

    static fromDto(dto: WorkoutHistoryDTO | IdetailedWorkoutHistory): WorkoutSession {
        const workout = new Workout("",dto.workout_name);
        const mappedExercises = "exercises" in dto ? dto.exercises.map(ex => ExerciseExecution.fromDto(ex)) : [];

        return new WorkoutSession(
            dto.session_uuid,
            workout,
            dto.start_date,
            mappedExercises,
            dto.end_date);
    }

}