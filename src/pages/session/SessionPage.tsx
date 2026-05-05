import { useState } from "react";
import {ExerciseSetUpdate} from "../../types/types.ts";
import WorkoutTimer from "../../components/timers/WorkoutTimer.tsx";
import useSession from "../../Hooks/useSession.ts";
import SessionExerciseItem from "../../components/listItems/SessionExerciseItem.tsx";
import useUpdateSet from "../../Hooks/useUpdateSet.ts";
import useElapsedTime from "../../Hooks/useElapsedTime.ts";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton.tsx";
import {formatSecondsToHMS} from "../../types/Helpers.ts";
import API from "../../classes/api.ts";
import {useNavigate} from "react-router-dom";
import {ROUTES} from "../../types/consts.ts";
import toast from "react-hot-toast";

export default function SessionPage() {
  const [openExercise,setOpenExercise] = useState<number|null>(null);
  const session = useSession();
  const setUpdater = useUpdateSet();
  const navigate = useNavigate();

  const updateSet = (update: ExerciseSetUpdate) => {
    setUpdater.mutate(update);
  }

  const handleExerciseOpen = (setNr:number) => {
    setOpenExercise(prev => prev === setNr ? null : setNr)
  }

  const handleSave = () => {
    API.session.complete().then(() => {
      toast.success("You have completed your workout!");
      navigate(ROUTES.WORKOUTS);
    });
  }

  const handleSetAdd = (type: "Weighted"|"Timed",exercise_id:string) => {
    const exercise = session.data?.exercises.find(exercise => exercise.exercise_id == exercise_id);
    if(!exercise) return;

    const set: ExerciseSetUpdate = (type === "Weighted") ? {
      type: "Weighted",
          exercise_id,
          set_nr: exercise.sets.length,
          reps:0,
          weight:0
    } : {
      type: "Timed",
      exercise_id,
      set_nr: exercise.sets.length,
      time:0,
      distance:0
    }

    setUpdater.mutate(set);
  }

  const elapsedSeconds = useElapsedTime(session.data?.start_time ?? "");

  if (session.isLoading) return <h1>Loading....</h1>;
  if (session.isError || !session.data) return <h1>Loading....</h1>;

  return (
    <>
      <div className="min-h-full flex flex-col p-4">
        <WorkoutTimer/>

        <section id={"session-exercise-list"} className={"w-full h-full flex flex-col gap-2 overflow-y-auto custom-scrollbar"}>
        {session.data.exercises.map((exercise,idx) => <SessionExerciseItem onSetAdd={handleSetAdd} onSetUpdate={updateSet} exercise={exercise} onClick={() => handleExerciseOpen(idx)} isOpen={openExercise === idx}/>)}
        </section>

        <PrimaryButton className={"flex flex-col p-2 w-full h-fit"} onClick={handleSave}>
          <p className={"text-2xl"}>Complete workout</p>
          <p>{formatSecondsToHMS(elapsedSeconds)}</p>
        </PrimaryButton>

      </div>
    </>
  );
}
