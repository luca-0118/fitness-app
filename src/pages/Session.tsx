import { useEffect, useState } from "react";
import CountDownTimer from "../components/CountDownTimer";
import StopWatch from "../components/StopWatch";
import API from "../classes/api";

export default function Session() {
    // example of how to use it.
    useEffect(() => {
        const lol = async () => {
            const respon = await API.workouts.detailed("c8c71277-7cee-4348-8e5e-2a14515a2a32"); //FIXME gather this through the start button for example. get the workout UUID(id).
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
