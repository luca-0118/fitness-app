#[derive(Clone)]
pub struct Exercise {
    pub exercise_id: String,
    pub name: String,
    pub gif_url: String,
    pub target_muscles: String,
    pub body_parts: String,
    pub equipments: String,
    pub secondary_muscles: String,
    pub instructions: Option<String>,
}

pub type Exercises = Vec<Exercise>;

impl Exercise {}