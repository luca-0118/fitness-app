import { useState } from "react";
import CountDownTimer from "../components/CountDownTimer";
import StopWatch from "../components/StopWatch";
import Header from "../components/Header.tsx";

export default function Session() {
  const [selectedTimer, setSelectedTimer] = useState("stopwatch");

  return (
      <>
          <Header />
            <div className="w-full flex flex-col items-center pt-6">
                <div className="relative">
                    {selectedTimer === "countdown" && <CountDownTimer onTimerChange={setSelectedTimer} />}
                    {selectedTimer === "stopwatch" && <StopWatch onTimerChange={setSelectedTimer} />}
                </div>
            </div>
      </>
  );
}