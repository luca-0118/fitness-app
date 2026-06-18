import { useState, useEffect } from "react";
import ThemeButton from "../../components/General/buttons/ThemeButton.tsx";
import SaveIcon from "@mui/icons-material/Save";
import WeightLineChart from "../../components/General/charts/WeightLineChart.tsx";
import KcalBerekenen from "../../components/Foodtracker/misc/KcalBerekenen.tsx";

const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export default function Profile() {
  const [kcal, setKcal] = useState("");
  const [carbs, setCarbs] = useState("");
  const [protein, setProtein] = useState("");
  const [fats, setFats] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [carbsMode, setCarbsMode] = useState("g");
  const [proteinMode, setProteinMode] = useState("g");
  const [fatsMode, setFatsMode] = useState("g");
  const [carbsPercentage, setCarbsPercentage] = useState(50);
  const [proteinPercentage, setProteinPercentage] = useState(25);
  const [fatsPercentage, setFatsPercentage] = useState(25);
  const [showMacroPercentages, setShowMacroPercentages] = useState(false);
  const [currentWeight, setCurrentWeight] = useState("");
  const [weightEntries, setWeightEntries] = useState<Array<{ weight: number; date: string }>>([]);

  //Fires when pressing the save button for your calories.
  const handleCalorieSave = () => {
    if (!kcal) {
      alert("Please enter a kcal target");
      return;
    }

    let finalCarbs = "";
    let finalProtein = "";
    let finalFats = "";

    const kcalValue = Number(kcal);

    // Handle Carbs
    if (carbs) {
      if (carbsMode === "%") {
        finalCarbs = String(Math.round((kcalValue * (Number(carbs) / 100)) / 4));
      } else {
        finalCarbs = carbs;
      }
    } else {
      finalCarbs = String(Math.round((kcalValue * (carbsPercentage / 100)) / 4));
    }

    // Handle Protein
    if (protein) {
      if (proteinMode === "%") {
        finalProtein = String(Math.round((kcalValue * (Number(protein) / 100)) / 4));
      } else {
        finalProtein = protein;
      }
    } else {
      finalProtein = String(Math.round((kcalValue * (proteinPercentage / 100)) / 4));
    }

    // Handle Fats
    if (fats) {
      if (fatsMode === "%") {
        finalFats = String(Math.round((kcalValue * (Number(fats) / 100)) / 9));
      } else {
        finalFats = fats;
      }
    } else {
      finalFats = String(Math.round((kcalValue * (fatsPercentage / 100)) / 9));
    }

    // #TODO add backend saving functionality.
    localStorage.setItem('nutrientGoals', JSON.stringify({ kcal, carbs: finalCarbs, fats: finalFats, protein: finalProtein }));
    setCarbs(finalCarbs);
    setProtein(finalProtein);
    setFats(finalFats);
    setIsSaved(true);
  }

  //When editing nutrientgoals
  const onEdit = () => {
    setIsSaved(false);
  }

  //Save macro percentages
  const handleMacroPercentagesSave = () => {
    const total = carbsPercentage + proteinPercentage + fatsPercentage;
    if (total !== 100) {
      alert(`Percentages must add up to 100%. Current total: ${total}%`);
      return;
    }
    localStorage.setItem('macroPercentages', JSON.stringify({ carbs: carbsPercentage, protein: proteinPercentage, fats: fatsPercentage }));
    setShowMacroPercentages(false);
  }

  //Add weight entry
  const handleAddWeightEntry = () => {
    if (!currentWeight) {
      alert("Please enter weight");
      return;
    }
    const todayDate = getTodayDate();
    const newEntries = [...weightEntries, { weight: Number(currentWeight), date: todayDate }];
    setWeightEntries(newEntries);
    localStorage.setItem('weightEntries', JSON.stringify(newEntries));
    setCurrentWeight("");
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

    const macroPercentages = localStorage.getItem("macroPercentages");
    if (macroPercentages) {
      const { carbs: carbsPerc, protein: proteinPerc, fats: fatsPerc } = JSON.parse(macroPercentages);
      setCarbsPercentage(carbsPerc);
      setProteinPercentage(proteinPerc);
      setFatsPercentage(fatsPerc);
    }

    const weightData = localStorage.getItem("weightEntries");
    if (weightData) {
      setWeightEntries(JSON.parse(weightData));
    }

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
        <KcalBerekenen />
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
                disabled={isSaved}
                className="w-full bg-components border border-bordercolor rounded-lg px-3 py-2 text-textcolor focus:outline-none focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <label className="text-textcolor text-base">Carbs:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  inputMode="decimal"
                  value={carbs}
                  onChange={(e) => { const v = e.target.value; if (/^\d*\.?\d*$/.test(v)) setCarbs(v); }}
                  disabled={isSaved}
                  placeholder="Optional"
                  className="flex-1 bg-components border border-bordercolor rounded-lg px-3 py-2 text-textcolor focus:outline-none focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <select
                  value={carbsMode}
                  onChange={(e) => setCarbsMode(e.target.value)}
                  disabled={isSaved}
                  className="bg-components border border-bordercolor rounded-lg px-3 py-2 text-textcolor focus:outline-none focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="g">g</option>
                  <option value="%">%</option>
                </select>
              </div>
              <label className="text-textcolor text-base">Proteins:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  inputMode="decimal"
                  value={protein}
                  onChange={(e) => { const v = e.target.value; if (/^\d*\.?\d*$/.test(v)) setProtein(v); }}
                  disabled={isSaved}
                  placeholder="Optional"
                  className="flex-1 bg-components border border-bordercolor rounded-lg px-3 py-2 text-textcolor focus:outline-none focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <select
                  value={proteinMode}
                  onChange={(e) => setProteinMode(e.target.value)}
                  disabled={isSaved}
                  className="bg-components border border-bordercolor rounded-lg px-3 py-2 text-textcolor focus:outline-none focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="g">g</option>
                  <option value="%">%</option>
                </select>
              </div>
              <label className="text-textcolor text-base">Fats:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  inputMode="decimal"
                  value={fats}
                  onChange={(e) => { const v = e.target.value; if (/^\d*\.?\d*$/.test(v)) setFats(v); }}
                  disabled={isSaved}
                  placeholder="Optional"
                  className="flex-1 bg-components border border-bordercolor rounded-lg px-3 py-2 text-textcolor focus:outline-none focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <select
                  value={fatsMode}
                  onChange={(e) => setFatsMode(e.target.value)}
                  disabled={isSaved}
                  className="bg-components border border-bordercolor rounded-lg px-3 py-2 text-textcolor focus:outline-none focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="g">g</option>
                  <option value="%">%</option>
                </select>
              </div>
              <label className="text-textcolor text-base">weight (kg):</label>
              <input
                type="text"
                inputMode="decimal"
                value={targetWeight}
                onChange={(e) => { const v = e.target.value; if (/^\d*\.?\d*$/.test(v)) setTargetWeight(v); }}
                disabled={isSaved}
                className="w-full bg-components border border-bordercolor rounded-lg px-3 py-2 text-textcolor focus:outline-none focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed"
              />
              
              <div className="flex justify-end">
                {!isSaved ? (
                  <button onClick={() => handleCalorieSave()} className="inline-flex items-center gap-2 bg-accent px-3 py-1 rounded-md text-white">
                    <SaveIcon sx={{ fontSize: 16 }} /> Save
                  </button>
                ) : (
                  <div className="text-sm text-textcolor"><button onClick={() => onEdit()} className="text-accent underline">Edit</button></div>
                )}
              </div>
            </div>
          </div>
        </div>
        {showMacroPercentages && (
          <div className="bg-components border-bordercolor border rounded-xl w-[90%] mx-auto text-textcolor px-4 py-2">
            <h2 className="border-b border-bordercolor font-bold w-full text-start mb-3">Your Nutrition Targets</h2>
            <div className="py-2 flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <label className="text-textcolor text-base">Carbs (%):</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={carbsPercentage}
                  onChange={(e) => { const v = e.target.value; if (/^\d*$/.test(v)) setCarbsPercentage(Number(v) || 0); }}
                  className="w-full bg-components border border-bordercolor rounded-lg px-3 py-2 text-textcolor focus:outline-none focus:border-accent"
                />
                <label className="text-textcolor text-base">Proteins (%):</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={proteinPercentage}
                  onChange={(e) => { const v = e.target.value; if (/^\d*$/.test(v)) setProteinPercentage(Number(v) || 0); }}
                  className="w-full bg-components border border-bordercolor rounded-lg px-3 py-2 text-textcolor focus:outline-none focus:border-accent"
                />
                <label className="text-textcolor text-base">Fats (%):</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={fatsPercentage}
                  onChange={(e) => { const v = e.target.value; if (/^\d*$/.test(v)) setFatsPercentage(Number(v) || 0); }}
                  className="w-full bg-components border border-bordercolor rounded-lg px-3 py-2 text-textcolor focus:outline-none focus:border-accent"
                />
                <p className="text-sm text-textcolor mt-2">Total: {carbsPercentage + proteinPercentage + fatsPercentage}%</p>
                <div className="flex justify-end gap-2 mt-3">
                  <button onClick={() => setShowMacroPercentages(false)} className="px-3 py-1 rounded-md border border-bordercolor text-textcolor hover:bg-components transition-colors">
                    Cancel
                  </button>
                  <button onClick={() => handleMacroPercentagesSave()} className="inline-flex items-center gap-2 bg-accent px-3 py-1 rounded-md text-white">
                    <SaveIcon sx={{ fontSize: 16 }} /> Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="bg-components border-bordercolor border rounded-xl flex flex-row w-[90%] mx-auto text-textcolor px-4 py-2">
          <div className="w-full">
            <h2 className="border-b border-bordercolor font-bold w-full">Instellingen</h2>
            <div className="py-2">
              <ThemeButton />
            </div>
          </div>
        </div>
        {<div className="bg-components border border-bordercolor rounded-xl p-6 col-span-2 items-center w-[90%] mx-auto">
          <h2 className="border-b-2 border-bordercolor w-full text-center mb-4 font-bold text-lg text-textcolor">
            Weight
          </h2>
          <WeightLineChart targetWeight={targetWeight} weightData={weightEntries.map(e => e.weight)} dates={weightEntries.map(e => e.date)} />
          <div className="mt-4 flex flex-col gap-3">
            <div className="flex gap-2">
              <input
                type="text"
                inputMode="decimal"
                value={currentWeight}
                onChange={(e) => { const v = e.target.value; if (/^\d*\.?\d*$/.test(v)) setCurrentWeight(v); }}
                placeholder="Weight (kg)"
                className="flex-1 bg-components border border-bordercolor rounded-lg px-3 py-2 text-textcolor focus:outline-none focus:border-accent"
              />
              <button
                onClick={handleAddWeightEntry}
                className="bg-accent px-4 py-2 rounded-md text-white font-semibold hover:bg-accent-action transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>}
      </div>
    </div>
  );
}
