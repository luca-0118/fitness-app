import { invoke } from "@tauri-apps/api/core"
import { useEffect, useState } from "react";

interface WorkoutSessionResponse {
  ok: boolean;
  data: WorkoutSession;
}

interface WorkoutSession {
  session_uuid: string;
  workout_uuid: string;
  workout_name: string;
  start_time: string;
  end_time: string;
  exercises: Exercise[];
}

export interface Exercise {
  exercise_id: string;
  completed_id: string;
  name: string;
  body_part: string; // JSON-encoded array string, e.g. '["neck"]'
  gif_url: string;
  sets: ExerciseSet[];
}

export interface ExerciseSet {
  type: string;
  reps: number;
  weight: number;
}



/**
 * Gets a completed session with all completed exercises and such data.
 */
export default function useCompletedSession(sessionId:string) {
    const [completedSession,setCompletedSession] = useState<WorkoutSession| null>(null);
    
    const fetchSession = async () => {
        const resp = await invoke<WorkoutSessionResponse>("get_detailed_session_history",{req:sessionId});
        console.log(resp);

        if (resp.ok) {
            setCompletedSession(resp.data);
        } 
    }

    useEffect(() => {
      fetchSession();

    },[sessionId]);

    return completedSession;
}


