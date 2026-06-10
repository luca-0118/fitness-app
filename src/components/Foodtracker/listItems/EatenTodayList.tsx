import {useState, useEffect, useRef} from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { invoke } from "@tauri-apps/api/core";
import Calender from "../misc/Calendar.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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


export default function EatenTodayList() {
    function FoodComp({ item, selectedNutrient }: { item: DatabaseFoodItem; selectedNutrient: string | null }) {

        const handleFoodItemClick = () => {
            navigate("/kcal-tracker/" + item.id);
        }

        return (
            <div className="w-full rounded-xl flex bg-background justify-between relative">
                <div className="flex items-center pl-3 w-full overflow-hidden justify-between">
                    <button
                        className="text-textcolor font-medium text-left truncate flex-1 min-w-0"
                        onClick={() => navigate("/product-details", {
                            state: {
                                id: item.id,
                                name: item.name,
                                amount: item.amount,
                                calories: item.calories,
                                carbs: item.carbs,
                                protein: item.protein,
                                fats: item.fats,
                                barcode: item.barcode,
                                date: item.date,
                            }
                        })}
                    >
                        {item.name}
                    </button>
                    <div className="flex flex-col items-end text-right text-sm text-muted mx-3 whitespace-nowrap">
                        <span>{Math.round(item.amount)}g</span>
                        <span>{selectedNutrient === "Carbs"
                            ? `${Math.round(item.carbs)}g`
                            : selectedNutrient === "Proteins"
                                ? `${Math.round(item.protein)}g`
                                : selectedNutrient === "Fats"
                                    ? `${Math.round(item.fats)}g`
                                    : `${Math.round(item.calories)}kcal`}</span>
                    </div>
                    <div ref={(node) => { dropdownRefs.current[item.id] = node; }} className="flex h-full px-1 py-2 items-center text-textcolor">
                        <button
                            className="flex items-center justify-center p-2 rounded-lg hover:bg-components-hover"
                            onClick={() => {
                                setOpenDropdownId(
                                    openDropdownId === item.id ? null : item.id
                                );
                            }}
                        >
                            <MoreVertIcon />
                        </button>

                        <div
                            className={`absolute z-10 top-full right-1 mt-1 flex flex-col rounded-xl p-2 bg-components border border-bordercolor origin-top-right
                                ${openDropdownId === item.id ? "opacity-100 scale-100" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}`}
                        >
                            <button
                                type="button"
                                className="w-full hover:bg-components-hover flex items-center gap-2 px-3 py-2 rounded-xl"
                                onClick={handleFoodItemClick}
                            >
                                <EditIcon fontSize="small" />
                                Edit
                            </button>

                            <button
                                type="button"
                                className="w-full hover:bg-components-hover text-button-stop flex items-center gap-2 px-3 py-2 rounded-xl"
                                onClick={() => {
                                    removeItem(item.id);
                                    setOpenDropdownId(null);
                                }}
                            >
                                <DeleteIcon fontSize="small" />
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const location = useLocation();
    const navigate = useNavigate();
    const selectedNutrient = location.state?.selectedNutrient || null;

    async function removeItem(id:number){
    try{
    await invoke("delete_food_by_id", {id})
        fetchFoodByDate()
}
    
    catch(e){
        console.log(e)
    }


}
    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
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

    const dropdownRefs = useRef<Record<number, HTMLDivElement | null>>({});

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (openDropdownId === null) {
                return;
            }

            const activeDropdown = dropdownRefs.current[openDropdownId];
            if (activeDropdown && !activeDropdown.contains(event.target as Node)) {
                setOpenDropdownId(null);
            }
        }

        document.addEventListener("pointerdown", handleClickOutside);

        return () => {
            document.removeEventListener("pointerdown", handleClickOutside);
        };
    }, [openDropdownId]);

    const fetchFoodByDate = async () => {

        try {
            setLoading(true);
            const result = await invoke<DatabaseFoodItem[]>("get_food_by_date", {
                date: date.toISOString().split("T")[0],
            });
            setMealCategories(groupByMealTime(result));
            console.log("Fetched food items:", result);
            const grouped = groupByMealTime(result);

            setMealCategories(grouped);

            setOpen((current) => {
                const next = { ...current };

                grouped.forEach((cat) => {
                    if (cat.items.length === 0) {
                        next[cat.key] = false;
                    }
                });

                return next;
            });

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
                console.error("DB caegory error:", item.mealtime);
                console.log(map)
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
                            <div key={cat.key} className="rounded-2xl border border-accent">
                                <button
                                    onClick={() => cat.items.length > 0 ? toggle(cat.key) : null}
                                    className={`${
                                        isOpen  ? "rounded-t-2xl" : "rounded-2xl"} w-full text-left px-4 py-3 flex items-center justify-between bg-background`}
                                >
                                    <div>
                                        <div className="text-textcolor font-semibold">{cat.catName}</div>
                                        <div className="text-sm text-muted">
                                            total: {Math.round(totalValue)}
                                            {selectedNutrient === "Calories" || !selectedNutrient ? "kcal" : "g"}
                                            {selectedNutrient === "Calories" || !selectedNutrient ? " calories" : ` ${selectedNutrient.toLowerCase()}`} | {cat.items.length} items
                                        </div>
                                    </div>
                                    <div className="text-textcolor text-2xl">{isOpen ? "−" : <ArrowDropDownIcon />}</div>
                                </button>
                                <div
                                    className={`${
                                        isOpen  ? "block" : "hidden"
                                    } rounded-b-2xl bg-components-hover flex flex-col gap-1 px-3 py-2`}
                                >
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