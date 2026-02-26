import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
  <div className="grid grid-cols-2 gap-4 mx-4 h-screen">
      <div className="col-span-2 bg-[#1E1E1E] border border-[#414141] rounded-xl p-6 font-bold">
        <p className="border-b-2 border-white">Calorie intake:</p>
      </div>

      <button onClick={() => navigate("/workouts")} className="bg-[#1E1E1E] border border-[#414141] hover:bg-[#252525] rounded-xl p-6 font-bold">
        Workout
      </button>

      <button onClick={() => navigate("/history")} className="bg-[#1E1E1E] border border-[#414141] hover:bg-[#252525] rounded-xl p-6 font-bold">
        Workout history
      </button>

      <div className="bg-[#1E1E1E] border border-[#414141] rounded-xl p-6 font-bold col-span-2">
        <p className="border-b-2 border-white">Weight</p>
      </div>

      <div className="bg-[#1E1E1E] border border-[#414141] rounded-xl p-6 font-bold text-[14px] col-span-2">
        <p className="border-b-2 border-white">Weekly calorie intake</p>
      </div>
    </div>
  );
}
