import WorkoutApi from "../api/WorkoutApi";
import Exercise from "../entities/Exercise";
import Workout from "../entities/Workout";

export default class WorkoutService {

    /**
     * Gets all workouts made by the user.
     * @returns A workout Object without exercises
     */
    static async getWorkouts() : Promise<Workout[]>
    {
        // gets the list of workouts made by the user from the backend.
        const workouts = await WorkoutApi.list();

        // transforms all the workoutDTO's into Workout objects.
        const mappedWorkouts = workouts.map(workout => 
            Workout.fromDto(workout));

        return mappedWorkouts;
    } 

    /**
     * Gets a workout with exercises.
     * @param workoutId The uuid of an workout
     * @returns Workout object
     */
    static async getDetailedWorkout(workoutId: string)
    {
        // Grabs the response from the api call.
        const workoutDTO = await WorkoutApi.single(workoutId);

        //Checks if it's found, otherwise throw an error.
        if (!workoutDTO) throw new Error("workout not found");

        // map all the exercises in the response to an exercise object.
        const exercises = workoutDTO.exercises.map(exercise => Exercise.fromDto(exercise));

        // return a Workout object with the exercises.
        return new Workout(workoutDTO.uuid,workoutDTO.name,{exercises});
    } 
}