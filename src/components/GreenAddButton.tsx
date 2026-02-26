export default function GreenAddButton() {
    function AddWorkout() {
    }
    return (
        <button
            className="bg-[#40C057] w-10 h-10 rounded-[50%] hover:bg-[#5AEA74] items-center cursor-pointer"
            onClick={() => {AddWorkout}}
        >
        </button>
    )
}