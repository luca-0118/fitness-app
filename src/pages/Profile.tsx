import { useState, useMemo, useEffect } from "react";
import ThemeButton from "../components/ThemeButton.tsx";
import SaveIcon from "@mui/icons-material/Save";
import WeightLineChart from "../components/WeightLineChart.tsx";

type Sex = "male" | "female";
type ActivityLevel = "sedentary" | "light" | "moderate" | "very" | "extreme";

const activityMultipliers: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very: 1.725,
  extreme: 1.9,
};

function calculateBMR(
  sex: Sex,
  weightKg: number,
  heightCm: number,
  age: number
) {
  if (sex === "male") {
    return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  }
  return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
}

function calculateTDEE(bmr: number, activityLevel: ActivityLevel) {
  return bmr * activityMultipliers[activityLevel];
}

function calculateGoals(tdee: number) {
  return {
    cut: Math.round(tdee * 0.8),
    maintain: Math.round(tdee),
    bulk: Math.round(tdee * 1.1),
  };
}

export default function Profile() {
    return (
        <>
            <div className="bg-components border-bordercolor border rounded-xl py-4 px-6 mb-3 flex-row w-[90%] mx-auto mt-2 text-textcolor">
                <h2 className="border-b border-bordercolor font-bold w-full py-2">Gegevens</h2>
            </div>
            <div className="bg-components border-bordercolor border rounded-xl py-4 px-6 mb-3 flex-row w-[90%] mx-auto text-textcolor">
                <h2 className="border-b border-bordercolor font-bold w-full py-2">Instellingen</h2>
                <div className="grid grid-cols-2 gap-4 pt-2">
                    <ThemeButton />
                </div>
            </div>
        </>
    );
}
