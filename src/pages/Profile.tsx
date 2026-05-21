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
  const [kcal, setKcal] = useState("");
  const [carbs, setCarbs] = useState("");
  const [protein, setProtein] = useState("");
  const [fats, setFats] = useState("");
  const [isCompleted] = useState(false);
  const [sex, setSex] = useState<Sex>("male");
  const [age, setAge] = useState<number | undefined>(undefined);
  const [heightCm, setHeightCm] = useState<number | undefined>(undefined);
  const [weightKg, setWeightKg] = useState<number | undefined>(undefined);
  const [activity, setActivity] = useState<ActivityLevel>("moderate");
  const [targetWeight, setTargetWeight] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  const results = useMemo(() => {
    if (age == null || heightCm == null || weightKg == null) {
      return { bmr: 0, tdee: 0, cut: 0, maintain: 0, bulk: 0 };
    }
    const bmr = calculateBMR(sex, weightKg, heightCm, age);
    const tdee = calculateTDEE(bmr, activity);
    const goals = calculateGoals(tdee);
    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      ...goals,
    };
  }, [sex, age, heightCm, weightKg, activity]);

  //Fires when pressing the save button for your calories.
  const handleCalorieSave = () => {
    // #TODO add backend saving functionality.
    localStorage.setItem('nutrientGoals', JSON.stringify({ kcal, carbs, fats, protein }));
    setIsSaved(true);
  }

  //When editing nutrientgoals
  const onEdit = () => {
    setIsSaved(false);
  }

  // When the page is loaded, checks localstorage and sets values stored in localstorage.
  useEffect(() => {
    const nutrientGoals = localStorage.getItem("nutrientGoals");
    if (!nutrientGoals) return console.error("no nutrient goals have yet been set.");

    const { kcal, carbs, fats, protein } = JSON.parse(nutrientGoals);
    setKcal(kcal);
    setCarbs(carbs);
    setFats(fats);
    setProtein(protein);
    setIsSaved(true);

  }, []);


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
        <div className="bg-components border-bordercolor border rounded-xl w-[90%] mx-auto text-textcolor px-4 py-2">
          <h2 className="border-b border-bordercolor font-bold w-full text-start mb-3">Gegevens</h2>
          <div className="py-2 flex flex-col gap-3">
            <div>
              <label className="text-textcolor text-base block mb-1">Sex:</label>
              <select
                value={sex}
                onChange={(e) => setSex(e.target.value as Sex)}
                className="bg-components border border-bordercolor rounded-lg px-3 py-2 text-textcolor focus:outline-none focus:border-accent w-full"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <label className="text-textcolor text-base block mb-1">Age:</label>
              <input
                type="text"
                inputMode="numeric"
                value={age ?? ""}
                onChange={(e) => setAge(e.target.value === "" ? undefined : Number(e.target.value))}
                className="bg-components border border-bordercolor rounded-lg px-3 py-2 text-textcolor focus:outline-none focus:border-accent w-full"
              />
            </div>

            <div>
              <label className="text-textcolor text-base block mb-1">Height (cm):</label>
              <input
                type="text"
                inputMode="numeric"
                value={heightCm ?? ""}
                onChange={(e) => setHeightCm(e.target.value === "" ? undefined : Number(e.target.value))}
                className="bg-components border border-bordercolor rounded-lg px-3 py-2 text-textcolor focus:outline-none focus:border-accent w-full"
              />
            </div>

            <div>
              <label className="text-textcolor text-base block mb-1">Weight (kg):</label>
              <input
                type="text"
                inputMode="decimal"
                value={weightKg ?? ""}
                onChange={(e) => setWeightKg(e.target.value === "" ? undefined : Number(e.target.value))}
                className="bg-components border border-bordercolor rounded-lg px-3 py-2 text-textcolor focus:outline-none focus:border-accent w-full"
              />
            </div>

            <div>
              <label className="text-textcolor text-base block mb-1">Activity Level:</label>
              <select
                value={activity}
                onChange={(e) => setActivity(e.target.value as ActivityLevel)}
                className="bg-components border border-bordercolor rounded-lg px-3 py-2 text-textcolor focus:outline-none focus:border-accent w-full"
              >
                <option value="sedentary">Sedentary</option>
                <option value="light">Light Exercise</option>
                <option value="moderate">Moderate Exercise</option>
                <option value="very">Very Active</option>
                <option value="extreme">Athlete / Extreme</option>
              </select>
            </div>

            <div className="border-t border-bordercolor pt-3 mt-2">
              <p className="text-textcolor mb-2"><strong>BMR:</strong> {results.bmr} kcal/day</p>
              <p className="text-textcolor mb-2"><strong>Kcal:</strong> {results.tdee} kcal/day</p>
              <hr className="border-bordercolor my-2" />
              <p className="text-textcolor mb-1 text-sm"><strong>Cut:</strong> {results.cut} kcal/day</p>
              <p className="text-textcolor mb-1 text-sm"><strong>Maintain:</strong> {results.maintain} kcal/day</p>
              <p className="text-textcolor text-sm"><strong>Bulk:</strong> {results.bulk} kcal/day</p>
            </div>
          </div>
        </div>
        <div className="bg-components border-bordercolor border rounded-xl w-[90%] mx-auto text-textcolor px-4 py-2">
          <h2 className="border-b border-bordercolor font-bold w-full text-start mb-3">Target</h2>
          <div className="py-2 flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <label className="text-textcolor text-base">kcal:</label>
              <input
                type="text"
                inputMode="numeric"
                value={kcal}
                onChange={(e) => { const v = e.target.value; if (/^\d*\.?\d*$/.test(v)) setKcal(v); }}
                disabled={isCompleted}
                className="w-full bg-components border border-bordercolor rounded-lg px-3 py-2 text-textcolor focus:outline-none focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <label className="text-textcolor text-base">weight (kg):</label>
              <input
                type="text"
                inputMode="decimal"
                value={targetWeight}
                onChange={(e) => { const v = e.target.value; if (/^\d*\.?\d*$/.test(v)) setTargetWeight(v); }}
                disabled={isCompleted}
                className="w-full bg-components border border-bordercolor rounded-lg px-3 py-2 text-textcolor focus:outline-none focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <label className="text-textcolor text-base">Carbs (g):</label>
              <input
                type="text"
                inputMode="decimal"
                value={carbs}
                onChange={(e) => { const v = e.target.value; if (/^\d*\.?\d*$/.test(v)) setCarbs(v); }}
                disabled={isCompleted}
                className="w-full bg-components border border-bordercolor rounded-lg px-3 py-2 text-textcolor focus:outline-none focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <label className="text-textcolor text-base">Proteins (g):</label>
              <input
                type="text"
                inputMode="decimal"
                value={protein}
                onChange={(e) => { const v = e.target.value; if (/^\d*\.?\d*$/.test(v)) setProtein(v); }}
                disabled={isCompleted}
                className="w-full bg-components border border-bordercolor rounded-lg px-3 py-2 text-textcolor focus:outline-none focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <label className="text-textcolor text-base">Fats (g):</label>
              <input
                type="text"
                inputMode="decimal"
                value={fats}
                onChange={(e) => { const v = e.target.value; if (/^\d*\.?\d*$/.test(v)) setFats(v); }}
                disabled={isCompleted}
                className="w-full bg-components border border-bordercolor rounded-lg px-3 py-2 text-textcolor focus:outline-none focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <div className="flex justify-end">
                {!isSaved ? (
                  <button onClick={() => handleCalorieSave()} className="inline-flex items-center gap-2 bg-accent px-3 py-1 rounded-md text-white">
                    <SaveIcon sx={{ fontSize: 16 }} /> Save
                  </button>
                ) : (
                  <div className="text-sm text-textcolor">Saved — <button onClick={() => onEdit()} className="text-accent underline ml-2">Edit</button></div>
                )}
              </div>
            </div>
          </div>
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
      </div>
    </div>
  );
}