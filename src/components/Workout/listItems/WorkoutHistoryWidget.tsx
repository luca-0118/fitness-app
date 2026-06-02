interface WorkoutHistoryWidgetProps {
    workout: IworkoutHistory;
}

export default function WorkoutHistoryWidget({ workout }: WorkoutHistoryWidgetProps) {

    return (
        <div className="bg-components border-bordercolor border rounded-xl px-2 mb-3 flex w-[90%] items-center mx-auto hover:bg-components-hover active:bg-components-hover cursor-pointer">
            <div className="pl-3 pb-1">
                <div className="flex-1 text-left cursor-pointer mb-auto">
                    <h2 className="text-lg font-semibold text-textcolor">{workout.workoutName}</h2>
                </div>
                <p className="text-sm text-muted leading-tight">{`${workout.startDate.getDate()}-${workout.startDate.getMonth()}-${workout.startDate.getFullYear()}`}</p>
                <p className="text-sm text-muted leading-tight">{`${workout.startDate.getHours()}:${workout.startDate.getMinutes()} - ${workout.endDate.getHours()}:${workout.endDate.getMinutes()}`}</p>
            </div>
        </div>
    );
}