import { IdetailedWorkoutDTO, WorkoutDTO } from "../../types/types";
import BaseApi from "./baseAPI";

/**
 * Holds all the api calls for anything surrounding the workouts.
 */
export default class WorkoutApi extends BaseApi{

    /**
     * Returns a list of all the workouts created by the user.
     */
    static async list(): Promise<WorkoutDTO[]> 
    {
        const response = await this.fetch<WorkoutDTO[]>("list_workouts");
        
        const data = this.handleError(response);

        return data.data;
    }

    /**
     * Gets a single workout based on workoutId
     * @param workoutId the id of an workout
     * @returns the workout data from the database.
     */
    static async single(workoutId: string)
    {
        const workout = await this.fetch<IdetailedWorkoutDTO>("get_workout",{ req: workoutId });

        const data = this.handleError(workout);

        return data.data;
    }

}