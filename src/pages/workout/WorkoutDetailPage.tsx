import { useEffect, useMemo, useState } from "react";
import WorkoutExerciseItem from "../../components/listItems/WorkoutExerciseItem.tsx";
import { useNavigate, useParams} from "react-router-dom";
import useDetailedWorkout from "../../Hooks/queries/useDetailedWorkout.ts";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton.tsx";
import {ExerciseDTO} from "../../types/types.ts";
import {ROUTES} from "../../types/consts.ts";
import SessionService from "../../core/features/SessionService.ts";

// FIXME Do we want DND in the workoutDetail page?
// import { DragDropProvider,} from "@dnd-kit/react";
// import { move } from "@dnd-kit/helpers";
// import StartSessionButton from "../../components/StartSessionButton.tsx";
// import { DndManagerdelay } from "../../components/DndManager.tsx";
interface idRemapper extends ExerciseDTO {
  id: number;
}

export function WorkoutDetailPage() {
  // const manager = useMemo(() => DndManagerdelay(), []);
  const [draggableExercise, setDraggableExercise] = useState<idRemapper[]>([]);

  // Gets param from the route /workout/:id <-------
  const params = useParams();
  const navigate = useNavigate();
  const workoutId = params.id ?? "";
  const { data, isError, isLoading } = useDetailedWorkout(workoutId);
  const detailedWorkout = data;


  // starts a session, and then routes to the page.
  const onStart = () => {
    SessionService.startWorkout(workoutId).then(() => {
      navigate(ROUTES.SESSION);
    });
  }

  // create draggable exercises, if we have the exercises gathered.
  useEffect(() => {
    setDraggableExercise((prev) => {
      if (!detailedWorkout?.exercises) {
        return prev;
      }

      return detailedWorkout.exercises.map((exercise, idx) => {
        return { id: idx, ...exercise } as idRemapper;
      });
    });
  }, [data]);

  //Only reloads the list of draggable exercises elements if the list of those exercises change.
  const overviewList = useMemo(() => {
    return draggableExercise.map((exercise, /*index*/) => (
      <WorkoutExerciseItem
        key={exercise.exercise_id}
        // id={exercise.exercise_id}
        // index={index}
        name={exercise.name}
        gif={exercise.gif_url}
        exerciseId={exercise.exercise_id}
      />
    ));
  }, [draggableExercise]);

  // //event = never because even using the dndkit lib version doesn't make it work. GG
  // const handleDragEvent = (event: never) => {
  //   setDraggableExercise(
  //     (exercises) => move(exercises, event) as unknown as idRemapper[],
  //   );
  // };

  //Error handling incase the data is not found.
  if (isLoading || isError || !data ) return <h1>Loading.....</h1>;

  return (
    <div className="overflow-y-auto min-h-full flex flex-col p-4">
      <div id={"workout-exercises-list"} className={"flex flex-col gap-4 flex-1"}>
        <h2 className={"text-2xl text-textcolor"}>Exercises: </h2>
        {overviewList}
      </div>
      <PrimaryButton onClick={onStart}>
        <p className={"w-full h-full text-center p-4"}>Start Workout</p>
      </PrimaryButton>
    </div>
  );
}
