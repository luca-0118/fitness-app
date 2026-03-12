import SaveIcon from "@mui/icons-material/Save";
import API from "../classes/api";
import { useWorkout } from "../context/WorkoutContext";
import {useNavigate} from "react-router-dom";

export default function SaveButton() {
    const { workoutName, exercises } = useWorkout();
    const navigate = useNavigate()

    async function handleSave() {
        const workoutUuid = await API.workouts.create(workoutName);
        console.log("workout sucessfully created!");

        exercises.forEach(async (exercise) => {
            const resp = await API.workouts.linkExercise(workoutUuid, exercise.id);
            console.log(resp);
        });
        navigate(-1)
    }

    return (
        <div className="relative">
            <button onClick={handleSave} className="cursor-pointer">
                <SaveIcon sx={{ fontSize: 40 }} />
            </button>
        </div>
    );
}
