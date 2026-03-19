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

    public async complete(): Promise<{ok:boolean,msg:string}> {
        if (typeof localStorage.getItem("workoutSessionId") == "undefined") 
            return {ok: false, msg:"no workout active to save."}


        const resp = await ApiClient.send<string>("complete_session");

        localStorage.removeItem("workoutSessionId");
        return {
            ok: true,
            msg:"cleared"
        }
    }
}