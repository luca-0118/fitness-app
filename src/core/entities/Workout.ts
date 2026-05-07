import { IdetailedWorkoutDTO, WorkoutDTO } from "../../types/types";
import entity from "./entity";
import Exercise from "./Exercise";

export default class Workout implements entity {

    //Readonly prevents us from altering the properties after creation.
    readonly uuid: string;
    readonly name: string;
    readonly desc?: string | undefined;
    readonly exercises: Exercise[];
    /**
     * Creates a new Workout Object.
     */
    constructor(
        _uuid:string,
        _name:string,
        options?: {
            desc?: string,
            exercises?: Exercise[]
        }
    )
    {
        this.uuid = _uuid;
        this.name = _name;
        this.desc = options?.desc;
        this.exercises = options?.exercises ?? [];
    }

    /**
     * This is called when you are trying to use the object in for example a console log.
     * @returns The object
     */
    public toJSON() 
    {
        return {
            uuid: this.uuid,
            name: this.name,
            desc: this.desc
        }
    }

    static fromDto(dto:WorkoutDTO|IdetailedWorkoutDTO) : Workout
    {


        return new Workout(
            dto.uuid,
            dto.name,
            {
                desc: dto.desc,
                exercises: "exercises" in dto ? dto.exercises : []
            }
        )
    }
}