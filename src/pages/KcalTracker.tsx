import WeightLineChart from "../components/WeightLineChart.tsx";
import AddFoodButton from "../components/AddFoodButton.tsx";
import {NutritionDonutChart} from "../components/NutritionDonutChart.tsx";
import EatenTodayList from "../components/EatenTodayList.tsx";

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

              <EatenTodayList />
            </div>
              <div className="col-span-2">
                  <AddFoodButton to="/food-list" />
              </div>
          </div>
      </>
  );
}