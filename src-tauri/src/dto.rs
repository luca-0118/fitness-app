use serde::{Deserialize, Serialize};

// DTO's, Data Transfer Objects, are what we are sending back and forth from database to frontend.
// These structs are used to give them form. Serialize allows us to use them

// #[derive(Debug, Serialize)]
// pub struct WorkoutExercises {
//     pub workout_id: u32,
//     pub exercise_id: u32,
// }
#[derive(Debug, Serialize, Deserialize)]
pub struct Workout {
    pub name: String,
    pub desc: Option<String>,
}
