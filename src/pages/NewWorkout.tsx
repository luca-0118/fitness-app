import GreenAddButton from "../components/GreenAddButton.tsx";
import { invoke } from '@tauri-apps/api/core'

export default function NewWorkout() {

    return (
        <>
            <GreenAddButton to="/add-exercises"/>
        </>
    );
}