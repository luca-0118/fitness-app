use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
    pub struct Workout {
        pub uuid: String,
        pub name: String,
        pub desc: Option<String>,
    }