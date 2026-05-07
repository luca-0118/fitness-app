import { IdetailedWorkoutHistory, WorkoutHistoryDTO} from "../../types/types";
import BaseApi from "./baseAPI";

export default class HistoryApi extends BaseApi {
    
    static async getWorkoutHistory() 
    {
        const resp = await this.fetch<WorkoutHistoryDTO[]>("workout_history");

        const history = this.handleError(resp);

        return history.data;
        
    }

    static async getOneWorkout(workoutId: string): Promise<IdetailedWorkoutHistory>
    {
        const resp = await this.fetch<IdetailedWorkoutHistory>("workout_history_single", {req: workoutId});

        const completedWorkout = this.handleError(resp);

        return completedWorkout.data;
    }
}