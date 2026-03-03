import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

interface WorkoutHistoryWidgetProps {
    name: string;
}

export default function WorkoutHistoryWidget({ name }: WorkoutHistoryWidgetProps) {

    return (
        <div className="bg-[#1E1E1E] border-[#414141] border rounded-xl px-2 mb-3 flex w-[90%] items-center mx-auto hover:bg-[#252525] cursor-pointer">
            <button className="cursor-pointer">
                <DragIndicatorIcon sx={{ fontSize: 40, color: "#F67631"}}/>
            </button>
            <div className="pb-1">
                <div className="flex-1 text-left cursor-pointer mb-auto">
                    <h2 className="text-lg font-semibold">{name}</h2>
                </div>
                <p className="text-sm text-[#696969] leading-tight">27-02-2026</p>
                <p className="text-sm text-[#696969] leading-tight">10:00-11:00</p>
            </div>
        </div>
    );
}