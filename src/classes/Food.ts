import { invoke } from "@tauri-apps/api/core";

interface foodInput {
    id: number;
     barcode: string;
     date: string;
     name: string;
     amount: number;
     calories: number;
     carbs: number;
     fats: number;
     protein: number;
     mealtime: string;
}

interface UpdatableFoodFields {
    date?: string;
    amount?: number;
    calories?: number;
    carbs?: number;
    fats?: number;
    protein?: number;
    mealtime?: string;
}

export default class Food
{
    public id: number;
    public barcode: string;
    public date: string;
    public name: string;
    public amount: number;
    public calories: number;
    public carbs: number;
    public fats: number;
    public protein: number;
    public mealtime: string;

    constructor(input: foodInput) {
        this.id = input.id;
        this.barcode = input.barcode;
        this.date = input.date;
        this.name = input.name;
        this.amount = input.amount;
        this.calories = input.calories;
        this.carbs = input.carbs;
        this.fats = input.carbs;
        this.protein = input.protein;
        this.mealtime = input.mealtime;
    }

    static async getSingle(_foodID: number, isMock = false): Promise<Food>
    {
        if (isMock) {
            return new Food({
                "id": 1,
                "barcode": "8718907369350",
                "date": "2026-06-01T19:09:14.306Z",
                "amount": 100,
                "calories": 187,
                "carbs": 21,
                "fats": 6.800000000000001,
                "protein": 9.8,
                "name": "MockFood",
                "mealtime": "ochtend"
            })
        }

        let food: Food = await invoke("get_single_food_entry",{req: String(_foodID)});
        return food;

        throw new Error("non-mock not implemented");

        //TODO construct backend function
    }

    static async update(_foodID: number,{date,amount,calories,carbs,protein,fats,mealtime}:UpdatableFoodFields): Promise<boolean>
    {
        const updateFields = {date,amount,calories,carbs,protein,fats,mealtime};
        
        let response = await invoke<boolean>("update_stored_products",{foodId:String(_foodID),values: updateFields});
        console.log("new food intake: ",{foodID:_foodID,values: updateFields});

        return response;
    }

    
}