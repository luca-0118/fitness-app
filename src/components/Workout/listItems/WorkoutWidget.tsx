import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useSortable } from "@dnd-kit/react/sortable";
import { useWorkout } from "../../../context/WorkoutContext.tsx";
import API from "../../../classes/api.ts";
import toast from "react-hot-toast";

interface WorkoutWidgetProps {
    id: string;
    index: number;
    name: string;
    reloadWorkouts: () => Promise<void>;
}

export default function WorkoutWidget({ id, index, name, reloadWorkouts }: WorkoutWidgetProps) {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [element, setElement] = useState<HTMLElement | null>(null);
    const handleRef = useRef<HTMLButtonElement | null>(null);
    const { isDragging } = useSortable({ id, index, element, handle: handleRef });
    const { setSelectedWorkout } = useWorkout();

    const dropdownRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function handleMenuClose(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        }

        document.addEventListener("pointerdown", handleMenuClose);
        return () => document.removeEventListener("pointerdown", handleMenuClose);
    }, []);

    const handleNavigation = () => {
        setSelectedWorkout(id);
        navigate("/exercises");
    };

    async function handleDelete() {
        try {
            await API.workouts.remove(id);
            toast.success("removed succesfully")
        }
        catch (err: unknown) {
            if (err instanceof Error) {
                toast.error(err.message);
            } else {
                toast.error("Something went wrong");
            }
        }
    }

    return (
        <li
            ref={setElement}
            className={`bg-components border-bordercolor border rounded-xl px-2 mb-3 flex w-[90%] items-center mx-auto hover:bg-components-hover active:bg-components-hover transition-transform duration-100 ease-in-out ${isDragging ? "opacity-80 scale-[1.05]" : ""} `}
            data-shadow={isDragging || undefined}
        >
            <button ref={handleRef} className="cursor-grab">
                <DragIndicatorIcon sx={{ fontSize: 40 }} className="text-accent" />
            </button>

            <button className="text-left cursor-pointer w-full h-full py-4" onClick={() => handleNavigation()}>
                <h2 className="text-lg font-semibold text-textcolor">{name}</h2>
            </button>

            <div ref={dropdownRef} className="ml-auto cursor-pointer relative text-textcolor" onClick={() => setOpen((prev) => !prev)}>
                <MoreVertIcon sx={{ fontSize: 40 }} />
                <div className={`absolute z-10 top-full right-1 mt-1 flex flex-col rounded-xl p-2 bg-components border border-bordercolor transform transition-all duration-100 ease-out origin-top-right 
                ${open ? "opacity-100 scale-100" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}`}>
                    <button className="w-full hover:bg-components-hover flex items-center gap-2 px-3 py-2 rounded-xl" onClick={() => { setOpen(false); navigate(`${id}/edit`); }}>
                        <EditIcon className="w-5 h-5" /> Edit
                    </button>
                    <button className="w-full hover:bg-components-hover text-button-stop flex items-center gap-2 px-3 py-2 rounded-xl" onClick={async () => {
                        setOpen(false);
                        await handleDelete();
                        await reloadWorkouts();

                    } /*TODO add delete functionality*/}>
                        <DeleteIcon className="w-5 h-5" /> Delete
                    </button>
                </div>
            </div>
        </li>
    );
}
