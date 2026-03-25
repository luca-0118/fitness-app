import { useLocation } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";

export default function ExerciseDescription() {
  const [id, setId] = useState<string>("");
  const location = useLocation();
  const [name, setName] = useState<string>("");
  const [bodyParts, setBodyParts] = useState<string>("");
  const [equipments, setEquipments] = useState<string>("");
  const [gif, setgif] = useState<string>("");
  const [instructions, setInstructions] = useState<string>("");
  const [secondaryMuscles, setSecondaryMuscles] = useState<string>("");
  const [targetMuscle, setTargetMuscle] = useState<string>("");

  useEffect(() => {
    setId(location.state.id);
  }, []);

  useEffect(() => {
    getExerciseById();
  }, [id]);

  interface ExerciseResponse {
    data: {
      body_parts: string;
      equipments: string;
      gif_url: string;
      instructions: string;
      name: string;
      secondary_muscles: string;
      target_muscles: string;
    };
    ok: boolean;
  }
  async function getExerciseById() {
    try {
      const res = await invoke<ExerciseResponse>("get_exercise_by_id", {
        exerciseId: id,
      });
      setBodyParts(res.data.body_parts);
      setEquipments(res.data.equipments);
      setgif(res.data.gif_url);
      setInstructions(res.data.instructions);
      setName(res.data.name);
      setSecondaryMuscles(res.data.secondary_muscles);
      setTargetMuscle(res.data.target_muscles);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      {" "}
      <div>{bodyParts}</div>
      <div>{equipments}</div>
      <div>{name}</div>
      <div>{gif}</div>
      <div>{instructions}</div>
      <div>{name}</div>
      <div>{secondaryMuscles}</div>
      <div>{targetMuscle}</div>
    </>
  );
}
