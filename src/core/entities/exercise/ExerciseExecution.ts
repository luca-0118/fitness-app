import { ISessionExercises, ITimedSet, IWeightedSet} from "../../../types/types.ts";
import Exercise from "./Exercise.ts";

type Set = ITimedSet[] | IWeightedSet[];
export default class ExerciseExecution{
    readonly exercise: Exercise;
    readonly sets: Set;

    constructor(_exercise:Exercise,_sets: Set)
    {
        this.exercise = _exercise;
        this.sets = _sets;
    }


    static fromDto(dto: ISessionExercises) {
        // Creates a new ExerciseExecution from backend response.
        const exercise = new Exercise(
            dto.exercise_id,
            dto.name,
            dto.gif_url,
            "",
            "",
            "",
            "",
            "",
        );

        return new ExerciseExecution(exercise,dto.sets);
    }
}