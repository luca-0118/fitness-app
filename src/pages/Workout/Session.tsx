import { useEffect, useState } from "react";
import CountDownTimer from "../../components/Workout/timers/CountDownTimer.tsx";
import StopWatch from "../../components/Workout/timers/StopWatch.tsx";
import TabataTimer from "../../components/Workout/timers/TabataTimer.tsx";
import { CurrentExercise } from "../../components/Workout/CurrentExercise.tsx";
import Plusknop from "../../components/Workout/buttons/AddSetButton.tsx";
import CompleteSetButton from "../../components/Workout/buttons/CompleteSetButton.tsx";
import FinishWorkoutButton from "../../components/Workout/buttons/FinishWorkoutButton.tsx";
import API from "../../classes/api.ts";
import UseSetUpdate, { TimedSet, WeightedSet } from "../../Hooks/UseSetUpdate.ts";

export default function Session() {
  const [selectedTimer, setSelectedTimer] = useState("stopwatch");
  const [expandedByExercise, setExpandedByExercise] = useState<boolean[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [session, setSession] = useState<ISessionState>();

  const magicFunction = (exercise_id: string) => {
    const update = UseSetUpdate(exercise_id);

    const updateSet = async (set_nr: number, data: WeightedSet | TimedSet) => {
      await update(set_nr, data);
      updateState();
    }

    return updateSet
  }

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

  const updateState = async () => {
    const resp = await API.session.get();
    if (typeof resp === "string") throw new Error(resp);
    setSession(resp);
  }

  const handleAddSet = (exerciseIndex: number) => {
    if (!session) return;
    API.session.addSet(exerciseIndex).then(() => updateState());
  };

  const handleDeleteSet = (exerciseIndex: number) => {
    if (!session) return;
    API.session.removeSet(exerciseIndex).then(() => updateState());
  };

  const handleCompleteSet = (exerciseIndex: number) => {
    setSession((prevSession) => {
      if (!prevSession) return prevSession;

      const exercise = prevSession.exercises[exerciseIndex];
      if (!exercise || exercise.sets.length === 0) return prevSession;

      const areAllCompleted = exercise.sets.every((set) => set.time_completed && set.time_completed !== "");
      const completionTime = areAllCompleted ? "" : new Date().toISOString();
      const isTimedExercise = exercise.sets[0].type === "Timed";

      const nextSets = isTimedExercise
        ? (exercise.sets as ITimedSet[]).map((set) => ({
          ...set,
          time_completed: completionTime,
        }))
        : (exercise.sets as IWeightedSet[]).map((set) => ({
          ...set,
          time_completed: completionTime,
        }));

      if (!areAllCompleted) {
        setExpandedByExercise((prevExpanded) => {
          const nextExpanded = [...prevExpanded];
          nextExpanded[exerciseIndex] = false;
          return nextExpanded;
        });
      }

      const nextExercises = [...prevSession.exercises];
      nextExercises[exerciseIndex] = {
        ...exercise,
        sets: nextSets,
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
        className="w-full flex flex-col items-center fixed inset-0
    top-15
    bottom-15
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
          <div className="w-87 bg-components border-2 border-bordercolor rounded-xl p-4 mb-4 text-center">
            <p className="text-textcolor">No exercises selected.</p>
          </div>
        ) : (
          session.exercises.map((exercise, exerciseIndex) => {
            const isCardio =
              exercise.sets.length > 0 && exercise.sets[0].type === "Timed";

            const isCompleted =
              exercise.sets.length > 0 &&
              exercise.sets.every((set) => set.time_completed !== "");

            return (
              <CurrentExercise
                key={exercise.exercise_id}
                exerciseData={exercise}
                isCompleted={isCompleted}
                isExpanded={expandedByExercise[exerciseIndex] || false}
                onToggle={() => {
                  const next = [...expandedByExercise];
                  next[exerciseIndex] = !next[exerciseIndex];
                  setExpandedByExercise(next);
                }}
                onDeleteSet={isCompleted ? undefined : () =>
                  handleDeleteSet(exerciseIndex)
                }
                updateSet={magicFunction(exercise.exercise_id)}
              >
                <div className="mt-3 flex items-center gap-2">
                  {!isCardio && (
                    <Plusknop
                      onClick={() => handleAddSet(exerciseIndex)}
                      disabled={isCompleted}
                      className="w-full h-12 rounded-full text-textcolor bg-components-hover hover:bg-bordercolor justify-center transition-colors"
                      iconSize={32}
                    />
                  )}
                  <CompleteSetButton
                    onClick={() => handleCompleteSet(exerciseIndex)}
                    isCardio={isCardio}
                    isCompleted={isCompleted}
                  />
                </div>
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
