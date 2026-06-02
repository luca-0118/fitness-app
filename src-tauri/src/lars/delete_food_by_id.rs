use crate::{Ctx};

#[tauri::command]
pub fn delete_food_by_id(ctx: tauri::State<Ctx>, id:i64) -> Result<String, String>{
    println!("deleting");
    let conn = ctx.db.conn.lock().map_err(|e| e.to_string())?;
    conn.execute("delete from Food Where id = ?", (id,)).map_err(|e|e.to_string())?;

    Ok("removed".to_string())
}