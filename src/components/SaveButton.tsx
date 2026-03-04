import SaveIcon from "@mui/icons-material/Save";
import { useWorkout } from "../Context/WorkoutContext";
import {invoke} from "@tauri-apps/api/core";

export default function SaveButton() {
    const { workoutName, exercises, clearWorkout } = useWorkout();

    const handleSave = async () => {
        if (!workoutName.trim()) {
            alert("Workout name is required");
            return;
        }

        try {
            const response = await invoke("create_workout", {
                workout: { name: workoutName, exercises },
            });
            alert(response);
            clearWorkout();
        } catch (error) {
            console.error(error);
            alert("Failed to save workout");
        }
    };

    return (
        <button onClick={handleSave} className="cursor-pointer">
            <SaveIcon sx={{ fontSize: 40 }} />
        </button>
    );
}