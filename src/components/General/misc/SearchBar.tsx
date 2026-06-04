import React from "react";
import SearchIcon from '@mui/icons-material/Search';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    onSearch: () => void;
    onBarcodeClick?: () => void;
    placeholderText: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onSearch, placeholderText}) => {


    return (
        <div className="flex items-center gap-2 w-full justify-between mt-3 mb-2">
            <div className="relative flex-1">
                <input
                    type="text"
                    placeholder={`Search ${placeholderText}`}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-components border border-bordercolor rounded-lg pl-3 py-2 text-textcolor focus:outline-none focus:border-accent"
                />
            </div>
            <button
                className="h-11 w-11 rounded-lg bg-components border border-bordercolor flex items-center justify-center text-accent active:text-accent-action active:bg-components-hover transition-colors"
                type="button"
                onClick={onSearch}
            >
                <SearchIcon sx={{ color: "currentColor" }} />
            </button>
        </div>
    );
};

export default SearchBar;