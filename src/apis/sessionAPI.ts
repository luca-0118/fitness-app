import { ApiClient } from "../classes/api";


export default  class sessionAPI {

    /**
     * Starts a session for a workout.
     * @param workout_id The provided ID of the workout.
     * @returns A boolean indicating if the session is started sucessfully.
     */
    public async start(workout_id: string): Promise<Boolean> {
        const resp= await ApiClient.send<string>("start_session", {workoutId: workout_id});

        const sessionId= ApiClient.assertOk(resp);
        
        if (!resp.ok || !sessionId) return false; 

        localStorage.setItem("workoutSessionId",sessionId);

        return localStorage.getItem("workoutSessionId") !== null;
    }


    /** Uses stored sessionId in localstorage to get the workout session data.
     * @returns ISessionState | error string
     */
    public async get(): Promise<ISessionState|string> {
        const session_id = localStorage.getItem("workoutSessionId");
        if (!session_id) return "session not found";

        const resp = await ApiClient.send<ISessionState>("get_session",{sessionId: session_id});
        const sessionData = ApiClient.assertOk(resp);
        console.log(sessionData);
        return sessionData;
    }

    public async updateSet(setUpdate: ISetUpdate): Promise<{success: boolean, resp: string }> {
        if ((typeof setUpdate.set_nr !== "number" && setUpdate.set_nr >= 0) || !setUpdate.exercise_id || !setUpdate.reps || !setUpdate.weight) return {success: false, resp:"Not everything has been filled in."};

        const resp = await ApiClient.send<string>("update_set", {setUpdate: setUpdate});
        const data = ApiClient.assertOk(resp);

        console.log("updated set:",data);
        return {success: true, resp: data};
    }
}