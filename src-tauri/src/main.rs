// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    let connection = rusqlite::Connection::open("test.db").unwrap();

    connection.execute("
    CREATE TABLE IF NOT EXISTS exercises (
    exerciseId TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    gifUrl TEXT,
    targetMuscles TEXT,    
    bodyParts TEXT,        
    equipments TEXT,       
    secondaryMuscles TEXT, 
    instructions TEXT      
);
    ", []).unwrap();


    connection.execute("
    
    
   INSERT OR IGNORE INTO exercises(
    exerciseId,
    name,
    gifUrl,
    targetMuscles,
    bodyParts,
    equipments,
    secondaryMuscles
) VALUES
(
    'trmte8s',
    'band shrug',
    'https://static.exercisedb.dev/media/trmte8s.gif',
    'traps',
    'neck',
    'band',
    'shoulders'
),

(
    'trmte8ss',
    'band shrugsadf',
    'https://static.exercisedb.dev/media/trmte8s.gif',
    'traps',
    'neck',
    'band',
    'shoulders'
)
    ", []).unwrap();

    fitness_app_lib::run();
}