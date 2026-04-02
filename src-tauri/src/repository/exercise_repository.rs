use rusqlite::{Error};
use crate::domain::{Exercise, ExerciseRepo};
use crate::domain::Exercises;
use crate::infrastructures::sqlite::Db;


pub struct ExerciseRepository {
    db: Db,
}
impl ExerciseRepo for ExerciseRepository {
    fn new(db: Db) -> Self {
        Self {
            db
        }
    }

    // queries database and returns a list of all exercises.
    fn list(&self) -> Result<Exercises, Error> {
        self.db.use_conn(|tx| {
            let mut stmt = tx.prepare(
                "SELECT * FROM exercises"
            )?;

            let rows = stmt.query_map([], map_records)?;
            rows.collect()
        })
    }

    // returns a filtered list based on the muscle group given.
    fn filtered_list(&self, muscle_group: &str) -> Result<Exercises, Error> {
        let query = format!(
            "SELECT * FROM exercises WHERE targetMuscles = '[\"{}\"]'",
            muscle_group
        );

        self.db.use_conn(|tx| {
            let mut stmt = tx.prepare(&query)?;

            let rows = stmt.query_map([], map_records)?;
            rows.collect()
        })
    }
}


// removing duplication
fn map_records(row: &rusqlite::Row) -> Result<Exercise, Error> {
    Ok(Exercise {
        exercise_id: row.get(0)?,
        name: row.get(1)?,
        gif_url: row.get(2)?,
        target_muscles: row.get(3)?,
        body_parts: row.get(4)?,
        equipments: row.get(5)?,
        secondary_muscles: row.get(6)?,
        instructions: row.get(7)?,
    })
}