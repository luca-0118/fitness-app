import { useNavigate } from "react-router-dom";
import {NutritionDonutChart} from "../components/NutritionDonutChart";
import WeightLineChart from "../components/WeightLineChart.tsx";
import WeeklyCaloriesChart from "../components/WeeklyCaloriesChart.tsx";
import Header from "../components/Header.tsx";

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="flex w-screen pb-24">
            <div className="grid grid-cols-2 gap-4 py-4 w-[90%] mx-auto">
                <div className="col-span-2 bg-[#1E1E1E] border border-[#414141] rounded-xl p-6 font-bold flex flex-col items-center">
                    <h2 className="border-b-2 border-white w-full text-center mb-4 text-lg">Nutrition charts</h2>
                        <NutritionDonutChart />
                </div>

                <button
                    onClick={() => navigate("/history")}
                    className="bg-[#1E1E1E] border border-[#414141] hover:bg-[#252525] rounded-xl p-6 font-bold cursor-pointer col-span-2"
                >
                    Workout history
                </button>

                <div className="bg-[#1E1E1E] border border-[#414141] rounded-xl p-6 col-span-2 items-center">
                    <h2 className="border-b-2 border-white w-full text-center mb-4 font-bold text-lg">Weight</h2>
                    <WeightLineChart />
                </div>

                <div className="bg-[#1E1E1E] border border-[#414141] rounded-xl p-6 col-span-2 items-center">
                    <h2 className="border-b-2 border-white text-center mb-4 font-bold text-lg">Weekly calorie intake</h2>
                    <WeeklyCaloriesChart />
                </div>
            </div>
        </div>
    );
}