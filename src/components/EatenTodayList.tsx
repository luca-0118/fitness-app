import { useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface Nutriments {
    "energy-kcal_100g"?: number;
}

interface EatenFoodItem {
    id: string;
    name: string;
    amount: number;
    unit: string;
    nutriments: Nutriments;
}

interface MealCategory {
    key: "breakfast" | "lunch" | "dinner";
    label: string;
    items: EatenFoodItem[];
}

const mockEatenToday: MealCategory[] = [
    {
        key: "breakfast",
        label: "Breakfast",
        items: [
            { id: "b1", name: "Rolled Oats", amount: 80, unit: "g", nutriments: { "energy-kcal_100g": 389 } },
            { id: "b2", name: "Greek Yogurt", amount: 150, unit: "g", nutriments: { "energy-kcal_100g": 59 } },
        ],
    },
    {
        key: "lunch",
        label: "Lunch",
        items: [
            { id: "l1", name: "Chicken Salad", amount: 220, unit: "g", nutriments: { "energy-kcal_100g": 135 } },
            { id: "l2", name: "Apple", amount: 150, unit: "g", nutriments: { "energy-kcal_100g": 52 } },
        ],
    },
    {
        key: "dinner",
        label: "Dinner",
        items: [
            { id: "d1", name: "Grilled Salmon", amount: 180, unit: "g", nutriments: { "energy-kcal_100g": 208 } },
            { id: "d2", name: "Broccoli", amount: 120, unit: "g", nutriments: { "energy-kcal_100g": 34 } },
        ],
    },
];

function kcalCalc(kcalPer100g: number | undefined, amount: number) { //calc is slang for calculator btw
  return kcalPer100g ? Math.round((kcalPer100g * amount) / 100) : 0;
}

function FoodComp({ item }: { item: EatenFoodItem }) {
    const kcal = kcalCalc(item.nutriments["energy-kcal_100g"], item.amount);

    return (
    <div className="w-full rounded-xl pl-4 flex items-stretch justify-between bg-background overflow-hidden">
        <div className="flex items-center justify-between flex-1 pr-4 py-3">
            <div className="text-textcolor font-medium flex items-center">
                {item.name}
            </div>

            <div className="flex items-center gap-4">
                <div className="text-sm text-gray-300 text-right">
                    {item.amount}{item.unit} {/*ik weet niet eens als de database zo werkt lol de mock data is AIgen*/} 
                </div>

                <div className="text-sm text-gray-300 text-right">
                    {kcal} kcal
                </div>
            </div>
        </div>
        <button
            className="flex items-center px-2 bg-accent hover:bg-accent-action text-textcolor"
        >
            <ArrowForwardIcon sx={{ fontSize: 18 }} />
        </button>
    </div>
    );
}

export default function EatenTodayList() {
    const [open, setOpen] = useState<Record<string, boolean>>({ breakfast: false, lunch: false, dinner: false });

    const toggle = (key: string) => {
        setOpen((currentOpen) => {
            const states = { ...currentOpen };
            states[key] = !currentOpen[key];
            return states;
        });
    };

    return (
        <div className="bg-components border border-bordercolor rounded-xl p-0 col-span-2">
            <div className="flex items-center justify-between px-4 py-3 border-b border-bordercolor">
                <button className="flex items-center gap-2 text-textcolor opacity-80 hover:opacity-100">
                    <ArrowBackIcon sx={{ fontSize: 24 }} />
                </button>
                <h2 className="text-center font-bold text-lg text-textcolor">Eaten today</h2>
                <button className="flex items-center gap-2 text-textcolor opacity-80 hover:opacity-100">
                    <ArrowForwardIcon sx={{ fontSize: 24 }} />
                </button>
            </div>

            <div className="p-3 space-y-3">
                {mockEatenToday.map((cat) => { //cat voor category :3
                const isOpen = open[cat.key];
                return (
                    <div key={cat.key} className="rounded-2xl overflow-hidden border border-accent">
                        <button
                            onClick={() => toggle(cat.key)}
                            className={`w-full text-left px-4 py-3 flex items-center justify-between bg-background`}
                        >
                        <div>
                            <div className="text-textcolor font-semibold">{cat.label}</div>
                            <div className="text-sm text-gray-400">{cat.items.length} items</div>
                        </div>
                            <div className="text-textcolor text-2xl">{isOpen ? "−" : "🢓"}</div>
                        </button>

                        <div className={`${isOpen ? "block" : "hidden"} bg-components-hover flex flex-col gap-1 px-3 py-2`}>
                            {cat.items.map((item) => (
                            <FoodComp key={item.id} item={item}/>
                            ))}
                        </div>
                    </div>
                );
                })}
            </div>
        </div>
    );
}
