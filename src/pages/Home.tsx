import { useNavigate } from "react-router-dom";
import CaloriesDonutChart from "../components/CaloriesDonutChart";
import WeightLineChart from "../components/WeightLineChart.tsx";
import WeeklyCaloriesChart from "../components/WeeklyCaloriesChart.tsx"; // Make sure the path is correct

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="flex w-[90%] mx-auto pb-24">
            <div className="grid grid-cols-2 gap-4 py-4">
                <div className="col-span-2 bg-[#1E1E1E] border border-[#414141] rounded-xl p-6 font-bold flex flex-col items-center">
                    <h2 className="border-b-2 border-white w-full text-center mb-4">Calorie intake</h2>
                    <CaloriesDonutChart />
                </div>

                <button
                    onClick={() => navigate("/workouts")}
                    className="bg-[#1E1E1E] border border-[#414141] hover:bg-[#252525] rounded-xl p-6 font-bold cursor-pointer"
                >
                    Workout
                </button>

                <button
                    onClick={() => navigate("/history")}
                    className="bg-[#1E1E1E] border border-[#414141] hover:bg-[#252525] rounded-xl p-6 font-bold cursor-pointer"
                >
                    Workout history
                </button>

                <div className="bg-[#1E1E1E] border border-[#414141] rounded-xl p-6 font-bold col-span-2 flex flex-col items-center">
                    <h2 className="border-b-2 border-white w-full text-center mb-4">Weight</h2>
                    <WeightLineChart />
                </div>

                <div className="bg-[#1E1E1E] border border-[#414141] rounded-xl p-6 font-bold text-[14px] col-span-2 items-center">
                    <h2 className="border-b-2 border-white text-center mb-4">Weekly calorie intake</h2>
                    <WeeklyCaloriesChart />
                </div>
            </div>
        </div>
    );
}