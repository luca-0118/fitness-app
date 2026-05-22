import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check"
import { invoke } from "@tauri-apps/api/core";
import { ReactElement, useState } from "react";
import ExerciseSelectionButton from "../buttons/ExerciseSelectionButton";


export default function ExerciseAndOverlayItem({
  name,
  id,
  gif,
  onSelect,
  onUnselect,
  selected
}: {
  name: string;
  id: string;
  gif: string;
  onSelect: () => void;
  onUnselect: () => void;
  selected: boolean
}) {
  const [equipments, setEquipments] = useState<string[]>([]);
  const [instructions, setInstructions] = useState<string[]>([]);
  const [secondaryMuscles, setSecondaryMuscles] = useState<string[]>([]);
  const [targetMuscle, setTargetMuscle] = useState<string[]>([]);
  const [toggle, setToggle] = useState(false);

  // used to imply the state of the current button.
  const isSelected = selected ? "selected" : "default";
  const [addButtonState, setAddButtonState] = useState<"default" | "selected" | "freshSelect">(isSelected);


  interface ExerciseResponse {
    data: {
      gif_url: string;
      equipments: string;
      instructions: string;
      secondary_muscles: string;
      target_muscles: string;
    };
    ok: boolean;
  }
  async function getExerciseById() {
    if (id !== "") {
      try {
        const res = await invoke<ExerciseResponse>("get_exercise_by_id", {
          exerciseId: id,
        });
        setEquipments(JSON.parse(res.data.equipments));
        setInstructions(JSON.parse(res.data.instructions));
        setSecondaryMuscles(JSON.parse(res.data.secondary_muscles));
        setTargetMuscle(JSON.parse(res.data.target_muscles));
      } catch (err) {
        console.error(err);
        console.log(err);
      }
    }
  }

  function handleToggleClick() {
    setToggle(!toggle);
    getExerciseById();
  }

  function handleAddClick() {
    setToggle(false);
    onSelect();
  }


  //Handles save click, adds to list and sets checkmark for a second.
  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!onSelect || addButtonState == "freshSelect") return;

    //fires the unselect funtion if the button is already in the exercise is already selected.
    if (addButtonState == "selected") {
      setAddButtonState("default");
      return onUnselect();
    }

    console.log("selected event and added to the list.");
    onSelect();
    setAddButtonState("freshSelect");

    setTimeout(() => {
      setAddButtonState("selected");
    }, 2000);
  }

  return (
    <div>
      <li
        className={`bg-components border-bordercolor border rounded-xl  z-300 flex w-full items-center hover:bg-components-hover active:bg-components-hover transition-transform duration-100 ease-in-out `}
      >
        <div
          className="flex w-full  justify-between"
          onClick={() => handleToggleClick()}
        >
          <img
            className="h-20 w-20 contain-content rounded-xl"
            src={gif}
            alt=""
            loading="lazy"
          />
          <h2 className="text-lg ml-5 font-semibold text-textcolor">{name}</h2>
          <ExerciseSelectionButton buttonState={addButtonState} onClick={(e) => {
            e.stopPropagation();
            handleClick(e);
          }} />

        </div>
      </li>
      <Overlay
        active={toggle}
        name={name}
        gif={gif}
        targetMuscle={targetMuscle}
        secondaryMuscles={secondaryMuscles}
        equipments={equipments}
        instructions={instructions}
        handleAddClick={handleAddClick}
        disableOverlay={() => { setToggle(false) }}
      />
    </div>
  );
}


interface OverlayProps {
  active: boolean;
  name: string;
  gif: string;
  targetMuscle: string[];
  secondaryMuscles: string[];
  equipments: string[];
  instructions: string[];
  handleAddClick: () => void;
  disableOverlay: () => void;
}
function Overlay({ active, name, gif, targetMuscle, secondaryMuscles, equipments, instructions, handleAddClick, disableOverlay }: OverlayProps): ReactElement {

  if (!active) return <></>;

  return (
    <div className="fixed inset-0 z-50 bg-background flex justify-center items-start overflow-y-auto">
      <div className="w-[90%] max-w-3xl mt-20 mb-35 bg-components border border-bordercolor rounded-xl p-6 font-bold">

        <h2 className="text-textcolor text-2xl mb-2 border-b-2 border-bordercolor">
          {name.charAt(0).toUpperCase() + name.slice(1)}
        </h2>

        <img src={gif} alt="" loading="lazy" className="w-full rounded-lg" />

        <h2 className="text-textcolor text-2xl mt-5 border-b-2 border-bordercolor">
          Targeted muscles:
        </h2>

        <div className="bg-accent w-fit px-6 py-1 rounded-xl mx-auto my-2">
          {targetMuscle}
        </div>

        <div className="grid grid-cols-2 text-center">
          {secondaryMuscles.map((muscle, index) => (
            <div
              key={index}
              className="border-accent border px-3 text-xs py-1 rounded-xl mx-2 my-1 text-textcolor"
            >
              {muscle}
            </div>
          ))}
        </div>

        <h2 className="text-textcolor text-2xl mt-5 border-b-2 border-bordercolor">
          Equipment
        </h2>

        <div className="bg-accent w-fit px-6 py-1 rounded-xl mx-2 my-2">
          {equipments}
        </div>

        <h2 className="text-textcolor text-2xl mt-5 border-b-2 border-bordercolor">
          Instructions
        </h2>

        {instructions.map((instruct, index) => (
          <div key={index} className="mx-2 my-2 font-normal text-textcolor">
            <div className="font-bold ">
              Step {index + 1}
            </div>
            {instruct.replace(/^.*Step:\d+\s*/, "")}
          </div>
        ))}

        <div className="w-full flex justify-center items-center gap-4 pt-4">
          <button
            className="flex items-center justify-center h-12 px-6 rounded-full text-textcolor bg-accent hover:bg-accent-action"
            onClick={disableOverlay}
          >
            Close
          </button>

          <button
            onClick={handleAddClick}
            className="flex items-center justify-center h-12 w-12 rounded-full bg-accent hover:bg-accent-action text-textcolor"
          >
            <AddIcon sx={{ fontSize: 40 }} />
          </button>
        </div>
      </div>
    </div>
  );
}