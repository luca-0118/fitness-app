import SaveIcon from '@mui/icons-material/Save';

export default function SaveButton() {
    return (
        <div className="relative">
            <button className="cursor-pointer">
                <SaveIcon sx={{ fontSize: 40 }}/>
            </button>
        </div>
    );
}   