import { useState } from "react";
import CountDownTimer from "../components/CountDownTimer";
import StopWatch from "../components/StopWatch";
import Header from "../components/Header.tsx";
import Plusknop from "../components/plusknop.tsx";
import Sets from "../components/sets.tsx";
import CurrentExercise from "../components/CurrentExercise.tsx";

export default function Session() {
  const [selectedTimer, setSelectedTimer] = useState("stopwatch");

  return (
      <>
          <Header />
            <div className="w-full flex flex-col items-center pt-6 pb-24">
                <div className="relative mb-6">
                    {selectedTimer === "countdown" && <CountDownTimer onTimerChange={setSelectedTimer} />}
                    {selectedTimer === "stopwatch" && <StopWatch onTimerChange={setSelectedTimer} />}
                </div>
                
                <CurrentExercise 
                  exerciseName="Leg extensions" 
                  exerciseImage="/path/to/image.png"
                />
                
                <Sets setNumber={1} />
            </div>
        <div>
            <Plusknop/>
        </div>
        
      </>
  );
}