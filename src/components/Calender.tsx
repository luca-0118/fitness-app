import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { invoke } from '@tauri-apps/api/core';


export default function Calender(){
    
    async function handleDateClick(date:String){
        let food = await invoke("get_food_by_date", {date: date})
        console.log(food)
    }

    return (
    <button id="DatePicker" className="relative">
        <input onChange={(e)=>handleDateClick(e.target.value)} type="date" className="opacity-0 w-full absolute" />
        <CalendarMonthIcon className=''/>
    </button>
    )

}