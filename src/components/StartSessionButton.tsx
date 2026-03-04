import { useNavigate } from "react-router-dom";

export default function StartSessionButton() {
    const navigate = useNavigate();
    return (
        <>
            <div className="flex font-bold">
                    <button
                        onClick={() => navigate("/session")}
                        className="bg-[#1E1E1E] border-[#414141] border rounded-xl p-5 w-[90%] mx-auto hover:bg-[#252525]"
                        >
                        Start Session
                    </button>
            </div>
        </>
    )
}