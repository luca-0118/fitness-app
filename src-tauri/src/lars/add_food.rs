use crate::{Ctx};

#[tauri::command]
pub fn add_food(ctx: tauri::State<Ctx>, barcode:String,date:String,amount:f64, calories:f64, carbs:f64, fats:f64, protein:f64) {
    let conn = ctx.db.conn.lock().unwrap();
    conn.execute("INSERT INTO food(barcode, date, amount, calories, carbs, fats, protein) VALUES (?, ?, ?,?,?,?,?)", (barcode, date, amount,calories, carbs, fats, protein) );
    println!("{}", "added")
}