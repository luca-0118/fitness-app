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

    const startDate = new DbDate(completedWorkout.data.start_date);
    const endDate = new DbDate(completedWorkout.data.end_date);
    const {seconds,minutes,hours} = DbDate.TimeDifference(startDate,endDate);
    console.log(endDate);

    return <PageContainer>
        <section id={"detailed-workout-banner"} className={"w-full flex flex-col py-4 bg-components justify-center items-center rounded"}>
            <h1 className={"text-4xl text-accent"}>{completedWorkout.data.workout_name}</h1>
            <p className={"text-textcolor"}>{startDate.toDMY()}</p>
            <p className={"text-textcolor"}>{startDate.toHS()}-{endDate.toHS()} ({hours}h {minutes}m {seconds}s  )</p>
        </section>
        <section id={"completed-exercises"} className={"flex flex-col gap-2"}>
            {completedWorkout.data.exercises.map((exercise,idx) => <CompletedExercise key={exercise.exercise_id+String(idx)} exercise={exercise}/>)}
        </section>
    </PageContainer>
}