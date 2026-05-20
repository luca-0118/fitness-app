import AddFoodButton from "../components/AddFoodButton.tsx";
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
              <div className="py-4 w-[90%] mx-auto flex flex-col gap-4">
              <EatenTodayList />
              <div>
                <AddFoodButton to="/food-list" />
              </div>
            </div>
          </div>
      </>
  );
}