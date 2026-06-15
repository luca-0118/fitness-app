import { useNavigate, useParams } from "react-router-dom";
import ExerciseOverviewWidget from "../../components/Workout/listItems/ExerciseOverviewWidget.tsx";
import AddExerciseButton from "../../components/Workout/buttons/AddExerciseButton.tsx";
import { useEditWorkout } from "../../context/EditWorkoutContext.tsx";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function EditWorkout() {
  const params = useParams();
  const workoutId = params.workoutId;
  const editContext = useEditWorkout();
  const navigate = useNavigate();

  const workout = editContext.workout;


  useEffect(() => {
    editContext.initializeDraft(workoutId ?? "");
  }, []);

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    editContext.updateName(e.target.value);
  }


  const updateWorkout = async () => {
    if (!await editContext.saveChanges()) return console.error("could not save workout changes");




    // adds a smaller timeout, as should be, in order to make it not feel as instant. Better UX.
    setTimeout(() => {
      toast.success("Sucessfully saved workout changes!");
      navigate(`/workouts`);
    }, 300);

  }


  if (!workout) return (<><div></div></>);


  return (
    <div
      className="
    fixed inset-0 
    top-15
    bottom-15
    overflow-y-auto
    pt-[env(safe-area-inset-top)]
    pb-[env(safe-area-inset-bottom)]
  "
    >
      <div className="w-full min-h-10 h-fit mt-4 bg-accent flex items-center justify-center">
        <p className="text-textcolor text-2xl">Currently editing {workout.name}</p>
      </div>

      <input
        type="text"
        placeholder="Workout Name"
        value={workout?.name}
        onChange={onNameChange}
        className="border p-2 rounded text-textcolor bg-components border-accent w-[90%] mx-auto flex mt-5"
      />
      <div className="mt-4">
        <h2 className="font-bold text-textcolor text-center justify-center mb-2 border-b-2 border-bordercolor w-[90%] flex mx-auto">
          Selected Exercises:
        </h2>
        <ul className="text-center">
          {workout.exercises.map((exercise) => {
            return (
              <ExerciseOverviewWidget
                id={exercise.exercise_id}
                key={exercise.exercise_id}
                name={exercise.name}
                gif={exercise.gif_url}
                index={1}
                exerciseId={exercise.exercise_id}
              />
            );
          })}
        </ul>
        <AddExerciseButton to="exercises" />
        <button
          onClick={() => updateWorkout()}
          className="mt-2 text-textcolor cursor-pointer mx-auto sticky bottom-2 h-16 justify-center items-center font-bold w-[90%] rounded-full bg-accent-action hover:accent active:accent flex z-30"
        >
          update workout
        </button>
      </div>
    </div>
  );
}
