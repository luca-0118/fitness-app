import { useState, useEffect } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { invoke } from "@tauri-apps/api/core";

interface DatabaseFoodItem {
    id: number;
    name: string;
    amount: number;
    calories: number;
    barcode: string;
    date: string;
    mealtime: string;
}

interface MealCategory {
    cat: string;
    items: DatabaseFoodItem[];
}

function kcalCalc(calories: number, amount: number) {
  return Math.round(calories * amount);
}

function FoodComp({ item }: { item: DatabaseFoodItem }) {
    const kcal = kcalCalc(item.calories, item.amount);

    return (
    <div className="w-full rounded-xl pl-4 flex items-stretch justify-between bg-background overflow-hidden">
        <div className="flex items-center justify-between flex-1 pr-4 py-3">
            <div className="text-textcolor font-medium flex items-center">
                {item.name}
            </div>

            <div className="flex items-center gap-4">
                <div className="text-sm text-gray-300 text-right">
                    idk gram
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
    const [open, setOpen] = useState<Record<string, boolean>>({ ochtend: false, middag: false, avond: false });
    const [mealCategories, setMealCategories] = useState<MealCategory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFoodByDate();
    }, []);

    const fetchFoodByDate = async () => {
        try {
            setLoading(true);
            const result = await invoke<DatabaseFoodItem[]>("get_food_by_date", {
                date: '2026-05-18'
            });
            
            const grouped = groupByMealTime(result);
            setMealCategories(grouped);
            console.log("Fetched food items:", result);
        } catch (err) {
            console.error("Error fetching food data:", err);
        } finally {
            setLoading(false);
        }
    };

    const groupByMealTime = (items: DatabaseFoodItem[]): MealCategory[] => {
        const mealCat: Record<string, DatabaseFoodItem[]> = {
            ochtend: [],
            middag: [],
            avond: []
        };

        items.forEach((item) => {
            const mealTime = item.mealtime.toLowerCase();
            if (mealTime in mealCat) { //check als category klopt
                mealCat[mealTime].push(item);
            }
            else {
                console.log(`category error: ${mealTime}`)
            }
        });

        return [
            { cat: "Ochtend", items: mealCat.ochtend },
            { cat: "Middag", items: mealCat.middag },
            { cat: "Avond", items: mealCat.avond },
        ];
    };

    const toggle = (key: string) => {
        setOpen((currentOpen) => {
            const states = { ...currentOpen };
            states[key] = !currentOpen[key];
            return states;
        });
    };

    const getTotalCalories = (items: DatabaseFoodItem[]) => {
        return items.reduce((total, item) => total + kcalCalc(item.calories, item.amount), 0);
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
                {loading ? (
                    <div className="text-center text-textcolor py-4">Loading...</div>
                ) : mealCategories.length === 0 ? (
                    <div className="text-center text-textcolor py-4">No food data</div>
                ) : (
                    mealCategories.map((cat) => { //ik moet cat even aanpassen lol
                        const isOpen = open[cat.cat];
                        const totalKcal = getTotalCalories(cat.items);
                        return (
                            <div key={cat.cat} className="rounded-2xl overflow-hidden border border-accent">
                                <button
                                    onClick={() => toggle(cat.cat)}
                                    className={`w-full text-left px-4 py-3 flex items-center justify-between bg-background`}
                                >
                                <div>
                                    <div className="text-textcolor font-semibold">{cat.cat}</div>
                                    <div className="text-sm text-gray-400">{cat.items.length} items | total {totalKcal} kcal</div>
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
                    })
                )}
            </div>
        </div>
    );
}
