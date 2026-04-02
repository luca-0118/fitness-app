import { useEffect, useState } from "react";
import CountDownTimer from "../components/CountDownTimer";
import StopWatch from "../components/StopWatch";
import TabataTimer from "../components/TabataTimer";
import { CurrentExercise } from "../components/CurrentExercise.tsx";
import Plusknop from "../components/plusknop.tsx";
import FinishWorkoutButton from "../components/FinishWorkoutButton";
import API from "../classes/api.ts";

export default function Session() {
  const [selectedTimer, setSelectedTimer] = useState("stopwatch");
  const [expandedByExercise, setExpandedByExercise] = useState<boolean[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [session, setSession] = useState<ISessionState>();

  useEffect(() => {
    const getState = async () => {
      const resp = await API.session.get();
      console.log(resp);
      if (typeof resp !== "string") {
        setSession(resp);
        setExpandedByExercise(Array(resp.exercises.length).fill(false));
      }
    };
    getState();
  }, []);

  useEffect(() => {
    if (!session) return;

    const startTime = new Date(session.start_time).getTime();
    const now = new Date().getTime();
    setElapsedSeconds(Math.floor((now - startTime) / 1000));

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const elapsed = Math.floor((now - startTime) / 1000);
      setElapsedSeconds(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [session]);

  const handleAddSet = (exerciseIndex: number) => {
    setSession((prevSession) => {
      if (!prevSession) return prevSession;

      const exercise = prevSession.exercises[exerciseIndex];
      if (!exercise) return prevSession;

      if (exercise.sets.length > 0 && exercise.sets[0].type === "Timed") {
        return prevSession;
      }

      const lastSet = exercise.sets[exercise.sets.length - 1] as
        | IWeightedSet
        | undefined;
      const newSet: IWeightedSet = lastSet
        ? { ...lastSet }
        : {
            type: "Weighted",
            reps: 0,
            weight: 0,
            time_completed: new Date().toISOString(),
          };

      const nextExercises = [...prevSession.exercises];
      nextExercises[exerciseIndex] = {
        ...exercise,
        sets: [...exercise.sets, newSet] as IWeightedSet[],
      };

      return {
        ...prevSession,
        exercises: nextExercises,
      };
    });
  };

  const handleDeleteSet = (exerciseIndex: number, setIndex: number) => {
    setSession((prevSession) => {
      if (!prevSession) return prevSession;

      const exercise = prevSession.exercises[exerciseIndex];
      if (!exercise) return prevSession;

      if (exercise.sets.length > 0 && exercise.sets[0].type === "Timed") {
        return prevSession;
      }

      if (exercise.sets.length <= 1) {
        return prevSession;
      }

      const nextExercises = [...prevSession.exercises];
      nextExercises[exerciseIndex] = {
        ...exercise,
        sets: exercise.sets.filter((_, idx) => idx !== setIndex) as
          | IWeightedSet[]
          | ITimedSet[],
      };

      return {
        ...prevSession,
        exercises: nextExercises,
      };
    });
  };

  if (!session) return <h1>Loading....</h1>;

  return (
    <>
      <div
        className="w-full flex flex-col items-center     fixed inset-0 
    top-15
    bottom-15
    bg-[#1E1E1E] 
    overflow-y-auto
    pt-[env(safe-area-inset-top)]
pb-30
    
    "
      >
        <div className="relative mb-6 mt-5">
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

        {session.exercises.length === 0 ? (
          <div className="w-87 bg-[#1E1E1E] border-2 border-[#565d5d] rounded-xl p-4 mb-4 text-center">
            <p className="text-white">No exercises selected.</p>
          </div>
        ) : (
          session.exercises.map((exercise, exerciseIndex) => {
            const isCardio =
              exercise.sets.length > 0 && exercise.sets[0].type === "Timed";

            return (
              <CurrentExercise
                key={exercise.exercise_id}
                exerciseData={exercise}
                isExpanded={expandedByExercise[exerciseIndex] || false}
                onToggle={() => {
                  const next = [...expandedByExercise];
                  next[exerciseIndex] = !next[exerciseIndex];
                  setExpandedByExercise(next);
                }}
                onDeleteSet={(setIndex) =>
                  handleDeleteSet(exerciseIndex, setIndex)
                }
              >
                {!isCardio && (
                  <Plusknop
                    onClick={() => handleAddSet(exerciseIndex)}
                    className="mt-3 w-77 h-12 rounded-full bg-[#2e2e2e] hover:bg-[#3a3a3a]  justify-center transition-colors"
                    iconSize={32}
                  />
                )}
              </CurrentExercise>
            );
          })
        )}
        <div className="">
          <FinishWorkoutButton elapsedSeconds={elapsedSeconds} />
        </div>
      </div>
    </>
  );
}
