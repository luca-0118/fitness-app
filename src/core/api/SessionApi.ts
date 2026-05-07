import BaseApi from "./baseAPI.ts";

export default class SessionApi extends BaseApi {

    static async startWorkout(workoutId: string)
    {
        const resp= await this.fetch<string>("start_session", {req: workoutId});

        return this.handleError(resp);
    }
}