use crate::Ctx;
use serde::Deserialize;
use serde::Serialize;
use tauri::State;

#[derive(Serialize, Debug, Deserialize)]
pub struct UpdateStoredProductInputs {
    date: String,
    amount: f64,
    calories: f64,
    carbs: f64,
    protein: f64,
    fats: f64,
    mealtime: String,
}

#[tauri::command]
pub fn update_stored_products(
    ctx: State<Ctx>,
    food_id: String,
    values: UpdateStoredProductInputs,
) -> bool {
    println!(
        "[backend][message] preparing to update stored product with values: {:?}",
        values
    );
    let resp = ctx
        .db
        .use_conn(|tx| {
            let mut stmt = tx.prepare(
                "
                UPDATE food 
                SET date = ?1
                , amount = ?2
                , calories = ?3
                , carbs = ?4
                , protein = ?5
                , fats = ?6
                , mealtime = ?7
                WHERE id = ?8
            ",
            )?;

            let resp = stmt.execute([
                values.date,
                values.amount.to_string(),
                values.calories.to_string(),
                values.carbs.to_string(),
                values.protein.to_string(),
                values.fats.to_string(),
                values.mealtime,
                food_id,
            ])?;
            println!("[backend][success] Food has been updated");
            Ok(())
        })
        .map_err(|_err| {
            println!(
                "[backend][error] could not save product: {}",
                _err.to_string()
            )
        });

    return true;
}
