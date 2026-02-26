import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

export default function SaveButton() {
    const navigate = useNavigate();
    
    return (
        <div className="relative">
            <div className="absolute top-0 left-0 z-50">
                <SaveIcon sx={{ fontSize: 40 }}/>
            </div>
            <button onClick={() => navigate("/new-workout")} className="flex h-12 w-12 rounded-full bg-[#40C057] hover:bg-[#5AEA74] ml-auto z-50">
                <AddIcon sx={{ fontSize: 49 }} />
            </button>
        </div>
    );
}   