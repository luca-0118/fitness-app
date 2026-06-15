import { invoke } from "@tauri-apps/api/core";

interface CreateWorkoutInput {
    uuid: string;
    name:string;
    desc?:string;
    exercises?: string[];
}

interface apiSucessResponse {
    ok: true;
    data: boolean;
}
interface apiFailureReponse {
    ok: false;
    error_type:string;
    message:string;
}


/**
 * updates workout nd reutrns the succes or failure message.
 * @returns the update workout function
 */
export default function useUpdateWorkout() {

    const updateWorkout = async (workoutObj: CreateWorkoutInput) => {
        if (!workoutObj.name || !workoutObj.exercises || workoutObj.exercises.length < 1) return;

        const resp = await invoke<apiSucessResponse|apiFailureReponse>("edit_workout",{workoutObj});

            if (resp.ok)
            {
                console.log(resp.data);
                return true;

            } else {
                console.error("could not update workout: ",resp.message);
                return false;
            }
    }


    return updateWorkout;
}