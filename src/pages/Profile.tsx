import ThemeButton from "../components/ThemeButton.tsx";

export default function Profile() {
    return (
        <>
            <div className="bg-components border-bordercolor border rounded-xl py-4 px-6 mb-3 flex-row w-[90%] mx-auto mt-2 text-textcolor">
                <h2 className="border-b border-bordercolor font-bold w-full py-2">Gegevens</h2>
            </div>
            <div className="bg-components border-bordercolor border rounded-xl py-4 px-6 mb-3 flex-row w-[90%] mx-auto text-textcolor">
                <h2 className="border-b border-bordercolor font-bold w-full py-2">Instellingen</h2>
                <div className="grid grid-cols-2 gap-4 pt-2">
                    <ThemeButton />
                </div>
            </div>
        </>
    );
}
