import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

interface WorkoutHistoryWidgetProps {
    workout: IworkoutHistory;
}

export default function WorkoutHistoryWidget({ workout }: WorkoutHistoryWidgetProps) {

    return (
        <div className="bg-[#1E1E1E] border-[#414141] border rounded-xl px-2 mb-3 flex w-[90%] items-center mx-auto hover:bg-[#252525] active:bg-[#252525] cursor-pointer">
            <button className="cursor-pointer">
                <DragIndicatorIcon sx={{ fontSize: 40, color: "#F67631"}}/>
            </button>
            <div className="pb-1">
                <div className="flex-1 text-left cursor-pointer mb-auto">
                    <h2 className="text-lg font-semibold">{workout.workoutName}</h2>
                </div>
                <p className="text-sm text-[#696969] leading-tight">{`${workout.startDate.getDay()}-${workout.startDate.getMonth()}-${workout.startDate.getFullYear()}`}</p>
                <p className="text-sm text-[#696969] leading-tight">{`${workout.startDate.getHours()}:${workout.startDate.getMinutes()} - ${workout.endDate.getHours()}:${workout.endDate.getMinutes()}`}</p>
            </div>
        </div>
    );
}