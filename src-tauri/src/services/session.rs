use std::sync::Mutex;
use crate::models;

pub fn start(session: &models::Session, session_state: tauri::State<Mutex<models::Session>>) -> bool {
   let mut session_state = session_state.lock().unwrap();
    *session_state = session.clone();
    return true;
}
pub fn get(session_state: tauri::State<Mutex<models::Session>>) -> models::Session {
    let session_state = session_state.lock().unwrap();
    session_state.clone()
}