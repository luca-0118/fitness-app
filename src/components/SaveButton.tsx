import SaveIcon from "@mui/icons-material/Save";
import API from "../classes/api";
import { useWorkout } from "../context/WorkoutContext";
import {useNavigate} from "react-router-dom";
import { Toast } from "./Toast";

export default function SaveButton() {
    const { workoutName, exercises } = useWorkout();
    const navigate = useNavigate()

    async function handleSave() {
        return await Toast.promise(
            new Promise(async (Resolve, Reject) => {
            if (!workoutName) Reject("No name");

            const workoutUuid = await API.workouts.create(workoutName);
            console.log("workout sucessfully created!");

            for (const exercise of exercises) {
                await API.workouts.linkExercise(workoutUuid, exercise.id);
            }

            Resolve(workoutUuid);
        }),
        {
            loading: "Saving workout...",
            success: "Workout saved!",
            // @ts-ignore This is an type error made by the library itself.
            error: (err: unknown) => `Error: ${err}`,
        });
    }

    return (
        <div className="relative">
            <button onClick={handleSave} className="cursor-pointer">
                <SaveIcon sx={{ fontSize: 40 }} />
            </button>
        </div>
    );
}
