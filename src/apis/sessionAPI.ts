import { ApiClient } from "../classes/api";


export default  class sessionAPI {

    /**
     * Starts a session for a workout.
     * @returns A boolean indicating if the session is started sucessfully.
     */
    public async start(): Promise<Boolean> {
        //TODO write response.
        // const resp      =   await ApiClient.send<string>("start_session");
        const resp: ApiSucess<string> = {
            ok: true,
            data: "testUserSessionId9823743987329859857984343985874343575439854373443435",
        } 

        const sessionId = ApiClient.assertOk(resp);
        
        if (!resp.ok || !sessionId) return false; 

        localStorage.setItem("workoutSessionId",sessionId);

        if (!localStorage.getItem("workoutSessionId")) return false;

        return true;
    }
}