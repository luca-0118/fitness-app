import WorkoutWidget from "../../components/Workout/listItems/WorkoutWidget.tsx";
import WorkoutAddButton from "../../components/Workout/buttons/WorkoutAddButton.tsx";
import { useState, useEffect, useMemo } from "react";
import API from "../../classes/api.ts";
import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import { DndManagerdelay } from "../../components/General/misc/DndManager.tsx";

// I quite genuinely have to remap my UUID to id because of muks lib. I hate libs.
type dndLibModifier = {
  id: string;
  name: string;
  desc?: string;
};

export default function WorkoutOverview() {
  const manager = useMemo(() => DndManagerdelay(), []);

  const [workouts, setWorkouts] = useState<dndLibModifier[]>([]);

  const getWorkouts = async () => {
      //beautifully wrapped API call.
      const workoutList = await API.workouts.list();
      // I have to remap the response because muks lib requires an ID
      const remappedWorkout: dndLibModifier[] = workoutList.map((workout) => {
        return {
          id: workout.uuid,
          name: workout.name,
          desc: workout.desc,
        };
      });
        setWorkouts(remappedWorkout);
    };

  useEffect(() => {
    // just calls this above ^
    getWorkouts();
  }, []);

  if (!workouts) return <h1>Loading....</h1>;

  // if the list is still empty, return a incentive to create an workout.
  if (Object.keys(workouts).length < 1)
    return (
      <div
        className="
    fixed inset-0 
    top-15
    overflow-y-auto
    pt-[env(safe-area-inset-top)]
    pb-[env(safe-area-inset-bottom)]
  "
      >
        <ul className="pt-2 text-center text-gray-400">
          <li>No workouts yet. Create a new one!</li>
        </ul>
        <div className="fixed bottom-30 left-0 right-0 flex justify-center z-20">
          <WorkoutAddButton to="/new-workout" />
        </div>
      </div>
    );

  return (
    <>
      <div
        className="
    fixed inset-0 
    top-15
    bottom-15
    overflow-y-auto
    pt-[env(safe-area-inset-top)]
 pb-20
  "
      >
        <DragDropProvider
          manager={manager}
          onDragEnd={(event) => {
            // #TODO add local backend ordering.
            setWorkouts((workout) => move(workout, event));
          }}
        >
          <ul className="pt-5 pb-17">
            {workouts.map((workout, index) => (
              <WorkoutWidget
                key={workout.id}
                id={workout.id}
                index={index}
                name={workout.name}
                reloadWorkouts={getWorkouts}
              />
            ))}
          </ul>
        </DragDropProvider>
      </div>
      <div className="fixed bottom-30 left-0 right-0 flex justify-center z-20">
        <WorkoutAddButton to="/new-workout" />
      </div>
    </>
  );
}
