import { useState } from "react";

interface SetsProps {
    setNumber?: number;
}

export default function Sets({ setNumber = 1 }: SetsProps) {
    const [reps, setReps] = useState("");
    const [weight, setWeight] = useState("");

    return (
        <div className="w-87 bg-[#1E1E1E] border-2 border-[#565d5d] rounded-xl p-4 mb-4">
            <h3 className="text-white text-lg font-semibold mb-4">Set {setNumber}</h3>
            
            <div className="flex items-center justify-between mb-3">
                <label className="text-white text-base">Reps:</label>
                <input 
                    type="number"
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    className="w-32 bg-[#2e2e2e] border border-[#565d5d] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F67631]"
                    placeholder="0"
                />
            </div>
            
            <div className="flex items-center justify-between">
                <label className="text-white text-base">Weight:</label>
                <input 
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-32 bg-[#2e2e2e] border border-[#565d5d] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F67631]"
                    placeholder="0"
                />
            </div>
        </div>
    );
}