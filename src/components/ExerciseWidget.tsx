interface ExerciseWidgetProps {
  name: string;
  gif: string;
  id: string;
}

export default function ExerciseWidget({ name, gif, id }: ExerciseWidgetProps) {
  return (
    <div className="bg-[#1E1E1E] border-[#414141] border rounded-xl px-2 mb-3 flex w-[90%] items-center mx-auto hover:bg-[#252525] active:bg-[#252525] cursor-pointer mt-2">
      {name}
      {gif}
      {id}
    </div>
  );
}
