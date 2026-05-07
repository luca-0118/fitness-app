import {useParams} from "react-router-dom";
import useCompletedWorkout from "../../Hooks/useCompletedWorkout.ts";
import PageContainer from "../../components/ui/PageContainer.tsx";
import {DbDate} from "../../classes/dbDate.ts";
import CompletedExercise from "../../components/listItems/CompletedExercise.tsx";

export default function DetailedWorkoutHistoryPage() {
    const params = useParams();
    const id = params.id ?? "";

    const completedWorkout = useCompletedWorkout(id);



    // TODO add loading skeleton
    if (completedWorkout.isLoading || completedWorkout.isError || !completedWorkout.data) return <h1>Loading</h1> //TODO add loading skeleton.


    const {seconds,minutes,hours} = DbDate.TimeDifference(completedWorkout.data.startedAt,completedWorkout.data.completedAt || new DbDate());

    return <PageContainer>
        <section id={"detailed-workout-banner"} className={"w-full flex flex-col py-4 bg-components justify-center items-center rounded"}>
            <h1 className={"text-4xl text-accent"}>{completedWorkout.data.workout.name}</h1>
            <p className={"text-textcolor"}>{completedWorkout.data.startedAt.toDMY()}</p>
            <div className={"text-textcolor flex flex-row gap-2"}>
                <p>{completedWorkout.data.startedAt.toHS()}-{completedWorkout.data.completedAt?.toHS()}</p>
                <p className={"text-textcolor opacity-65"}>( {hours}h {minutes}m {seconds}s )</p>
            </div>
        </section>
        <section id={"completed-exercises"} className={"flex flex-col gap-2"}>
            {completedWorkout.data.exercises?.map((cExercise,idx) => <CompletedExercise key={cExercise.exercise.exercise_id+String(idx)} completedExercise={cExercise}/>)}
        </section>
    </PageContainer>
}