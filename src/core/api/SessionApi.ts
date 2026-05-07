import BaseApi from "./baseAPI.ts";
import {ISessionState} from "../../types/types.ts";

export default class SessionApi extends BaseApi {

    static async startWorkout(workoutId: string)
    {
        const resp= await this.fetch<string>("start_session", {req: workoutId});

        return this.handleError(resp);
    }

    static async getCurrentSession(sessionId: string)
    {
        // LOL this sessionID is absolutely useless.....
        const resp = await this.fetch<ISessionState>("get_session",{req:sessionId});

        const sessionData = this.handleError(resp);
        console.log(sessionData);
        return sessionData.data;
    }
}