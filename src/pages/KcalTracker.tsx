import WeightLineChart from "../components/WeightLineChart.tsx";
import AddFoodButton from "../components/AddFoodButton.tsx";
import {NutritionDonutChart} from "../components/NutritionDonutChart.tsx";
import EatenTodayList from "../components/EatenTodayList.tsx";
import Calender from "../components/Calender.tsx";

export default function KcalTracker() {
  return (
      <>
          <div
              className="
    fixed inset-0
    top-15
    bottom-15
    z-20
    overflow-y-auto
    pt-[env(safe-area-inset-top)]
    pb-[env(safe-area-inset-bottom)]
    no-scrollbar
  "
          >
            <div className="grid grid-cols-2 gap-4 py-4 w-[90%] mx-auto">
              <div className="col-span-2 bg-components border border-bordercolor rounded-xl p-6 font-bold flex flex-col items-center">
                  <h2 className="border-b-2 border-bordercolor w-full text-center mb-4 text-lg text-textcolor">
                      Nutrition charts
                  </h2>
                  <NutritionDonutChart />
              </div>
              <div className="col-span-2">
                  <AddFoodButton to="/food-list" />
                    <Calender/>
              </div>
              <EatenTodayList />
              <div className="bg-components border border-bordercolor rounded-xl p-6 col-span-2 items-center">
                  <h2 className="border-b-2 border-bordercolor w-full text-center mb-4 font-bold text-lg text-textcolor">
                      Weight
                  </h2>
                  <WeightLineChart />
              </div>
            </div>
          </div>
      </>
  );
}