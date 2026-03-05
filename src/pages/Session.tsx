import { useEffect, useState } from "react";
import CountDownTimer from "../components/CountDownTimer";
import StopWatch from "../components/StopWatch";
import API from "../classes/api";
import { useWorkout } from "../context/WorkoutContext";

export default function Session() {
    const { selectedWorkout } = useWorkout();
    // example of how to use it.
    useEffect(() => {
        const lol = async () => {
            const respon = await API.workouts.detailed(selectedWorkout);
            console.log(respon);
        };
        lol();
    }, []);
    const [selectedTimer, setSelectedTimer] = useState("stopwatch");

    return (
        <>
            <div className="w-full flex flex-col items-center pt-6">
                <div className="relative">
                    {selectedTimer === "countdown" && <CountDownTimer onTimerChange={setSelectedTimer} />}
                    {selectedTimer === "stopwatch" && <StopWatch onTimerChange={setSelectedTimer} />}
                </div>
            </div>
        </>
    );
}
