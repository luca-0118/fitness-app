use crate::{Ctx};

#[tauri::command]
pub fn delete_food_by_id(ctx: tauri::State<Ctx>) -> Result<String, String>{
    let conn = ctx.db.conn.lock().map_err(|e| e.to_string())?;
    let query = "delete from Food Where id = 1";
    conn.execute(query, []).unwrap();
    Ok("removed".to_string())
}