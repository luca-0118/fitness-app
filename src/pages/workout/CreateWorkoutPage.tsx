import PrimaryButton from "../../components/ui/buttons/PrimaryButton.tsx";
import {Link, useNavigate, useOutletContext} from "react-router-dom";
import {ROUTES} from "../../types/consts.ts";
import {WorkoutOutletContext} from "../../components/routers/WorkoutRoutes.tsx";
import {ChangeEvent} from "react";
import ExerciseItem from "../../components/listItems/ExerciseItem.tsx";
import API from "../../classes/api.ts";
import toast from "react-hot-toast";
import {useQueryClient} from "@tanstack/react-query";

export default function CreateWorkoutPage() {
  // We pull the usestate stuff form the context given to us by the outlet
  // https://reactrouter.com/api/hooks/useOutletContext
  const {tempWorkout,setTempWorkout} = useOutletContext<WorkoutOutletContext>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();


  // takes all the previous values of the temp-workout and then changes name.
  const handleNameChange = (e:ChangeEvent<HTMLInputElement>) => {
    setTempWorkout(prev => {
      return {...prev,name: e.target.value}
    })
  }

  const saveWorkout = () => {
    API.workouts.create({
      name: tempWorkout.name,
      desc: tempWorkout.desc,
      exercises: tempWorkout.exercises.map(exercise => exercise.id)
    })
    .then((resp) => {
      if (typeof resp !== "string") return toast.error(resp.msg);

      // Ensures we remove the previously made query and re-request the workouts.
      void queryClient.invalidateQueries({queryKey: ["workouts"]});

      toast.success("workout Created!!");

      setTimeout(() => {
      navigate(ROUTES.WORKOUTS);
      },300)
    });
  }

  return (
    <div className="flex w-full h-full flex-col p-4">
      <input
        id={"workout-name"}
        type="text"
        placeholder="Workout Name"
        defaultValue={tempWorkout.name}
        onChange={handleNameChange}
        autoComplete={"false"}
        className="border p-2 rounded text-textcolor bg-components border-accent w-full flex"
      />

      <section id={"selected-exercises"} className="mt-4 w-full flex flex-col flex-1 min-h-0">
        <h2 className="font-bold text-textcolor text-center justify-center mb-2 border-b-2 border-bordercolor w-full flex">
          Selected Exercises:
        </h2>
        <ul id={"selected-exercises-list"} className="text-center flex-1 w-full py-2 gap-4 flex flex-col overflow-y-scroll no-scrollbar">
          {tempWorkout.exercises.map((exercise) => {
            return (
                <ExerciseItem key={exercise.id} name={exercise.name} gif={exercise.gif} id={exercise.id} selected={true}/>
            );
          })}
        </ul>
        <div className={"flex flex-row gap-2"}>
          <PrimaryButton>
            <Link className={"w-full h-full py-4"} to={ROUTES.EXERCISES}>Select Exercises</Link>
          </PrimaryButton>

          {/*Shows button only when there's an exercise selected.*/}
          {tempWorkout.exercises.length > 0 ?
              <PrimaryButton onClick={saveWorkout} className={"bg-button-start hover:bg-button-start active:bg-button-start shadow-none"}>
                <p className={"w-full h-full py-4"}>Save</p>
              </PrimaryButton>
          :null}
        </div>

      </section>
    </div>
  );
}
