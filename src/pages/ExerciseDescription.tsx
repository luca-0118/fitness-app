import { useLocation } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import API from "../classes/api";

export default function ExerciseDescription() {
  const [id, setId] = useState<string>("");
  const location = useLocation();
  const [name, setName] = useState<string>("");
  const [equipments, setEquipments] = useState<string[]>([]);
  const [gif, setgif] = useState<string | undefined>(undefined);
  const [instructions, setInstructions] = useState<string[]>([]);
  const [secondaryMuscles, setSecondaryMuscles] = useState<string[]>([]);
  const [targetMuscle, setTargetMuscle] = useState<string[]>([]);
  const [error, setError] = useState<Boolean>(false);

  useEffect(() => {
    setId(location.state.id);
  }, []);

  useEffect(() => {
    getExerciseById();
  }, [id]);

  interface ExerciseResponse {
    data: {
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
    if (id !== "") {
      try {
        const res = await API.exercises.get(id);

        setEquipments(JSON.parse(res.equipments));
        setgif(res.gif_url);
        setInstructions(JSON.parse(res.instructions));
        setName(res.name);
        setSecondaryMuscles(JSON.parse(res.secondary_muscles));
        setTargetMuscle(JSON.parse(res.target_muscles));
      } catch (err) {
        console.error(err);
        setError(true);
      }
    }
  }

  if (!error) {
    return (
      <div
        className="
    fixed inset-0 
    top-15
    bottom-15
    bg-[#1E1E1E] 
    overflow-y-auto
    pt-[env(safe-area-inset-top)]
    pb-[env(safe-area-inset-bottom)]
  "
      >
        <div className="grid grid-cols-2 gap-4 py-4 w-[90%] mx-auto">
          <div className="col-span-2 bg-[#1E1E1E] border border-[#414141] rounded-xl p-6 font-bold flex flex-col pb-10 ">
            <h2 className="font-bold text-[#F2F3F2] text-2xl  mb-2 border-b-2 border-[#414141] w-[90%] flex mx-auto">
              <div>{name.charAt(0).toUpperCase() + name.slice(1)}</div>
            </h2>
            <img src={gif} alt="" />

            <h2 className="font-bold text-[#F2F3F2] text-2xl  mb-2 border-b-2 border-[#414141] w-[90%] flex mx-auto mt-5">
              Targeted muscles:
            </h2>
            <div className="bg-[#F67631] w-fit px-9 py-1 rounded-xl mx-2 my-1 self-center">
              {targetMuscle}
            </div>
            <div className="grid grid-cols-2 text-center">
              {secondaryMuscles.map((muscle, index) => {
                return (
                  <div
                    key={index}
                    className="border-[#F67631] border px-5 text-xs py-1 rounded-xl max-w-full mx-2 my-1 "
                  >
                    {muscle}
                  </div>
                );
              })}
            </div>
            <h2 className="font-bold text-[#F2F3F2] text-2xl  mb-2 border-b-2 border-[#414141] w-[90%] flex mx-auto mt-5">
              Equipment
            </h2>
            <div className="bg-[#F67631] w-fit px-9 py-1 rounded-xl mx-2 my-1">
              {equipments}
            </div>
            <h2 className="font-bold text-[#F2F3F2] text-2xl  mb-2 border-b-2 border-[#414141] w-[90%] flex mx-auto mt-5">
              Instructions
            </h2>
            {instructions.map((instruct, index) => {
              return (
                <div
                  key={index}
                  className=" self-start w-fit px-3 rounded-xl mx-2 my-1 font-normal"
                >
                  <div className="font-bold">Step {index + 1}</div>
                  {instruct.replace(/^.*Step:\d+\s*/, "")}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  } else
    return (
      <div className="mx-auto w-full max-w-sm rounded-md border p-4 h-full">
        <div className="flex animate-pulse space-x-4">
          <div className="flex-1 space-y-6 py-1">
            <div className="rounded bg-gray-200 h-full"></div>
            <div className=" rounded bg-gray-200 h-[400%]"></div>
            <div className=" rounded bg-gray-200 h-full"></div>
            <div className="rounded bg-gray-200 h-full"></div>
          </div>
        </div>
      </div>
    );
}
