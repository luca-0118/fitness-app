import WorkoutSession from "../core/entities/workout/WorkoutSession.ts";

interface WorkoutHistoryWidgetProps {
    completedWorkout: WorkoutSession;
    onClick: () => void;
}

export default function WorkoutHistoryWidget({ completedWorkout,onClick }: WorkoutHistoryWidgetProps) {

    return (
        <div onClick={onClick} className="bg-components border-bordercolor border rounded-xl px-2 mb-3 flex w-[90%] items-center mx-auto hover:bg-components-hover active:bg-components-hover cursor-pointer">
            <div className="pl-3 pb-1">
                <div className="flex-1 text-left cursor-pointer mb-auto">
                    <h2 className="text-lg font-semibold text-textcolor">{completedWorkout.workout.name}</h2>
                </div>
                <p className="text-sm text-muted leading-tight">{`${completedWorkout.startedAt.toDMY()}`}</p>
                <p className="text-sm text-muted leading-tight">{`${completedWorkout.startedAt.toHS()} - ${completedWorkout.completedAt?.toHS()}`}</p>
            </div>
        </div>
    );
}