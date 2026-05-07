import BaseSet from "./BaseSet.ts";
import {ITimedSet, setType} from "../../../types/types.ts";


interface TimedSetProps {
    _time:                number,
    _distance:            number,
    _completedAt:         string,
}
export default class TimedSet extends BaseSet {
    public time:     number;
    public distance: number;
    public type: setType = "Timed";

    constructor({_time,_distance,_completedAt}:TimedSetProps) {
        //Constructs the baseSet class on which we build this first.
        super(_completedAt);

        this.time     = _time;
        this.distance = _distance;
    }

    isCompleted(): boolean {
        return !(!!this.time || !!this.distance);
    }

    static fromDto(dto:ITimedSet): TimedSet
    {
        return new TimedSet({
            _time: dto.time,
            _distance: dto.distance,
            _completedAt: dto.time_completed
        })
    }
}