import BaseSet from "./BaseSet.ts";
import {IWeightedSet, setType} from "../../../types/types.ts";


interface WeightedSetProps {
    _reps:              number,
    _weight:            number,
    _completedAt:       string,
}
export default class WeightedSet extends BaseSet {
    public reps: number;
    public weight: number;
    public type: setType = "Weighted";

    constructor({_reps,_weight,_completedAt}:WeightedSetProps) {
        //Constructs the baseSet class on which we build this first.
        super(_completedAt);

        this.reps = _reps;
        this.weight = _weight;

    }
    isCompleted(): boolean {
        return !(!!this.weight || !!this.reps);
    }

    static fromDto(dto: IWeightedSet): WeightedSet
    {
        return new WeightedSet({
            _reps: dto.reps,
            _weight:dto.weight,
            _completedAt: dto.time_completed
        })
    }
}