export default class CompletedExercise {
    readonly exerciseId: string
    readonly name: string
    readonly gifUrl: string

    constructor(
        _exerciseId:string,
        _name:string,
        _gifUrl:string
    ) {
        this.exerciseId = _exerciseId;
        this.name = _name;
        this.gifUrl = _gifUrl;
    }


}