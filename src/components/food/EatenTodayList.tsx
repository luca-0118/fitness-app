import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function EatenTodayList() {
    return (
        <div className="bg-components border border-bordercolor rounded-xl p-6 col-span-2 items-center">
            <h2 className="flex border-b-2 border-bordercolor w-full text-center mb-4 font-bold text-lg text-textcolor justify-between">
                <button
                    className="flex left-0 cursor-pointer text-textcolor"
                >
                    <ArrowBackIcon sx={{ fontSize: 32 }} />
                </button>
                Eaten today
                <button
                    className="flex left-0 cursor-pointer text-textcolor"
                >
                    <ArrowForwardIcon sx={{ fontSize: 32 }} />
                </button>
            </h2>
        </div>
    )
}
