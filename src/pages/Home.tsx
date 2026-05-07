import { useNavigate } from "react-router-dom";
import { NutritionDonutChart } from "../components/NutritionDonutChart";
import WeeklyCaloriesChart from "../components/WeeklyCaloriesChart.tsx";
import {ROUTES} from "../types/consts.ts";
import PrimaryButton from "../components/ui/buttons/PrimaryButton.tsx";
import { useQuery } from "@tanstack/react-query";
import WorkoutApi from "../core/api/WorkoutApi.ts";

export default function Home() {
  const navigate = useNavigate();

  const response = useQuery({queryKey: ["random"],queryFn: WorkoutApi.list});
  if(!response.isError && !response.isLoading && response.data) {
    console.log("data..",response.data[0]);
    
  }

  return (
    <>
      <div
        className="flex w-full h-full flex-col px-4 pt-4"
      >
        <div className="grid grid-cols-2 gap-4 py-4 w-full overflow-y-scroll no-scrollbar">
          <div className="col-span-2 bg-components border border-bordercolor rounded-xl p-6 font-bold flex flex-col items-center">
            <h2 className="border-b-2 border-bordercolor w-full text-center mb-4 text-lg text-textcolor">
              Nutrition charts
            </h2>
            <NutritionDonutChart />
          </div>

          <PrimaryButton className={"w-full col-span-2"} onClick={() => {navigate(ROUTES.WORKOUT_HISTORY)}}>Workout history</PrimaryButton>

          <div className="bg-components border border-bordercolor rounded-xl p-6 col-span-2 items-center">
            <h2 className="border-b-2 border-bordercolor text-center mb-4 font-bold text-lg text-textcolor">
              Weekly calorie intake
            </h2>
            <WeeklyCaloriesChart />
          </div>
        </div>
      </div>
    </>
  );
}
