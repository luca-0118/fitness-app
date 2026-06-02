import {useEffect, useMemo, useState} from "react";
import ExerciseOverviewWidget from "../../components/Workout/listItems/ExerciseOverviewWidget.tsx";
import {DragDropProvider} from "@dnd-kit/react";
import {move} from "@dnd-kit/helpers";
import StartSessionButton from "../../components/Workout/buttons/StartSessionButton.tsx";
import API from "../../classes/api.ts";
import {useWorkout} from "../../context/WorkoutContext.tsx";
import {DndManagerdelay} from "../../components/General/misc/DndManager.tsx";

export default function Exercises() {
  const manager = useMemo(() => DndManagerdelay(), []);

  /* muk data, moet uiteindelijk een GET API worden*/
  const [exercises, setExercises] = useState<randomFixOfIssue[]>([]);
  const { selectedWorkout } = useWorkout();

  interface randomFixOfIssue extends ExerciseDTO {
    id: number;
  }

  useEffect(() => {
    const getData = async () => {
      const hi = await API.workouts.detailed(selectedWorkout);
      if (typeof hi === "string") {
        return;
      }
      setExercises(
        hi.exercises.map((exercise: ExerciseDTO, index: number) => ({
          ...exercise,
          id: index,
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
    overflow-y-auto
    pt-[env(safe-area-inset-top)]
pb-30

  "
      >
        <DragDropProvider
          manager={manager}
          onDragEnd={(event) => {
            setExercises((exercises) => move(exercises, event) as unknown as randomFixOfIssue[]);
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
