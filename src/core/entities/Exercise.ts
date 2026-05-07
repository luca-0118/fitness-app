import { ExerciseDTO } from "../../types/types";

export default class Exercise {
    readonly exercise_id: string;
    readonly name: string;
    readonly gif_url: string;
    readonly target_muscles: string;
    readonly body_parts: string;
    readonly equipments: string;
    readonly secondary_muscles: string;
    instructions: string;
    
    constructor(
        _exercise_id:string,
        _name: string,
        _gif_url: string,
        _target_muscles:string,
        _body_parts: string,
        _equipments: string,
        _secondary_muscles: string,
        _instructions: string
    ) 
    {
     this.exercise_id = _exercise_id;
     this.name = _name;
     this.gif_url = _gif_url;
     this.target_muscles = _target_muscles;
     this.body_parts = _body_parts;
     this.equipments = _equipments;
     this.secondary_muscles = _secondary_muscles;
     this.instructions = _instructions;
    }



    static fromDto(dto:ExerciseDTO): Exercise {
        return new Exercise(
            dto.exercise_id,
            dto.name,
            dto.gif_url,
            dto.target_muscles,
            dto.body_parts,
            dto.equipments,
            dto.secondary_muscles,
            dto.instructions
        );
    }
}