use tauri::State;

use crate::Ctx;

#[derive(Debug)]
struct CompletedExercise {
    pub reps: f64,
    pub weight: f64,
}

#[tauri::command]
pub fn create_predictive_graph(ctx: State<Ctx>, exercise_id: String) {
    let _exercise_sets =
        get_exercise_sets(&ctx, &exercise_id).expect("failed to get exercise sets");

    println!("printing current data: {:?}", _exercise_sets);
}

// Get all sets done of an exercise
fn get_exercise_sets(
    ctx: &Ctx,
    compl_exerc_id: &str,
) -> Result<Vec<CompletedExercise>, rusqlite::Error> {
    ctx.db.use_conn(|tx| {
        let mut stmt = tx.prepare(
            "  SELECT  CWE.completedExerciseId, CWE.weight, CWE.reps
                    FROM completedWeightExercises CWE
                    INNER JOIN completedExercises CE ON CE.ID = CWE.completedExerciseId
                    WHERE CE.exerciseId = ?1
                    ORDER BY completedExerciseId desc",
        )?;

        let resp = stmt.query_map([compl_exerc_id], |row| {
            Ok(CompletedExercise {
                reps: row.get(0)?,
                weight: row.get(1)?,
            })
        })?;

        let data: Vec<CompletedExercise> = resp.collect::<Result<Vec<_>, _>>()?;
        Ok(data)
    })
}

// Group all exercises to sets
// Get the highest e1RM
// Plot in regression
// Estimate next highest value
