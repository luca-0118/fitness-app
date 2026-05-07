import {DbDate} from "../../../classes/dbDate.ts";

export default abstract class BaseSet{
    timeCompleted?: DbDate;

    protected constructor(_timeCompleted?:string) {
        this.timeCompleted = new DbDate(_timeCompleted);
    }

    /**
     * Abstract functions and classes require certain parts to be implemented.
     */
    abstract isCompleted(): boolean

}