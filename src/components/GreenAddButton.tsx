import { useNavigate } from "react-router-dom";

export default function GreenAddButton() {
    const navigate = useNavigate();

    return (
    <button onClick={() => navigate("/new-workout")}
            className="fixed bottom-20 right-6 h-16 w-16 rounded-full bg-[#40C057] hover:bg-[#5AEA74] flex items-center justify-center z-50">
        <svg xmlns="http://www.w3.org/2000/svg" height="33px" viewBox="0 -960 960 960" width="33px" fill="#FFFFFF" className="">
            <path d="M446.67-120v-326.67H120v-66.66h326.67V-840h66.66v326.67H840v66.66H513.33V-120h-66.66Z"/>
        </svg>
    </button>
    )
}