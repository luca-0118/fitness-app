import React, { useRef, useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';

interface CalorieGoalInputProps {
    SaveFunction?: () => Promise<boolean>;
    defaultValue?: number;
    onValueUpdate?: (e: React.InputEvent) => void;
}

export default function CalorieGoalInput({SaveFunction,defaultValue, onValueUpdate}: CalorieGoalInputProps): React.ReactNode {
    const inputRef = useRef<HTMLInputElement|null>(null);
    const [savedSuccessfully,setsavedSucessfully] = useState<boolean>(false);
    const [loading,isLoading] = useState<boolean>(false);

    // Checks if you are not focused on the input element, 
    // focus on the input element.
    const focusRef = (e: React.MouseEvent) => {
        if (!inputRef.current) return;
        e.preventDefault();
        if (document.activeElement !== inputRef.current) {
            inputRef.current.focus();
        }
    }

    //When clicking/tapping out of the focus element, fire the value update function.
    const onFocusExit = async() => {
        if(!SaveFunction) {
            updateEditIcon();
            return console.warn("no saving function given for this input.");
        }

        isLoading(true);

        //waits for the function, if resp is good, update icon, otherwise error and stop loading.
        SaveFunction()
        .then((resp) => {
            resp ? updateEditIcon() : console.error("input didn't update.");
        })
        .finally(() => {
            isLoading(false);
        })
    }

    //changed the Icon temporarily.
    const updateEditIcon = () => {
        setsavedSucessfully(true);
        
        setTimeout(() => {
            setsavedSucessfully(false)
        },1000);
    }

    return(
    <div className="CalorieGoalInput w-full flex items-end flex-row bg-components border-bordercolor rounded border px-2 py-2 mx-auto text-textcolor" onMouseDown={focusRef}>
        <input ref={inputRef} onBlur={onFocusExit} type="text" className="clear field-sizing-content!" placeholder="(2000)" defaultValue={defaultValue ?? 2300} onInput={onValueUpdate} />
        <p className="ml-2 w-full flex-1 text-sm text-accent pointer-events-none select-none">Calories per day</p>
        {savedSuccessfully ? <CheckCircleIcon className="text-green-500 pointer-events-none select-none"/> : null }
        {!savedSuccessfully&& !loading ? <EditIcon/> : null}
        {loading ? <PendingIcon className="text-accent-action"/> : null}
    </div>);
}