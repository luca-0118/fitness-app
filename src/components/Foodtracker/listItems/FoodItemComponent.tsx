import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import NutrimentSquare from "../../ui/NutrimentSquare";

interface Nutriments {
  "energy-kcal_100g"?: number;
  "carbohydrates_100g"?: number;
  "proteins_100g"?: number;
  "fat_100g"?: number;
  "sugars_100g"?: number;
  "fiber_100g"?: number;
  "sodium_100g"?: number;
}

interface ParsedNutriments {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  sugar: number;
  fiber: number;
  sodium: number;
}

interface FoodItemProps {
  name: string;
  nutriments: Nutriments;
  barcode: string
  brand: string
  onClick: () => void
}


/**
 * Transforms nutrients from the database values into an object that is more easily usable.
 * @param nutriments
 */
function parseNutriments(nutriments: Nutriments): ParsedNutriments {
  const calories = nutriments["energy-kcal_100g"] ?? 0;
  const carbs = nutriments["carbohydrates_100g"] ?? 0
  const protein = nutriments["proteins_100g"] ?? 0;
  const fat = nutriments["fat_100g"] ?? 0;
  const sugar = nutriments["sugars_100g"] ?? 0;
  const fiber = nutriments["fiber_100g"] ?? 0;
  const sodium = nutriments["sodium_100g"] ?? 0;

  return { calories, carbs, protein, fat, sugar, fiber, sodium };
}

//note: onclick here is currently used to add it to recents.
export default function FoodItemComponent({ name, nutriments, barcode, brand, onClick }: FoodItemProps) {
  const [overlay, setOverlay] = useState<Boolean>(false);
  const [amount, setAmount] = useState<number>(0)
  const [mealtime, setMealtime] = useState<String>("ochtend")

  function toggleOverlay() {
    setOverlay(!overlay);
  }

  if (!nutriments) {
    return (
      <div>
      </div>
    );
  }
  async function addFoodToDatabase(barcode: String, date: String, name: String, amount: number, calories: number, carbs: number, fat: number, protein: number, mealtime: String) {
    await invoke("add_food", { barcode: barcode, date: date, name: name, amount: amount, calories: calories, carbs: carbs, fats: fat, protein: protein, mealtime: mealtime });
  }

  const parsedNutriments = parseNutriments(nutriments);


  function handleAddFoodClick() {
    addFoodToDatabase(barcode, new Date().toISOString(), name, amount, Number(parsedNutriments.calories.toFixed()) / 100 * amount, Number(parsedNutriments.carbs.toFixed(1)) / 100 * amount, Number(parsedNutriments.fat.toFixed(1)) / 100 * amount, Number(parsedNutriments.protein.toFixed(1)) / 100 * amount, mealtime)
    setOverlay(false)
  }


  if (overlay === true) return <Overlay
    name={name}
    nutriments={parsedNutriments}
    barcode={barcode}
    brand={brand}
    updateAmount={(val: number) => { setAmount(val) }}
    updateMealTime={(val: string) => { setMealtime(val) }}
    disableOverlay={() => setOverlay(false)}
    addProduct={handleAddFoodClick}
    onClick={onClick} // adds item to recents.
  />
  if (!overlay) return <Item handleClick={toggleOverlay} name={name} brand={brand} />
}




interface OverlayProps {
  name: string;
  nutriments: ParsedNutriments;
  brand: string;
  barcode: string;
  disableOverlay: () => void;
  updateAmount: (val: number) => void;
  updateMealTime: (val: string) => void;
  addProduct: () => void;
  onClick: () => void;
}
function Overlay({ name, nutriments, brand, barcode, disableOverlay, updateAmount, updateMealTime, addProduct, onClick }: OverlayProps) {
  return <div className="z-10 bg-gray-600 fixed top-0 right-0 left-0 bottom-0 w-full h-full pt-40 mt-10 " onClick={() => onClick()}> {/** this onclick adds the fooditem to recents. */}
    <div className="fixed inset-0 top-15 bottom-15 bg-background z-20 overflow-y-auto px-5 py-5 no-scrollbar">
      <h2 className="text-textcolor text-center text-2xl font-bold mb-3">{name}</h2>

      <section className="w-full max-w-md mx-auto bg-components border border-bordercolor rounded-xl p-5">
        <h1 className="text-textcolor text-xl font-bold mb-4">Product Details per 100g</h1>
        <div className="grid grid-cols-3 gap-3 ">
          <NutrimentSquare name="Calories" value={nutriments.calories.toFixed()} color="accent" size={3} />
          <NutrimentSquare name="Carbs" value={nutriments.carbs.toFixed(1)} color="#DC143C" />
          <NutrimentSquare name="Proteins" value={nutriments.protein.toFixed(1)} color="#4DA3FF" />
          <NutrimentSquare name="Fats" value={nutriments.fat.toFixed(1)} color="#32CD32" />
          <NutrimentSquare name="Sugar" value={nutriments.sugar.toFixed(1)} color="#FFD700" />
          <NutrimentSquare name="Fiber" value={nutriments.fiber.toFixed(1)} color="#9153cc" />
          <NutrimentSquare name="Sodium" value={nutriments.sodium.toFixed(1)} color="#FF4500" />
        </div>
      </section>

      <section className="w-full max-w-md mx-auto mt-5 bg-components border border-bordercolor rounded-xl p-5">
        <h2 className="text-textcolor text-lg font-bold mb-3">Additional info</h2>
        <p className="text-textcolor text-sm">
          brand: {brand} <br />
          barcode: {barcode}
        </p>
      </section>

      <section>
        <div className="w-full max-w-md mx-auto mt-5 bg-components border border-bordercolor rounded-xl p-5">
          <h2 className="text-textcolor text-lg font-bold mb-3">
            Daily progression (g)
          </h2>
          <input
            type="text"
            placeholder="0"
            className="bg-components text-textcolor placeholder:text-gray-500 border border-bordercolor rounded-xl p-2 w-25 focus:outline-none focus:ring-2 focus:ring-accent"
            onChange={(e) => updateAmount(Number(e.target.value))}
          />
          <select onChange={(e) => updateMealTime(e.target.value)}
            defaultValue="ochtent"
            className="bg-components text-textcolor border border-bordercolor rounded-xl p-2 w-32 focus:outline-none focus:ring-2 focus:ring-accent ml-3"
          >
            <option value="ochtent">breakfast</option>
            <option value="middag">lunch</option>
            <option value="avond">dinner</option>
          </select>
        </div>
        <div className="w-full max-w-md mx-auto mt-5">
          <div className=" flex">
            <button onClick={() => disableOverlay()} className="cursor-pointer mx-auto sticky bottom-2 h-16 justify-center items-center font-bold w-[90%] rounded-full text-textcolor bg-components hover:bg-components-hover active:bg-components-hover flex z-30">
              Cancel
            </button>
            <button className="cursor-pointer mx-auto sticky bottom-2 h-16 justify-center items-center font-bold w-[90%] rounded-full text-textcolor bg-accent hover:bg-accent-action active:bg-accent-action flex z-30" onClick={() => addProduct()}>
              Add product
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
}


interface ItemProps {
  handleClick: () => void;
  name: string;
  brand: string;
}
function Item({ handleClick, name, brand }: ItemProps) {
  return <div
    className="bg-components border-bordercolor border rounded-xl px-2 mb-3 flex w-[90%] items-center mx-auto hover:bg-components-hover active:bg-components-hover cursor-pointer"
    onClick={() => handleClick()}
  >
    <div className="pl-3 p-6">
      <div className="flex-1 text-xl text-textcolor text-left cursor-pointer mb-auto">
        {name}
      </div>
      {brand && (
        <div className="text-xs text-muted text-left">
          {brand}
        </div>
      )}
    </div>
  </div>
}