use crate::domain::{
    CompletedWorkout, CompletedWorkouts, DetailedWorkout, Exercises, Workout, Workouts,
};
use crate::infrastructures::sqlite::Db;
use rusqlite::Error;

pub struct CreateWorkoutParams {
    pub uuid: String,
    pub name: String,
    pub desc: String,
}

pub struct SaveSessionParams {
    pub session_id: String,
    pub workout_id: String,
    pub started_at: String,
    pub completed_at: String,
}

pub trait WorkoutRepo {
    fn new(db: Db) -> Self;
    fn list(&self) -> Result<Workouts, Error>;
    fn create(&self, create_workout_dto: CreateWorkoutParams) -> Result<bool, Error>;
    fn remove(&self, workout_id: String) -> Result<bool, Error>;
}

pub trait ExerciseRepo {
    fn new(db: Db) -> Self; // queries database and returns a list of all exercises.
    fn list(
        &self,
        page_size: i32,
        offset: i32,
        filter: Option<&str>,
        query: Option<&str>,
    ) -> Result<Exercises, Error>; // returns a filtered list based on the muscle group given.
}

pub trait WorkoutExerciseRepo {
    fn new(db: Db) -> Self;
    fn get_detailed(&self, workout_id: &str) -> Result<Workout, Error>; // links exercises in a single bulk query.
    fn link(&self, workout_id: String, exercise_ids: Vec<String>) -> Result<bool, Error>;
}

pub trait WorkoutHistoryRepo {
    fn new(db: Db) -> Self;
    fn add(&self, session: SaveSessionParams) -> Result<bool, Error>;
    fn get_history(&self) -> Result<CompletedWorkouts, Error>;
    fn get_by_id(&self, session_id: &str) -> Result<DetailedWorkout, Error>;
}

pub struct AddWeighedSetParams {
    pub completed_exercise_id: String,
    pub reps: i64,
    pub weight: f64,
    pub time_completed: String,
}
pub struct AddTimedSetParams {
    pub completed_exercise_id: String,
    pub time: f64,
    pub distance: f64,
    pub time_completed: String,
}

pub struct AddExerciseParams {
    pub exercise_id: String,
    pub session_id: String,
}

pub trait CompletedExerciseRepo {
    fn new(db: Db) -> Self;
    fn add_weighted_set(&self, req: AddWeighedSetParams) -> Result<String, Error>;
    fn add_timed_set(&self, req: AddTimedSetParams) -> Result<String, Error>;
    fn add_exercise(&self, req: AddExerciseParams) -> Result<String, Error>;
}
