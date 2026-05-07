import { DbDate } from "../../classes/dbDate";
import { ISessionExercises } from "../../types/types";

export default class CompletedWorkout {
      readonly workout_name: string;
      readonly session_uuid: string;
      readonly start_date: DbDate;
      readonly end_date: DbDate;
      readonly exercises?: ISessionExercises[];
    
    
    constructor(
        _workoutName: string,
        _sessionUuid: string,
        _startDate: string,
        _endDate: string,
        _exercises?: ISessionExercises[]
    )
    {
        this.workout_name = _workoutName;
        this.session_uuid = _sessionUuid;
        this.start_date = new DbDate(_startDate);
        this.end_date = new DbDate(_endDate);
        this.exercises = _exercises;
    }

    static fromDto() {
        
    }

}