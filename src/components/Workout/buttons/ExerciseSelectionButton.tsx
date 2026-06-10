import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import RemoveIcon from '@mui/icons-material/Remove';

interface ExerciseSelectionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    buttonState: "default" | "selected" | "freshSelect";
}

/**
 * Very locked in variant of the add button used for the ExerciseAndOverlayItem component. 
 * Shows green when added, 
 * and a red delete option when been added for a little while
 * @param param0 
 * @returns 
 */
export default function ExerciseSelectionButton({ buttonState = "default", ...props }: ExerciseSelectionButtonProps) {

    // returns the icons and the colors based on the given button state.
    const buttonStateIcon = () => {
        switch (buttonState) {
            case "selected":
                return { el: <RemoveIcon sx={{ fontSize: 36 }} />, color: "bg-red-400" }
            case "freshSelect":
                return { el: <CheckIcon sx={{ fontSize: 36 }} />, color: "bg-green-400" }
            default:
                return { el: <AddIcon sx={{ fontSize: 36 }} />, color: "bg-accent hover:bg-accent-action active:bg-accent-action" }
        }
    }

    // actual returned element.
    return <button className=" w-fit  ml-4  z-48 text-textcolor items-center " {...props}>
        <div className={`w-full h-full flex items-center rounded-r ${buttonStateIcon().color}`}>
            {buttonStateIcon().el}
        </div>
    </button>
}