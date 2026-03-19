export default function Filter({
  gif,
  isSelected,
  onClick,
}: {
  gif: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <div className="p-2">
      <button
        className={isSelected ? "outline-1 outline-[#F67631]" : "outline-0"}
        onClick={onClick}
      >
        <img className="min-w-15 w-15 contain-content" src={gif} alt="" />
      </button>
    </div>
  );
}
