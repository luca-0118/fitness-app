use crate::domain::exercise::Exercise;

#[derive(Clone)]
pub struct Workout {
    pub uuid: String,
    pub name: String,
    pub desc: Option<String>,
    pub exercises: Vec<Exercise>,
}

pub type Workouts = Vec<Workout>;

impl Workout {}
