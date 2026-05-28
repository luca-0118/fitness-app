import { useState, useEffect } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { invoke } from "@tauri-apps/api/core";
import Calender from "./Calendar";
import {useLocation, useNavigate} from "react-router-dom";

interface DatabaseFoodItem {
    id: number;
    name: string;
    amount: number;
    calories: number;
    carbs: number;
    protein: number;
    fats: number;
    barcode: string;
    date: string;
    mealtime: MealCategoryKey;
}

const Categories = [
    { key: "ochtend", catName: "Breakfast" },
    { key: "middag", catName: "Lunch" },
    { key: "avond", catName: "Dinner" },
] as const;

type MealCategoryKey = typeof Categories[number]["key"];

interface MealCategory {
    key: MealCategoryKey;
    catName: string;
    items: DatabaseFoodItem[];
}

const createEmptyMealMap = () => {
    return Object.fromEntries(
        Categories.map((c) => [c.key, [] as DatabaseFoodItem[]])
    ) as Record<MealCategoryKey, DatabaseFoodItem[]>;
};

function totalNutrients(items: DatabaseFoodItem[], nutrient: string | null) {
    return items.reduce((total, item) => {
        switch (nutrient) {
            case "Carbs":
                return total + item.carbs;
            case "Proteins":
                return total + item.protein;
            case "Fats":
                return total + item.fats;
            default:
                return total + item.calories;
        }
    }, 0);
}

function FoodComp({ item, selectedNutrient }: { item: DatabaseFoodItem; selectedNutrient: string | null }) {
    return (
        <div
            className={`w-full rounded-xl pl-4 pr-4 py-3 flex justify-between bg-background overflow-hidden`}
        >
            <div className="flex items-center justify-between">
                <div className="text-textcolor font-medium flex text-left">
                    {item.name}
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-sm text-muted text-right">
                        {item.amount}g
                    </div>

                    <div className="text-sm text-muted text-right">
                        {selectedNutrient === "Carbs"
                            ? `${Math.round(item.carbs)}g`
                            : selectedNutrient === "Proteins"
                                ? `${Math.round(item.protein)}g`
                                : selectedNutrient === "Fats"
                                    ? `${Math.round(item.fats)}g`
                                    : `${Math.round(item.calories)}kcal`} {selectedNutrient === "Carbs"
                        ? `Carbs`
                        : selectedNutrient === "Proteins"
                            ? `Protein`
                            : selectedNutrient === "Fats"
                                ? `Fats`
                                : `kcal`}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function EatenTodayList() {
    const location = useLocation();
    const navigate = useNavigate();
    const selectedNutrient = location.state?.selectedNutrient || null;

    const [open, setOpen] = useState<Record<MealCategoryKey, boolean>>(
        Object.fromEntries(
            Categories.map((cat) => [cat.key, false])
        ) as Record<MealCategoryKey, boolean>
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
                date: date.toISOString().split("T")[0],
            });
            setMealCategories(groupByMealTime(result));
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
        navigate("/kcal-tracker"); // Reset when changing day
    };

    const handleNextDay = () => {
        setDate((currentDate) => {
            const newDate = new Date(currentDate);
            newDate.setDate(newDate.getDate() + 1);
            return newDate;
        });
        navigate("/kcal-tracker"); // Reset when changing day
    };

    const groupByMealTime = (items: DatabaseFoodItem[]): MealCategory[] => {
        const map = createEmptyMealMap();
        for (const item of items) {
            if (item.mealtime in map) {
                map[item.mealtime].push(item);
            } else {
                console.error("DB category error:", item.mealtime);
            }
        }
        return Categories.map((cat) => ({
            key: cat.key,
            catName: cat.catName,
            items: map[cat.key]
        }));
    };

    const toggle = (key: MealCategoryKey) => {
        setOpen((currentOpen) => ({
            ...currentOpen,
            [key]: !currentOpen[key],
        }));
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
                    <div className="absolute right-10 text-textcolor">
                        <Calender onDateChange={setDate} />
                    </div>
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
                        const totalValue = totalNutrients(cat.items, selectedNutrient);
                        return (
                            <div key={cat.key} className="rounded-2xl overflow-hidden border border-accent">
                                <button
                                    onClick={() => toggle(cat.key)}
                                    className="w-full text-left px-4 py-3 flex items-center justify-between bg-background"
                                >
                                    <div>
                                        <div className="text-textcolor font-semibold">{cat.catName}</div>
                                        <div className="text-sm text-muted">
                                            total {Math.round(totalValue)}
                                            {selectedNutrient === "Calories" || !selectedNutrient ? "kcal" : "g"}
                                            {selectedNutrient === "Calories" || !selectedNutrient ? " calories" : ` ${selectedNutrient.toLowerCase()}`} | {cat.items.length} items
                                        </div>
                                    </div>
                                    <div className="text-textcolor text-2xl">{isOpen ? "−" : <ArrowDropDownIcon />}</div>
                                </button>
                                <div className={`${isOpen ? "block" : "hidden"} bg-components-hover flex flex-col gap-1 px-3 py-2`}>
                                    {cat.items.map((item) => (
                                        <FoodComp key={item.id} item={item} selectedNutrient={selectedNutrient} />
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