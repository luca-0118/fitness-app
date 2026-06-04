import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

type CalendarProps = {
    onDateChange?: (date: Date) => void;
};

export default function Calender({ onDateChange }: CalendarProps){
    
    function handleDateClick(dateString: string){
        console.log(dateString)
        if (onDateChange) {
            const selectedDate = new Date(dateString);
            onDateChange(selectedDate);
        }
    }

    return (
    <button id="DatePicker" className="relative contain-content">
        <input onChange={(e)=>handleDateClick(e.target.value)} type="date" className="opacity-0 w-full absolute" />
        <CalendarMonthIcon className=''/>
    </button>
    )

}