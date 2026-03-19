use crate::Db;

pub struct CompletedWorkoutDTO {
    pub session_id: String,
    pub started_at: String,
    pub completed_at: String
}

pub fn add_completed_workout(db: &Db,workout: CompletedWorkoutDTO) -> bool {
    let conn = db.conn.lock().unwrap();

    let result = conn.execute("INSERT INTO workoutHistory(SessionId,Started_at,Completed_at) VALUES (?1,?2,?3)",
    [workout.session_id,workout.started_at,workout.completed_at]);

    // returns true or false based on if the result has affected anything once.
    match result {
        Ok(rows) => rows == 1,
        Err(_) => false,
    }
}

// pub fn add_completed_exercises(db: &Db, exercises: Vec<Exercise>)