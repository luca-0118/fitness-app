import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../classes/api";

interface FinishWorkoutButtonProps {
  elapsedSeconds?: number;
}

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export default function FinishWorkoutButton({
  elapsedSeconds = 0,
}: FinishWorkoutButtonProps) {
  const navigate = useNavigate();
  const [isFinishing, setIsFinishing] = useState(false);

  const handleFinishWorkout = async () => {
    if (isFinishing) {
      return;
    }

    try {
      setIsFinishing(true);
      const resp = await API.session.complete();

      if (resp.ok) {
        navigate("/");
      }
    } catch (error) {
      console.error("Failed to finish workout", error);
    } finally {
      setIsFinishing(false);
    }
  };

  return (
    <div className="fixed bottom-30 left-1/2 z-40 w-96 max-w-[92vw] -translate-x-1/2">
      <button
        type="button"
        onClick={handleFinishWorkout}
        disabled={isFinishing}
        className="flex w-full items-center justify-between rounded-full border border-[#414141] bg-[#F67631] px-6 py-5 text-left text-lg font-bold text-white transition-colors hover:bg-[#ff8a4a] disabled:cursor-not-allowed disabled:opacity-70"
      >
        <span>{isFinishing ? "Finishing..." : "Finish Workout"}</span>
        <span className="text-lg tabular-nums">
          {formatTime(elapsedSeconds)}
        </span>
      </button>
    </div>
  );
}
