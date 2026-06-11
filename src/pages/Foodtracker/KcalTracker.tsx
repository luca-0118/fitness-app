import AddFoodButton from "../../components/Workout/buttons/AddFoodButton.tsx";
import EatenTodayList from "../../components/Foodtracker/listItems/EatenTodayList.tsx";

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
                <div className="col-span-2 w-80 mx-auto">
                    <AddFoodButton to="/food-page" />
                </div>
            </div>
        </>
    );
}