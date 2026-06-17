import { ChangeEvent, MouseEventHandler, useRef, useState } from "react";

interface SetInputProps {
    onChange: (setAmt: number) => void
    defaultVal?: number;
    disabled?: boolean;
}
export default function SetInput({onChange,defaultVal,disabled}:SetInputProps): React.ReactNode {
  const [LOWEST_VAL, HIGHEST_VAL] = [0, 99];
  const STEP_SIZE = 1;
  //#TODO tantoe harde hardcode
  const [state, setState] = useState<string>(defaultVal?.toString()||"3");
  const inputRef = useRef<HTMLInputElement>(null);

  const updateState = (val: number) => {
    setState(String(val));
    onChange(val);
  }

  const handleInput = (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "") return setState("");
    if (!/^\d+$/.test(val)) return; // block non-numeric
    const num = Number(val);
    if (num > HIGHEST_VAL) return updateState(HIGHEST_VAL);
    if (num < LOWEST_VAL) updateState(LOWEST_VAL);
    updateState(num);
  }


  const handleElClick = (e:  React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    inputRef.current?.focus();
  }

  return <div className="flex ml-5 flex-row gap-2 border border-[#333737] w-fit rounded p-1 relative" onClick={handleElClick}>
    <input id={"settest"}
           className={"text-textcolor text-right appearance-none min-w-2 max-w10 w-[2ch]"}

           type={"text"}
           inputMode={"numeric"}
           pattern="[0-9]*"
           min={LOWEST_VAL} max={HIGHEST_VAL}
           step={STEP_SIZE}
           placeholder={LOWEST_VAL.toString()}
           onChange={handleInput}
           value={state}
           maxLength={2}
           ref={inputRef}
           disabled={disabled}
    />
    <label className={"text-[#979595]"}>Sets</label>
  </div>;
}