import { useState, useEffect } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { invoke } from "@tauri-apps/api/core";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Calender from "./Calendar";

interface DatabaseFoodItem {
    id: number;
    name: string;
    amount: number;
    calories: number;
    barcode: string;
    date: string;
    mealtime: string;
}

const MEAL_CATEGORY_KEYS = ["ochtend", "middag", "avond"] as const;

type MealCategoryKey = (typeof MEAL_CATEGORY_KEYS)[number];

interface MealCategory {
    key: MealCategoryKey;
    items: DatabaseFoodItem[];
}

function totalCalories(items: DatabaseFoodItem[]) {
    return items.reduce((total, item) => total + item.calories, 0);
}

function FoodComp({ item }: { item: DatabaseFoodItem }) {

    return (
    <div className="w-full rounded-xl pl-4 flex items-stretch justify-between bg-background overflow-hidden">
        <div className="flex items-center justify-between flex-1 pr-4 py-3">
            <div className="text-textcolor font-medium flex items-center">
                {item.name}
            </div>

            <div className="flex items-center gap-4">
                <div className="text-sm text-gray-300 text-right">
                    {item.amount}g
                </div>

                <div className="text-sm text-gray-300 text-right">
                    {item.calories} kcal
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
    const [open, setOpen] = useState<Record<MealCategoryKey, boolean>>(
        MEAL_CATEGORY_KEYS.reduce((acc, key) => ({ ...acc, [key]: false }), {} as Record<MealCategoryKey, boolean>)
    );
    const [mealCategories, setMealCategories] = useState<MealCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        fetchFoodByDate();
    }, [date]);

    const fetchFoodByDate = async () => {
        try {
            setLoading(true);
            const result = await invoke<DatabaseFoodItem[]>("get_food_by_date", {
                date: date.toISOString().split("T")[0]
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

    const handlePreviousDay = () => {
        setDate((currentDate) => {
            const newDate = new Date(currentDate);
            newDate.setDate(newDate.getDate() - 1);
            return newDate;
        });
    };

    const handleNextDay = () => {
        setDate((currentDate) => {
            const newDate = new Date(currentDate);
            newDate.setDate(newDate.getDate() + 1);
            return newDate;
        });
    };

    const groupByMealTime = (items: DatabaseFoodItem[]): MealCategory[] => {
        const mealCat = MEAL_CATEGORY_KEYS.reduce(
            (acc, key) => ({ ...acc, [key]: [] as DatabaseFoodItem[] }),
            {} as Record<MealCategoryKey, DatabaseFoodItem[]>
        );

        items.forEach((item) => {
            const mealTime = item.mealtime.toLowerCase() as MealCategoryKey;
            if (mealTime in mealCat) {
                mealCat[mealTime].push(item);
            } else {
                console.log(`category error: ${mealTime}`);
            }
        });

        return MEAL_CATEGORY_KEYS.map((key) => ({ key, items: mealCat[key] || [] }));
    };

    const toggle = (key: MealCategoryKey) => {
        setOpen((currentOpen) => {
            const states = { ...currentOpen };
            states[key] = !currentOpen[key];
            return states;
        });
    };

    return (
        <div className="bg-components border border-bordercolor rounded-xl p-0 col-span-2">
            <div className="flex items-center justify-between px-4 py-3 border-b border-bordercolor">
                <button
                    onClick={handlePreviousDay}
                    className="flex items-center gap-2 text-textcolor opacity-80 hover:opacity-100"
                >
                    <ArrowBackIcon sx={{ fontSize: 24 }} />
                </button>
                    <div className="flex-1 relative flex items-center justify-center">
                        <div className="text-center">
                            <h2 className="font-bold text-lg text-textcolor">Eaten on day</h2>
                            <div className="text-sm text-muted">{date.toDateString()}</div>
                        </div>
                        <div className="absolute right-10 text-textcolor"><Calender onDateChange={setDate} /></div>
                    </div>
                <button
                    onClick={handleNextDay}
                    className="flex items-center gap-2 text-textcolor opacity-80 hover:opacity-100"
                >
                    <ArrowForwardIcon sx={{ fontSize: 24 }} />
                </button>
            </div>

            <div className="p-3 space-y-3">
                {loading ? (
                    <div className="text-center text-textcolor py-4">Loading...</div>
                ) : mealCategories.length === 0 ? (
                    <div className="text-center text-textcolor py-4">No food data</div>
                ) : (
                    mealCategories.map((cat) => {
                        const isOpen = open[cat.key];
                        const totalKcal = totalCalories(cat.items);
                        return (
                            <div key={cat.key} className="rounded-2xl overflow-hidden border border-accent">
                                <button
                                    onClick={() => toggle(cat.key)}
                                    className={`w-full text-left px-4 py-3 flex items-center justify-between bg-background`}
                                >
                                <div>
                                    <div className="text-textcolor font-semibold">{cat.key.charAt(0).toUpperCase()+cat.key.slice(1)}</div>
                                    <div className="text-sm text-gray-400">{cat.items.length} items | total {totalKcal} kcal</div>
                                </div>
                                    <div className="text-textcolor text-2xl">{isOpen ? "−" : <ArrowDropDownIcon/>}</div>
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
