import SaveIcon from '@mui/icons-material/Save';
import { useNavigate } from 'react-router-dom';

export default function SaveButton() {
    const navigate = useNavigate();
    
    return (
        <div className="relative">
            <div className="absolute top-0 left-0 z-50">
                <SaveIcon sx={{ fontSize: 40 }}/>
            </div>
        </div>
    );
}   