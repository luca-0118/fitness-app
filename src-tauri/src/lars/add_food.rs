use crate::{Ctx};

#[tauri::command]
pub fn add_food(ctx: tauri::State<Ctx>, barcode:String,date:String,amount:i64) {
    let conn = ctx.db.conn.lock().unwrap();
    conn.execute("INSERT INTO food(barcode, date, amount) VALUES (?, ?, ?)", (barcode, date, amount) );
    println!("{}", "added")
}