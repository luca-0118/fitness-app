#[derive(Debug)]
pub struct Exercise {
    name: String,
    gif_url: String,
    target_muscles: String,
    body_parts: String, 
    equipments: String,
    secondary_muscles: String
}

#[tauri::command]
pub fn return_exercise(exercise_id: &str) -> Exercise {
    let connection = rusqlite::Connection::open("test.db").unwrap();
    let mut query = connection
        .prepare("SELECT * FROM exercises WHERE exerciseid = ?1")
        .unwrap();
    
    let mut rows = query.query([exercise_id]).unwrap();

    if let Some(row) = rows.next().unwrap() {
        let id: String = row.get(0).unwrap(); 
        let name: String = row.get(1).unwrap();
        let gif_url: String = row.get(2).unwrap();
        let target_muscles: String = row.get(3).unwrap();
        let body_parts: String = row.get(4).unwrap();
        let equipments: String = row.get(5).unwrap();
        let secondary_muscles: String = row.get(6).unwrap();

        return Exercise{
        name: name,
        gif_url: gif_url,
        target_muscles: target_muscles,
        body_parts: body_parts,
        equipments: equipments,
        secondary_muscles: secondary_muscles
        }
    }
    else {return Exercise{
    name: "fout".to_string(),
    gif_url: "fout".to_string(),
    target_muscles: "fout".to_string(),
    body_parts: "fout".to_string(), 
    equipments: "fout".to_string(),
    secondary_muscles: "fout".to_string()
}
}
}
