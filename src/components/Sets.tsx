import React from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import { IUseSetUpdateFunction } from "../Hooks/UseSetUpdate.ts";
import WeightedSetForm from "./WeightedSetForm.tsx";
import TimedSetForm from "./TimedSetForm.tsx";
import type { WeightedSetFormProps } from "./WeightedSetForm.tsx";

interface SetsProps {
    setNumber?: number;
    onDelete?: () => void;
    updateFunction: IUseSetUpdateFunction
    data: IWeightedSet | ITimedSet
}

/**
 * OCP: Adding a new set type only requires creating a new form component and
 * registering it here — the Sets dispatcher itself never changes.
 */
type SetFormComponent = React.ComponentType<WeightedSetFormProps>;

const SET_FORM_REGISTRY: Partial<Record<string, SetFormComponent>> = {
    Weighted: WeightedSetForm,
    Timed: TimedSetForm,
};

export default function Sets({updateFunction, setNumber = 1, onDelete, data }: SetsProps) {
    const FormComponent = SET_FORM_REGISTRY[data.type];
    if (!FormComponent) return null;

    return (
        <OuterLayer set_nr={setNumber} onDelete={onDelete || (() => {})}>
            <FormComponent
                updateFunction={updateFunction}
                setNumber={setNumber}
                data={data}
            />
        </OuterLayer>
    );
}

interface outerLayerProps {
    children: React.ReactNode;
    set_nr: number;
    onDelete: () => void;
}
function OuterLayer({children,set_nr,onDelete}:outerLayerProps) {
    return (
        <div className="border-t border-[#565d5d] pt-4 mt-3">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-lg font-semibold">Set {set_nr}</h3>
                {onDelete && set_nr > 3 && (
                    <button
                        onClick={onDelete}
                        className="text-red-500 hover:text-red-400 active:text-red-400 cursor-pointer transition-colors"
                        title="Delete set"
                    >
                        <DeleteIcon sx={{ fontSize: 24 }} />
                    </button>
                )}
            </div>
            {children}
        </div>
    );   
}