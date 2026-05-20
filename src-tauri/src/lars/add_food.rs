use crate::{Ctx};

#[tauri::command]
pub fn add_food(ctx: tauri::State<Ctx>, barcode:String,date:String,name:String,amount:f64, calories:f64, carbs:f64, fats:f64, protein:f64, mealtime:String) {
    let conn = ctx.db.conn.lock().unwrap();
    conn.execute("INSERT INTO food(barcode, date,name, amount, calories, carbs, fats, protein,mealtime) VALUES (?, ?, ?,?,?,?,?,?,?)", (barcode, date,name, amount,calories, carbs, fats, protein, mealtime) );
    println!("{}", "added")
}