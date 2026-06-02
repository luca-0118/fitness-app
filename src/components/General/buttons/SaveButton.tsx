import SaveIcon from "@mui/icons-material/Save";
import API from "../../../classes/api.ts";
import { useWorkout } from "../../../context/WorkoutContext.tsx";
import {useNavigate} from "react-router-dom";
import { Toast } from "../misc/Toast.tsx";

export default function SaveButton() {
    const { workoutName, exercises } = useWorkout();
    const navigate = useNavigate()

    async function handleSave() {
        const workoutUuid = await Toast.promise(
            new Promise(async (Resolve, Reject) => {
                if (!workoutName) Reject("No name");

                const exerciseIds = exercises.map(e => e.id);

                const workoutUuid = await API.workouts.create({name: workoutName, exercises: exerciseIds });
                if (typeof workoutUuid !== "string") Reject(workoutUuid.msg);
                console.log(workoutUuid);
                console.log("workout sucessfully created!");

                // for (const exercise of exercises) {
                //     await API.workouts.linkExercise(workoutUuid, exercise.id);
                // }

                Resolve(workoutUuid);
            }),
            {
                loading: "Saving workout...",
                success: "Workout saved!",
                // @ts-ignore This is an type error made by the library itself.
                error: (err: unknown) => `Error: ${err}`,
            }
        );
        navigate(-1);
        return workoutUuid;
    }

    return (
        <div className="relative text-textcolor">
            <button onClick={handleSave} className="cursor-pointer">
                <SaveIcon sx={{ fontSize: 40 }} />
            </button>
        </div>
    );
}
