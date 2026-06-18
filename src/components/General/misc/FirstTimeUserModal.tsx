import { useState } from "react";
import KcalBerekenen from "../../Foodtracker/misc/KcalBerekenen.tsx";
import SaveIcon from "@mui/icons-material/Save";

interface FirstTimeUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FirstTimeUserModal({ isOpen, onClose }: FirstTimeUserModalProps) {
  const [kcal, setKcal] = useState("");
  const [carbs, setCarbs] = useState("");
  const [protein, setProtein] = useState("");
  const [fats, setFats] = useState("");

  const handleSave = () => {
    if (!kcal) {
      alert("Please enter a kcal target");
      return;
    }

    localStorage.setItem('nutrientGoals', JSON.stringify({ kcal, carbs, fats, protein }));
    localStorage.setItem('firstTimeUserCompleted', 'true');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-components border-2 border-bordercolor rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <h1 className="text-3xl font-bold text-textcolor mb-6 text-center">Welcome!</h1>
        
        <p className="text-textcolor text-center mb-6">
          Let's set up your nutrition targets. First, calculate your TDEE (Total Daily Energy Expenditure) by filling in your details below.
        </p>

        <div className="mb-8">
          <KcalBerekenen />
        </div>

        <div className="bg-components border-bordercolor border rounded-xl w-full text-textcolor px-4 py-2 mb-6">
          <h2 className="border-b border-bordercolor font-bold w-full text-start mb-3">Your Nutrition Targets</h2>
          <div className="py-2 flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <label className="text-textcolor text-base">kcal:</label>
              <input
                type="text"
                inputMode="numeric"
                value={kcal}
                onChange={(e) => { const v = e.target.value; if (/^\d*\.?\d*$/.test(v)) setKcal(v); }}
                placeholder="Enter your daily kcal target"
                className="w-full bg-components border border-bordercolor rounded-lg px-3 py-2 text-textcolor focus:outline-none focus:border-accent"
              />
              <label className="text-textcolor text-base mt-2">Carbs (g):</label>
              <input
                type="text"
                inputMode="decimal"
                value={carbs}
                onChange={(e) => { const v = e.target.value; if (/^\d*\.?\d*$/.test(v)) setCarbs(v); }}
                placeholder="Optional"
                className="w-full bg-components border border-bordercolor rounded-lg px-3 py-2 text-textcolor focus:outline-none focus:border-accent"
              />
              <label className="text-textcolor text-base mt-2">Proteins (g):</label>
              <input
                type="text"
                inputMode="decimal"
                value={protein}
                onChange={(e) => { const v = e.target.value; if (/^\d*\.?\d*$/.test(v)) setProtein(v); }}
                placeholder="Optional"
                className="w-full bg-components border border-bordercolor rounded-lg px-3 py-2 text-textcolor focus:outline-none focus:border-accent"
              />
              <label className="text-textcolor text-base mt-2">Fats (g):</label>
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

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg border border-bordercolor text-textcolor hover:bg-components-hover transition-colors"
          >
            Skip
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-action px-6 py-2 rounded-lg text-textcolor transition-colors"
          >
            <SaveIcon sx={{ fontSize: 20 }} /> Save
          </button>
        </div>
      </div>
    </div>
  );
}
