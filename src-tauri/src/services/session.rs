use std::sync::Mutex;
use crate::SessionState;

pub fn start(session: &SessionState, session_state: &tauri::State<Mutex<SessionState>>) -> bool {
   let mut session_state = session_state.lock().unwrap();
    *session_state = session.clone();
    
    true
}
pub fn get(session_state: &tauri::State<Mutex<SessionState>>) -> SessionState {
    let session_state = session_state.lock().unwrap();
    session_state.clone()
}
pub fn clear(session_state: &tauri::State<Mutex<SessionState>>) -> bool {
    let mut session_state = session_state.lock().unwrap();

    // TODO find alternative to do this.
    session_state.session_uuid = String::new();
    session_state.workout_name = String::new();
    session_state.start_time = String::new();
    session_state.end_time = String::new();
    session_state.exercises = Vec::new();

    true
}