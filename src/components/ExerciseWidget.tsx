interface ExerciseWidgetProps {
    name: string;
    onSelect?: () => void;
}

export default function ExerciseWidget({ name, onSelect }: ExerciseWidgetProps) {
    return (
        <div
            className="border p-4 my-2 bg-[#1E1E1E] border-[#414141] rounded-xl hover:bg-[#252525] font-bold"
            onClick={onSelect}
        >
            <h2 className="text-lg font-semibold">{name}</h2>
        </div>
    );
}