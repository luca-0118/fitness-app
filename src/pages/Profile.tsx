import ThemeButton from "../components/ThemeButton.tsx";
import WeightLineChart from "../components/WeightLineChart.tsx";

export default function Profile() {
  return (
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
          <div className="py-4 w-[90%] mx-auto flex flex-col gap-4">
            <div className="bg-components border-bordercolor border rounded-xl flex-row flex w-[90%] mx-auto text-textcolor px-4 py-2">
                <h2 className="border-b border-bordercolor font-bold w-full text-start">Gegevens</h2>
            </div>
            <div className="bg-components border-bordercolor border rounded-xl flex flex-row w-[90%] mx-auto text-textcolor px-4 py-2">
                <div className="w-full">
                    <h2 className="border-b border-bordercolor font-bold w-full">Instellingen</h2>
                    <div className="py-2">
                        <ThemeButton />
                    </div>
                </div>
            </div>
            <div className="bg-components border border-bordercolor rounded-xl p-6 col-span-2 items-center w-[90%] mx-auto">
                <h2 className="border-b-2 border-bordercolor w-full text-center mb-4 font-bold text-lg text-textcolor">
                    Weight
                </h2>
                <WeightLineChart />
            </div>
            {/*<div className="bg-components border border-bordercolor rounded-xl p-6 col-span-2 items-center">
            <h2 className="border-b-2 border-bordercolor text-center mb-4 font-bold text-lg text-textcolor">
              Weekly calorie intake
            </h2>
            <WeeklyCaloriesChart />
          </div>*/}
        </div>
    </div>
  );
}
