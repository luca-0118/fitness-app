import { workoutHistoryDTO } from "../../types/types";
import BaseApi from "./baseAPI";

export default class HistoryApi extends BaseApi {
    
    static async getWorkoutHistory() 
    {
        const resp = await this.fetch<workoutHistoryDTO[]>("workout_history");

        const history = this.handleError(resp);

        return history.data;
        
    }
}