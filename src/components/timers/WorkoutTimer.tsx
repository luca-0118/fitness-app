import CountDownTimer from "./CountDownTimer.tsx";
import StopWatch from "./StopWatch.tsx";
import TabataTimer from "./TabataTimer.tsx";
import {useState} from "react";

/**
 * Combines all the loose timers into a single timer.
 * @constructor
 */
export default function WorkoutTimer() {
    const [selectedTimer, setSelectedTimer] = useState("stopwatch");

    return <div className="relative mb-6 mt-5">
        {selectedTimer === "countdown" && (
            <CountDownTimer onTimerChange={setSelectedTimer} />
        )}
        {selectedTimer === "stopwatch" && (
            <StopWatch onTimerChange={setSelectedTimer} />
        )}
        {selectedTimer === "tabata" && (
            <TabataTimer onTimerChange={setSelectedTimer} />
        )}
    </div>
}