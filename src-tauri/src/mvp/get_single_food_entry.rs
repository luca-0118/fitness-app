use crate::{lars::Food, Ctx};
use tauri::State;

#[tauri::command]
pub fn get_single_food_entry(ctx: State<Ctx>, req: String) -> Food {
    let food = ctx
        .db
        .use_conn(|tx| {
            let mut stmt = tx.prepare("select * from Food where id = ?1")?;

            let response = stmt.query_one([req], |row| {
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
            })?;

            Ok(response)
        })
        .unwrap();

    return food;
}
