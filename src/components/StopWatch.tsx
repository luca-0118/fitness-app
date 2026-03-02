import { useState, useEffect } from "react";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import StopCircleOutlinedIcon from '@mui/icons-material/StopCircleOutlined';
import FlagCircleOutlinedIcon from '@mui/icons-material/FlagCircleOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

interface StopWatchProps {
  onTimerChange: (timer: string) => void;
}

export default function StopWatch({ onTimerChange }: StopWatchProps) {
    const [timeInMs, setTimeInMs] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [laps, setLaps] = useState<number[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const centiseconds = Math.floor((ms % 1000) / 10);
        
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(centiseconds).padStart(2, '0')}`;
    };

    useEffect(() => {
        let timer: number | undefined;

        if (isActive) {
            timer = window.setInterval(() => {
                setTimeInMs(prevTime => prevTime + 10);
            }, 10);
        } else if (timer) {
            clearInterval(timer);
        }

        return () => {
            if (timer) {
                clearInterval(timer);
            }
        };
    }, [isActive]);

    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleTimerSwitch = (timer: string) => {
        handleMenuClose();
        onTimerChange(timer);
    };

    return (
        <div className="flex flex-col items-center justify-center relative border-2 border-gray-600 rounded-lg p-6 pt-12">
            <button 
                className="absolute top-2 left-2 text-orange-500 hover:text-orange-400 transition-colors z-10"
                onClick={handleMenuClick}
            >
                <KeyboardArrowDownIcon style={{ fontSize: '32px' }} />
            </button>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => handleTimerSwitch('stopwatch')}>Stopwatch</MenuItem>
                <MenuItem onClick={() => handleTimerSwitch('countdown')}>Countdown Timer</MenuItem>
            </Menu>
            <div className="border-2 border-gray-500 rounded-lg p-4 mb-4 w-56 text-center">
                <div className="text-3xl font-bold text-white font-mono">
                    {formatTime(timeInMs)}
                </div>
            </div>
            <div className="flex flex-row items-center justify-center gap-3">
                <button 
                    className="w-14 h-14 rounded-full border-4 border-green-500 bg-gray-900 text-green-500 hover:bg-green-500 hover:text-white transition-colors flex items-center justify-center"
                    onClick={() => setIsActive(!isActive)}
                >
                    {isActive ? <PauseCircleOutlineIcon fontSize="large" /> : <PlayCircleOutlineIcon fontSize="large" />}
                </button>
                <button 
                    className="w-14 h-14 rounded-full border-4 border-yellow-500 bg-gray-900 text-yellow-500 hover:bg-yellow-500 hover:text-white transition-colors flex items-center justify-center"
                    disabled={!isActive}
                    onClick={() => setLaps([...laps, timeInMs])}
                >
                    <FlagCircleOutlinedIcon fontSize="large" />
                </button>
                <button 
                    className="w-14 h-14 rounded-full border-4 border-red-500 bg-gray-900 text-red-500 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center"
                    onClick={() => { setTimeInMs(0); setLaps([]); setIsActive(false); }}
                >
                    <StopCircleOutlinedIcon fontSize="large" />
                </button>
            </div>
            {laps.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Laps</h3>
                    <ul className="space-y-1">
                        {laps.map((lap, index) => (
                            <li key={index} className="text-base bg-gray-800 p-2 rounded">
                                {`Lap ${index + 1}: ${formatTime(lap)}`}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}