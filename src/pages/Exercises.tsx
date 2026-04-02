import { useEffect, useState, useMemo } from "react";
import ExerciseOverviewWidget from "../components/ExerciseOverviewWidget.tsx";
import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import StartSessionButton from "../components/StartSessionButton.tsx";
import API from "../classes/api.ts";
import { useWorkout } from "../context/WorkoutContext.tsx";
import { DndManagerdelay } from "../components/DndManager.tsx";

export default function Exercises() {
  const manager = useMemo(() => DndManagerdelay(), []);

  /* muk data, moet uiteindelijk een GET API worden*/
  const [exercises, setExercises] = useState<ExerciseDTO[]>([]);
  const { selectedWorkout } = useWorkout();

  useEffect(() => {
    const getData = async () => {
      const hi = await API.workouts.detailed(selectedWorkout);
      if (typeof hi === "string") {
        return;
      }
      setExercises(
        hi.exercises.map((exercise: ExerciseDTO, index: number) => ({
          ...exercise,
          instanceId: index,
        })),
      );
    };
    getData();
  }, []);

  return (
    <>
      <div
        className="
    fixed inset-0 
    top-15
    bottom-15
    bg-[#1E1E1E] 
    overflow-y-auto
    pt-[env(safe-area-inset-top)]
pb-30

  "
      >
        <DragDropProvider
          manager={manager}
          onDragEnd={(event) => {
            setExercises((exercises) => move(exercises, event));
          }}
        >
          <ul className="mt-5">
            {exercises.map((exercise, index) => (
              <ExerciseOverviewWidget
                key={exercise.exercise_id}
                id={exercise.exercise_id}
                index={index}
                name={exercise.name}
                gif={exercise.gif_url}
                exerciseId={exercise.exercise_id}
              />
            ))}
          </ul>
        </DragDropProvider>
        <div className="fixed bottom-30 w-full">
          <StartSessionButton
            exercises={exercises}
            workoutId={selectedWorkout}
          />
        </div>
      </div>
    </>
  );
}
