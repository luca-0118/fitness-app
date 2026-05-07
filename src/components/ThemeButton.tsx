import { useTheme } from "../theme/ThemeProvider";

export default function ThemeSelect() {
    const { theme, setTheme } = useTheme();

    return (
        <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as typeof theme)}
            className="px-3 py-2 rounded bg-components text-textcolor border border-bordercolor max-w-lg"
        >
            <option value="dark">☾ Dark</option>
            <option value="light">☼ Light</option>
            <option value="ocean">｡˚○ Ocean</option>
            <option value="purple">Purple</option>
            <option value="grass">Grass</option>
        </select>
    );
}