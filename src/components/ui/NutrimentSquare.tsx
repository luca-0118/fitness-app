interface NutrimentSquareProps {
    name: string;
    value: string;
    color: string;
    size?: number;
}

function defineColorType(color: string): { type: "tw" | "hex", color: string } {
    if (!color.startsWith("#")) return {
        type: "tw",
        color
    }
    return {
        type: "hex",
        color
    }

}

export default function NutrimentSquare({ name, value, color, size = 1 }: NutrimentSquareProps) {
    const newColor = defineColorType(color);
    const twColor = newColor.type === "tw" ? newColor.color : "";
    const hexColor = newColor.type === "hex" ? newColor.color : "";


    return <div className={`border-2 rounded-xl p-5  flex flex-col items-center justify-center col-span-${size} border-${twColor}`} style={{ borderColor: hexColor }}>
        <div className={`font-semibold block text-${twColor}`} style={{ color: hexColor }}>
            {name}
        </div>
        <div className="text-textcolor inline-flex items-baseline">
            {value}g
        </div>
    </div>
}