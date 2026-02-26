import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
      <div className="flex w-[90%] mx-auto">
        <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2 bg-[#1E1E1E] border border-[#414141] rounded-xl p-6 font-bold">
                <h2 className="border-b-2 border-white">Calorie intake:</h2>
            </div>

            <button onClick={() => navigate("/workouts")} className="bg-[#1E1E1E] border border-[#414141] hover:bg-[#252525] rounded-xl p-6 font-bold cursor-pointer">
                Workout
            </button>

            <button onClick={() => navigate("/history")} className="bg-[#1E1E1E] border border-[#414141] hover:bg-[#252525] rounded-xl p-6 font-bold cursor-pointer">
                Workout history
            </button>

            <div className="bg-[#1E1E1E] border border-[#414141] rounded-xl p-6 font-bold col-span-2">
                <h2 className="border-b-2 border-white">Weight</h2>
            </div>

            <div className="bg-[#1E1E1E] border border-[#414141] rounded-xl p-6 font-bold text-[14px] col-span-2">
                <h2 className="border-b-2 border-white">Weekly calorie intake</h2>
            </div>
        </div>
    </div>
  );
}
