import { useNavigate } from "react-router-dom";
import { NutritionDonutChart } from "../../components/General/charts/NutritionDonutChart.tsx";
//import WeeklyCaloriesChart from "../components/WeeklyCaloriesChart.tsx";

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <div
        className="
    w-full
    h-full
    z-20
    overflow-y-auto
    pt-[env(safe-area-inset-top)]
    pb-[env(safe-area-inset-bottom)]
    no-scrollbar
  "
      >
        <div className="grid grid-cols-2 gap-4 py-4 w-[90%] mx-auto">
          <div className="col-span-2 bg-components border border-bordercolor rounded-xl px-6 font-bold flex flex-col items-center">
            <NutritionDonutChart />
          </div>

          <button
            onClick={() => navigate("/food-list")}
            className="bg-accent hover:bg-accent-action active:bg-accent-action rounded-full p-6 font-bold cursor-pointer col-span-1 text-textcolor"
          >
            Add product
          </button>

          <button
              onClick={() => navigate("/workouts")}
              className="bg-accent hover:bg-accent-action active:bg-accent-action rounded-full p-6 font-bold cursor-pointer col-span-1 text-textcolor"
          >
            Start workout
          </button>
        </div>
      </div>
    </>
  );
}
