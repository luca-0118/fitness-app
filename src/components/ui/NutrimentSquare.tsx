interface NutrimentSquareProps {
    name: string;
    value: string;
    color: string;
    size?: number;
}

function toTailwindColor(color: string) {
    if (color.startsWith("#")) {
        return `[${color}]`
    }
    else return color;
}

export default function NutrimentSquare({name,value,color, size = 1}:NutrimentSquareProps) {
    const twColor = toTailwindColor(color);

    return <div className={`border-2 rounded-xl p-5  flex flex-col items-center justify-center col-span-${size} border-${twColor}`}>
              <div className={`font-semibold block text-${twColor}`}>
                {name}
              </div>
              <div className="text-textcolor inline-flex items-baseline">
                {value}g
              </div>
            </div>
}