import { useState, useMemo } from "react";

type gender = "male" | "female";
type ActivityLevel = "sedentary" | "light" | "moderate" | "very" | "extreme";

const activityMultipliers: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very: 1.725,
  extreme: 1.9,
};

function calculateBMR(
  sex: gender,
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

export default function KcalBerekenen() {
  const [sex, setSex] = useState<gender>("male");
  const [age, setAge] = useState<number | undefined>(undefined);
  const [heightCm, setHeightCm] = useState<number | undefined>(undefined);
  const [weightKg, setWeightKg] = useState<number | undefined>(undefined);
  const [activity, setActivity] = useState<ActivityLevel>("moderate");

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

  return (
    <div className="bg-components border-bordercolor border rounded-xl w-[90%] mx-auto text-textcolor px-4 py-2">
      <h2 className="border-b border-bordercolor font-bold w-full text-start mb-3">Gegevens</h2>
      <div className="py-2 flex flex-col gap-3">
        <div>
          <label className="text-textcolor text-base block mb-1">Sex:</label>
          <select
            value={sex}
            onChange={(e) => setSex(e.target.value as gender)}
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
  );
}