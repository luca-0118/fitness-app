interface FilterProps {
  gif: string;
  isSelected: boolean;
  onClick: () => void;
}

export default function WorkoutFilter({ gif, isSelected, onClick }: FilterProps) {
  return (
    <div className="p-2">
      <button
        className={isSelected ? "outline-1 outline-accent" : "outline-0"}
        onClick={onClick}
      >
        <img className="min-w-15 w-15 contain-content" src={gif} alt="" />
      </button>
    </div>
  );
}
