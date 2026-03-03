import GreenAddButton from "../components/GreenAddButton.tsx";
import HeaderSave from "../components/HeaderSave.tsx";

export default function NewWorkout() {
    return (
        <>
            <HeaderSave />
            <GreenAddButton to="/add-exercises"/>
        </>
    );
}