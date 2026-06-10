import SaveIcon from "@mui/icons-material/Save";
import API from "../../../classes/api.ts";
import { useWorkout } from "../../../context/WorkoutContext.tsx";
import { useLocation, useNavigate } from "react-router-dom";
import { Toast } from "../misc/Toast.tsx";

interface SaveButtonProps {
    onSave?: () => void;
}

export default function SaveButton({onSave,}: SaveButtonProps) {
    const { workoutName, exercises } = useWorkout();

    const navigate = useNavigate();
    const location = useLocation();

    async function handleSave() {
        if (location.pathname === "/add-exercises") {
            onSave?.();

            Toast.success("Exercises saved!");

            navigate(-1);

            return;
        }

        if (
            location.pathname === "/new-workout" &&
            !workoutName
        ) {
            Toast.error(
                "Workout name is required!"
            );

            return;
        }

        const workoutUuid = await Toast.promise(
            new Promise(async (resolve, reject) => {
                try {
                    const exerciseIds = exercises.map(
                        e => e.id
                    );

                    const workoutUuid =
                        await API.workouts.create({
                            name: workoutName,
                            exercises: exerciseIds,
                        });

                    if (
                        typeof workoutUuid !== "string"
                    ) {
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
                error: err => `Error: ${err}`,
            }
        );

        navigate(-1);

        return workoutUuid;
    }

    return (
        <div className="relative text-textcolor">
            <button
                onClick={handleSave}
                className="cursor-pointer"
            >
                <SaveIcon sx={{ fontSize: 40 }} />
            </button>
        </div>
    );
}