import { useNavigate, useParams } from "react-router-dom"
import Food from "../classes/Food";
import PageContainer from "../components/containers/PageContainer";
import NutrimentSquare from "../components/ui/NutrimentSquare";
import React, { useEffect, useState } from "react";
import { calcIntake } from "../helpers/helpers";
import toast from "react-hot-toast";

export default function EditFoodPage() {
    //parameters given from the router-dom link.
    const navigate = useNavigate();
    const params = useParams();
    const foodID: number = Number(params.foodId);

    //food item from the backend.
    const [food, setFood] = useState<Food | null>(null);

    //editable field.
    const [mealTime, setMealTime] = useState<string>("breakfast");
    const [eatenDate, setEatenDate] = useState<string>("");
    const [amountEaten, setAmountEaten] = useState<number | string>(0);

    // const [inputType, setInputType] = useState<string>(""); // we don't use this I think.


    //update functions for the editable fields.
    const updateMealTime = (e: React.ChangeEvent<HTMLSelectElement>) => {
        console.info("updated!", e.target.value);
        setMealTime(e.currentTarget.value);
    }

    const updateEatenDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.info("updated!", e.target.value);
        setEatenDate(e.target.value);
    }

    const updateAmountEaten = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;
        setAmountEaten(value === "" ? "" : Number(value));
    };

    const saveEditedProduct = async () => {
        const amount = typeof amountEaten === "string" ? Number(amountEaten) : amountEaten;

        const newIntake = calcIntake(food?.amount || 0, amount, {
            calories: food?.calories || 0,
            proteins: food?.protein || 0,
            fats: food?.fats || 0,
            carbs: food?.carbs || 0,
        });

        //update value in backend.
        const resp = await Food.update(foodID, {
            mealtime: mealTime,
            date: eatenDate,
            amount: amount, // Now guaranteed to be a number
            calories: newIntake.calories,
            carbs: newIntake.carbs,
            fats: newIntake.fats,
            protein: newIntake.proteins,
        });

        if (resp) {
            toast.success("successfully updated product!");
            setTimeout(() => navigate(-1), 300);
        } else {
            toast.error("something went wrong while saving your changes.");
        }
    };


    // Refers to a function which should implement calling the foodItem from the backend.
    useEffect(() => {
        const getFood = async () => {
            const _food = await Food.getSingle(foodID);
            setFood(_food);
        }
        getFood();
    }, [foodID]);


    // This useEffect updates the default values of the states 
    // once the food item is actually gathered from the backend.
    useEffect(() => {
        if (!food) return;

        setMealTime(food.mealtime);
        setEatenDate(food.date.split("T")[0]);
        setAmountEaten(food.amount); // food.amount is a number
    }, [food]);


    // #TODO proper loading skeleton
    if (!food) return <h1>loading....</h1>

    return <PageContainer>
        <div className="flex flex-col justify-between w-full h-full">
            <div>
                <h1 className="text-textcolor text-xl font-bold pb-4">{food.name}</h1>
                <section className="grid grid-cols-3 gap-3" id="macro-overview">
                    <NutrimentSquare name="Calories" value={food.calories.toFixed()} color="accent" size={3} />
                    <NutrimentSquare name="Carbs" value={food.carbs.toFixed(1)} color="#DC143C" />
                    <NutrimentSquare name="Proteins" value={food.protein.toFixed(1)} color="#4DA3FF" />
                    <NutrimentSquare name="Fats" value={food.fats.toFixed(1)} color="#32CD32" />
                </section>
                <section id="edit-food-values" className="text-textcolor flex flex-col gap-2 pb-4">
                    <div id="eaten-on">
                        <p>Eaten on</p>
                        <div className="inputs w-full flex justify-between gap-4">
                            <input defaultValue={eatenDate} onChange={updateEatenDate} className="bg-components rounded-xl px-2 py-1 border border-bordercolor" type="date" name="eaten-on-date" id="eaten-on-date" />
                            <select value={mealTime} onChange={updateMealTime} name="eaten-on-mealtime" id="eaten-on-mealtime" className="bg-components rounded-xl px-2 py-1 border border-bordercolor w-full">
                                <option value="breakfast">Breakfast</option>
                                <option value="lunch">Lunch</option>
                                <option value="dinner">Dinner</option>
                                <option value="snacks">Snack</option>
                            </select>
                        </div>
                    </div>
                    <div id="amount-eaten" className="text-textcolor">
                        <p>Amount eaten</p>
                        <div className="inputs w-full flex justify-between gap-4">
                            <input value={amountEaten} onChange={updateAmountEaten} className="bg-components rounded-xl px-2 py-1 border border-bordercolor w-25" type="numeric" name="eaten-on-date" id="eaten-on-date"/>
                            <select name="eaten-on-mealtime" id="eaten-on-mealtime" className="bg-components rounded-xl px-2 py-1 border border-bordercolor w-full">
                                <option value="gram">gram</option>
                            </select>
                        </div>
                    </div>
                </section>
            </div>
            <button className="w-full p-4 text-textcolor bg-accent rounded-full font-bold" onClick={saveEditedProduct}>save changes to product</button>
        </div>
    </PageContainer>
}