import {ExerciseSet, ISessionExercises} from "../../../types/types.ts";
import Exercise from "./Exercise.ts";
import WeightedSet from "../sets/WeightedSet.ts";
import TimedSet from "../sets/TimedSet.ts";


export default class ExerciseExecution{
    readonly exercise: Exercise;
    readonly sets: ExerciseSet[];

    constructor(_exercise:Exercise,_sets: ExerciseSet[])
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

        const sets: ExerciseSet[] = dto.sets.map(set => {
            if (set.type == "Weighted") return WeightedSet.fromDto(set)
            if (set.type =="Timed") return TimedSet.fromDto(set)
            throw new Error("type not found.");
        })

        return new ExerciseExecution(exercise,sets);
    }
}