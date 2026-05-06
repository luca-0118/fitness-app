import WorkoutItem from "../../components/listItems/WorkoutItem.tsx";
import { useState, useEffect, useMemo } from "react";
import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import { DndManagerdelay } from "../../components/DndManager.tsx";
import useWorkouts from "../../Hooks/useWorkouts.ts";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton.tsx";
import {Link} from "react-router-dom";
import {ROUTES} from "../../types/consts.ts";
import WorkoutItemSkeleton from "../../components/skeletons/WorkoutItemSkeleton.tsx";

// I quite genuinely have to remap my UUID to id because of muks lib. I hate libs.
type dndLibModifier = {
  id: string;
  name: string;
  desc?: string;
};

export default function WorkoutOverviewPage() {
  const manager = useMemo(() => DndManagerdelay(), []);
  const workoutList = useWorkouts();
  const [workouts, setWorkouts] = useState<dndLibModifier[]>([]);

  //sets the data according to what dndLibModifier needs.
  useEffect(() => {
    if (!workoutList.data) return;
    // Creating fake delay
    setWorkouts(workoutList.data.map(workout => ({
        id: workout.uuid,
        ...workout,
    } satisfies dndLibModifier)));

  }, [workoutList.data]);

  //holds the list components
  const workoutItemList = useMemo(() => {
    return workouts.map((workout, index) => (
      <WorkoutItem
        key={workout.id}
        id={workout.id}
        index={index}
        name={workout.name}
        reloadWorkouts={() => workoutList.refetch()}
      />
    ));
  }, [workouts, workoutList.refetch]);

  return (
      <div className="overflow-y-auto min-h-full flex flex-col p-4 gap-4">
        <DragDropProvider
          manager={manager}
          onDragEnd={(event) => {
            // #TODO add local backend ordering.
            setWorkouts((workout) => move(workout, event));
          }}>
          <ul className="w-full flex-1 flex flex-col gap-4">
            {/*one-line if statement*/}
            {workoutList.isLoading ? <><WorkoutItemSkeleton/><WorkoutItemSkeleton/><WorkoutItemSkeleton/><WorkoutItemSkeleton/><WorkoutItemSkeleton/><WorkoutItemSkeleton/></> :null}
            {workoutItemList.length < 0 && !workoutList.isLoading && !workoutList.isError ? <li className={"text-center"}>No workouts yet. Create a new one!</li> : workoutItemList}
          </ul>
        </DragDropProvider>

        <PrimaryButton className="p-4">
          <Link className={"w-full h-full text-center p-4"} to={ROUTES.WORKOUT_CREATE}>Create new workout</Link>
        </PrimaryButton>
      </div>
  );
}
