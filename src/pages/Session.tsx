import { useEffect, useState } from "react";
import CountDownTimer from "../components/CountDownTimer";
import StopWatch from "../components/StopWatch";
import Header from "../components/Header.tsx";
import Plusknop from "../components/plusknop.tsx";
import Sets from "../components/Sets.tsx";
import CurrentExercise from "../components/CurrentExercise.tsx";

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
                
                <CurrentExercise 
                  exerciseName="Leg extensions" 
                  exerciseImage="/path/to/image.png"
                />
                
                <Sets setNumber={1} />
            </div>
        </>
    );
}
