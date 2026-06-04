use crate::Ctx;
use serde::Serialize;
#[derive(Debug, Serialize)]
pub struct Food {
    pub id: i64,
    pub barcode: String,
    pub date: String,
    pub amount: f64,
    pub calories: f64,
    pub carbs: f64,
    pub fats: f64,
    pub protein: f64,
    pub name: String,
    pub mealtime: String,
}

#[tauri::command]
pub fn get_food_by_date(ctx: tauri::State<Ctx>, date: String) -> Result<Vec<Food>, String> {
    let conn = ctx.db.conn.lock().unwrap();
    let mut stmt = conn
        .prepare("select * from food where date(date) = date(?1)")
        .map_err(|e| e.to_string())?;
    let foods = stmt
        .query_map([&date], |row| {
            Ok(Food {
                id: row.get(0)?,
                barcode: row.get(1)?,
                date: row.get(2)?,
                name: row.get(3)?,
                amount: row.get(4)?,
                calories: row.get(5)?,
                carbs: row.get(6)?,
                fats: row.get(7)?,
                protein: row.get(8)?,
                mealtime: row.get(9)?,
            })
        })
        .map_err(|e| e.to_string())?;
    let mut vec = Vec::new();

    for food in foods {
        vec.push(food.map_err(|e| e.to_string())?);
    }
    Ok(vec)
}
