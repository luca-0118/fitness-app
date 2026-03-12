import React from "react";
import SearchIcon from '@mui/icons-material/Search';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    onSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onSearch }) => {
    return (
        <div>
            <div className="input__wrapper relative w-87 justify-center mx-auto mb-3 mt-3">
                <input
                    type="text" 
                    placeholder="Search exercises..."
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-[#2e2e2e] border border-[#565d5d] rounded-lg pl-3 pr-12 py-2 text-white focus:outline-none focus:border-[#F67631]"
                />
                <button
                    className="search__button absolute right-2 top-1/2 -translate-y-1/2 text-[#F67631] hover:text-[#ff8c42] transition-colors"
                    type="button"
                    onClick={onSearch}
                >
                    <SearchIcon sx={{ color: "#F67631" }} />
                </button>
            </div>
        </div>
    );
};

export default SearchBar;