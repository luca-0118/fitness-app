import SaveIcon from "@mui/icons-material/Save";
import CheckIcon from "@mui/icons-material/Check";
import HistoryIcon from '@mui/icons-material/History';
import API from "../../../classes/api.ts";
import { useWorkout } from "../../../context/WorkoutContext.tsx";
import { useLocation, useNavigate } from "react-router-dom";
import { Toast } from "../misc/Toast.tsx";

export default function SaveButton() {
    const { workoutName, exercises } = useWorkout();
    const navigate = useNavigate();
    const location = useLocation();
    const { saveExerciseEdit } = useWorkout();

    function isCheckmark() {
        if (location.pathname === "/add-exercises") {
            return <CheckIcon sx={{ fontSize: 40 }} className="text-button-start" />;
        } else if (location.pathname === "/workouts") {
            return <HistoryIcon sx={{ fontSize: 40}} />;
        } else {
            return <SaveIcon sx={{ fontSize: 40 }} />;
        }
    }

    async function handleSave() {
        if (location.pathname === "/add-exercises") {
            saveExerciseEdit();
            Toast.success("Exercises saved!");
            navigate(-1);
            return;
        }

        if (location.pathname === "/new-workout" && !workoutName) {
            Toast.error("Workout name is required!");
            return;
        }

        if (location.pathname === "/workouts") {
            navigate("/session-history");
            return;
        }

        const workoutUuid = await Toast.promise(
            new Promise(async (resolve, reject) => {
                try {
                    const exerciseIds: Record<string, number> = Object.fromEntries(
                        exercises.map(e => [e.id, e.sets])
                    );

                    const workoutUuid = await API.workouts.create({
                        name: workoutName,
                        exercises: exerciseIds,
                    });

                    if (typeof workoutUuid !== "string") {
                        reject(workoutUuid.msg);
                        return;
                    }

                    resolve(workoutUuid);
                } catch (err) {
                    reject(err);
                }
            }),
            {
                loading: "Saving workout...",
                success: "Workout saved!",
                // @ts-ignore
                error: (err: Error) => `Error: ${err.message}`,
            }
        );

        navigate(-1);
        return workoutUuid;
    }

    return (
        <div className="relative text-textcolor">
            <button onClick={handleSave} className="cursor-pointer">
                {isCheckmark()}
            </button>
        </div>
    );
}