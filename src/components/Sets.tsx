import { useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';

interface SetsProps {
    setNumber?: number;
    onDelete?: () => void;
}

export default function Sets({ setNumber = 1, onDelete }: SetsProps) {
    const [reps, setReps] = useState("0");
    const [weight, setWeight] = useState("0.0");
    const repsOptions = Array.from({ length: 51 }, (_, i) => i);

    return (
        <div className="border-t border-[#565d5d] pt-4 mt-3">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-lg font-semibold">Set {setNumber}</h3>
                {onDelete && setNumber > 3 && (
                    <button
                        onClick={onDelete}
                        className="text-red-500 hover:text-red-400 active:text-red-400 cursor-pointer transition-colors"
                        title="Delete set"
                    >
                        <DeleteIcon sx={{ fontSize: 24 }} />
                    </button>
                )}
            </div>

            <div className="flex items-center justify-between mb-3">
                <label className="text-white text-base">Reps:</label>
                <select
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    className="w-32 bg-[#2e2e2e] border border-[#565d5d] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F67631] cursor-pointer"
                >
                    {repsOptions.map((value) => (
                        <option key={value} value={value}>
                            {value}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex items-center justify-between">
                <label className="text-white text-base">Weight (kg):</label>
                <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-32 bg-[#2e2e2e] border border-[#565d5d] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F67631]"
                    placeholder="0.0"
                />
            </div>
        </div>
    );
}