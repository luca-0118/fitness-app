mod api;
mod dto;
use rusqlite::{Connection, Result};
use std::sync::Mutex;
struct Db {
    conn: Mutex<Connection>,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let conn = Connection::open("../public/testbase.sqlite").expect("Failed to open database");

    conn.execute(
        "CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            age INTEGER
        )",
        [],
    )
    .expect("failed to initialize schema");

    tauri::Builder::default()
        .manage(Db {
            conn: Mutex::new(conn),
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .invoke_handler(tauri::generate_handler![add_user])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn add_user(
    input_name: String,
    db: tauri::State<Db>,
) -> Result<api::ApiResponse<String>, api::ApiErrorResponse> {
    if input_name.trim().is_empty() {
        return Err(api::ApiError::InvalidInput.into());
    }

    //makes the function wait until it can sucessfully find the connection.
    //if found, lets us use it
    let conn = db.conn.lock().map_err(|_| api::ApiError::DatabaseError)?;

    let test = dto::User {
        name: input_name,
        age: 32,
    };

    conn.execute(
        "INSERT INTO users (name, age) VALUES (?1, ?2)",
        (&test.name, &test.age),
    )
    .map_err(|_e| api::ApiError::DatabaseError)?;

    Ok(api::ApiResponse {
        ok: true,
        data: format!("User {} Successfully added!", { test.name }),
    })
}
