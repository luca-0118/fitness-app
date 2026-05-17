import React, { useState } from "react";
import CalorieGoalInput from "../components/settings/CalorieGoalInput.tsx";
import ThemeButton from "../components/ThemeButton.tsx";

export default function Profile() {
    const [calorieGoal,setCalorieGoal] = useState<number>(3000);
    const onCalUpate = (e: React.InputEvent) => {
        setCalorieGoal(Number(e.currentTarget.nodeValue) ?? 10);
    }
    const onCalSave = async () => {
        const response = new Promise<boolean>((res) => {
            setTimeout(() => {
                console.log("saved");
                res(true);
            },3000);

        });

        return response;
    }



  return (
    <>
        <div className="bg-components border-bordercolor border rounded-xl py-4 px-6 mb-3 flex-row w-[90%] mx-auto mt-2 text-textcolor">
            <h2 className="border-b border-bordercolor font-bold w-full py-2">Gegevens</h2>
        </div>
        <div className="bg-components border-bordercolor border rounded-xl py-4 px-6 mb-3 flex-row w-[90%] mx-auto text-textcolor">
            <h2 className="border-b border-bordercolor font-bold w-full py-2">Instellingen</h2>
            <div className="flex flex-col gap-4 pt-2">
                <ThemeButton />
                <CalorieGoalInput defaultValue={calorieGoal} onValueUpdate={onCalUpate} SaveFunction={onCalSave}/>
            </div>
        </div>
    </>
  );
}
