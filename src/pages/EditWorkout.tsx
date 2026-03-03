import GreenAddButton from "../components/GreenAddButton.tsx";
import HeaderSave from "../components/HeaderSave.tsx";

export default function EditWorkout() {
  return (
    <>
      <HeaderSave />
      <GreenAddButton to="/exercises"/>
    </>
  );
}
