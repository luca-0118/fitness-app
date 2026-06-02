import { useTheme } from "../../../theme/ThemeProvider.tsx";
import { useRef, useState } from "react";

export default function ThemeSelect() {
    const { theme, setTheme } = useTheme();

    const lightClickCount = useRef(0);
    const [secretUnclock, setSecretUnlock] = useState(false);

    const handleSelectClick = (click: React.MouseEvent<HTMLSelectElement>) => {
        const target = click.target as HTMLOptionElement;

        if (target?.value === "light") {
            lightClickCount.current += 1;

            if (lightClickCount.current >= 15) {
                setSecretUnlock(true);
            }
        }
    };

    return (
        <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as typeof theme)}
            onClick={handleSelectClick}

            className="px-3 py-2 rounded bg-components text-textcolor border border-bordercolor max-w-lg"
        >
            <option value="dark">☾ Dark</option>
            <option value="light">☼ Light</option>
            <option value="ocean">｡˚○ Ocean</option>
            <option value="purple">Purple</option>
            <option value="grass">Grass</option>
            {secretUnclock && (
                <>
                <option value="rainbow">Rainbow</option>
                <option value="rainbow!">RAINBOW</option>
                </>
            )}
        </select>
    );
}