import { ApiClient } from "../classes/api";

export default class ExercisesAPI {
    // TODO broken after main import, gotta fix
    // public async create(_name: string, _desc?: string) {
    //     if (!_name) {
    //         const err = "workout requires username";
    //         console.error(err);
    //         return err;
    //     }

    //     const exercise: ExerciseDTO = {
    //         name: _name,
    //         desc: _desc,
    //     };
    //     const result = await ApiClient.send<string>("create_exercise", { exercise });
    //     return ApiClient.assertOk(result);
    // }

    public async list(): Promise<ExerciseDTO[]> {
        const result = await ApiClient.send<ExerciseDTO[]>("get_all_exercises");
        return ApiClient.assertOk(result);
    }
}
