import HistoryApi from "../api/HistoryApi";
import CompletedWorkout from "../entities/CompletedWorkout";

export default class HistoryService {
    
    static async list() 
    {
        const history = await HistoryApi.getWorkoutHistory();

        const mapped = history.map(h => CompletedWorkout.fromDto(h)) 


    }
}