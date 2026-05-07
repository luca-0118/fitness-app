import WorkoutHistoryWidget from "../../components/WorkoutHistoryWidget.tsx";
import useWorkoutHistory from "../../Hooks/queries/useWorkoutHistory.ts";
import {useNavigate} from "react-router-dom";
import {ROUTES} from "../../types/consts.ts";

export default function WorkoutHistoryPage() {
    const history = useWorkoutHistory();
    const navigate = useNavigate();
    const handleNavigate = (id:string) => {
        navigate(`${ROUTES.WORKOUT_HISTORY}/${id}`);
    }

    if (history.isError || history.isLoading || !history.data) return;



    return (
        <>
            <div className={"flex w-full h-full flex-col p-4 overflow-y-scroll no-scrollbar"}>
                <div className="pt-2">
                    {history.data.map((completedWorkout,idx) => (
                        <WorkoutHistoryWidget key={idx} completedWorkout={completedWorkout} onClick={() => handleNavigate(completedWorkout.sessionUuid)} />
                    ))}
                </div>
            </div>
        </>
    );
}
