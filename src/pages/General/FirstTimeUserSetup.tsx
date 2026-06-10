import { useState } from "react";
import { useNavigate } from "react-router-dom";
import KcalBerekenen from "../../components/Foodtracker/misc/KcalBerekenen.tsx";
import SaveIcon from "@mui/icons-material/Save";

export default function FirstTimeUserSetup() {
  const [kcal, setKcal] = useState("");
  const [carbs, setCarbs] = useState("");
  const [protein, setProtein] = useState("");
  const [fats, setFats] = useState("");
  const navigate = useNavigate();

  const handleSave = () => {
    if (!kcal) {
      alert("Please enter a kcal target");
      return;
    }

    console.log("Saving nutrition goals:", { kcal, carbs, fats, protein });
    localStorage.setItem('nutrientGoals', JSON.stringify({ kcal, carbs, fats, protein }));
    localStorage.setItem('firstTimeUserCompleted', 'true');
    console.log("Setup completed. Navigating to home...");
    navigate('/');
  };

  const handleSkip = () => {
    localStorage.setItem('firstTimeUserCompleted', 'true');
    navigate('/');
  };

  return (
    <div className="w-full h-full bg-background overflow-y-auto no-scrollbar pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      <div className="py-8 w-[90%] mx-auto flex flex-col gap-6 max-w-3xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-textcolor mb-2">Welcome to Fitness App!</h1>
          <p className="text-textcolor text-lg">
            Let's set up your nutrition targets. Calculate your TDEE (Total Daily Energy Expenditure) by filling in your details below.
          </p>
        </div>

        <div>
          <KcalBerekenen />
        </div>

        <div className="bg-components border-bordercolor border rounded-xl w-full text-textcolor px-4 py-2">
          <h2 className="border-b border-bordercolor font-bold w-full text-start mb-3 text-2xl">Your Nutrition Targets</h2>
          <div className="py-2 flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <label className="text-textcolor text-base font-semibold">kcal:</label>
              <input
                type="text"
                inputMode="numeric"
                value={kcal}
                onChange={(e) => { const v = e.target.value; if (/^\d*\.?\d*$/.test(v)) setKcal(v); }}
                placeholder="Enter your daily kcal target"
                className="w-full bg-components border border-bordercolor rounded-lg px-3 py-2 text-textcolor focus:outline-none focus:border-accent"
              />
              <label className="text-textcolor text-base font-semibold mt-4">Carbs (g):</label>
              <input
                type="text"
                inputMode="decimal"
                value={carbs}
                onChange={(e) => { const v = e.target.value; if (/^\d*\.?\d*$/.test(v)) setCarbs(v); }}
                placeholder="Optional"
                className="w-full bg-components border border-bordercolor rounded-lg px-3 py-2 text-textcolor focus:outline-none focus:border-accent"
              />
              <label className="text-textcolor text-base font-semibold mt-4">Proteins (g):</label>
              <input
                type="text"
                inputMode="decimal"
                value={protein}
                onChange={(e) => { const v = e.target.value; if (/^\d*\.?\d*$/.test(v)) setProtein(v); }}
                placeholder="Optional"
                className="w-full bg-components border border-bordercolor rounded-lg px-3 py-2 text-textcolor focus:outline-none focus:border-accent"
              />
              <label className="text-textcolor text-base font-semibold mt-4">Fats (g):</label>
              <input
                type="text"
                inputMode="decimal"
                value={fats}
                onChange={(e) => { const v = e.target.value; if (/^\d*\.?\d*$/.test(v)) setFats(v); }}
                placeholder="Optional"
                className="w-full bg-components border border-bordercolor rounded-lg px-3 py-2 text-textcolor focus:outline-none focus:border-accent"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-center pt-4 pb-8">
          <button
            onClick={handleSkip}
            className="px-8 py-3 rounded-lg border border-bordercolor text-textcolor hover:bg-components-hover transition-colors font-semibold text-lg"
          >
            Skip
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-action px-8 py-3 rounded-lg text-textcolor transition-colors font-semibold text-lg"
          >
            <SaveIcon sx={{ fontSize: 24 }} /> Save
          </button>
        </div>
      </div>
    </div>
  );
}
