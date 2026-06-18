use crate::domain::Exercises;
use crate::domain::{Exercise, ExerciseRepo};
use crate::infrastructures::sqlite::Db;
use rusqlite::{named_params, Error};

pub struct ExerciseRepository {
    db: Db,
}
impl ExerciseRepo for ExerciseRepository {
    fn new(db: Db) -> Self {
        Self { db }
    }

    fn list(
        &self,
        page_size: i32,
        offset: i32,
        filter: Option<&str>,
        query: Option<&str>,
    ) -> Result<Exercises, Error> {
        self.db.use_conn(|tx| {
            let sql = "
            SELECT * FROM exercises
            WHERE (:muscle_group IS NULL OR targetMuscles = '[\"' || :muscle_group || '\"]')
            AND   (:query        IS NULL OR name LIKE '%' || :query || '%')
            LIMIT :page_size OFFSET :offset
        ";

            let mut stmt = tx.prepare(sql)?;
            let rows = stmt.query_map(
                named_params! {
                    ":muscle_group": filter,
                    ":query":        query,
                    ":page_size":    page_size,
                    ":offset":       offset,
                },
                map_records,
            )?;

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
        set_count: 0
    })
}
