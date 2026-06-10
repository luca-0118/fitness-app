import { useState, useEffect } from "react";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import StopCircleOutlinedIcon from '@mui/icons-material/StopCircleOutlined';
import FlagCircleOutlinedIcon from '@mui/icons-material/FlagCircleOutlined';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import MenuIcon from '@mui/icons-material/Menu';
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
        <div className="flex flex-col items-center justify-center relative w-87 bg-components border-2 border-bordercolor rounded-lg p-6 pt-12">
            <button 
                className="absolute top-2 right-2 text-accent hover:text-accent-action active:text-accent-action transition-colors z-30"
                onClick={handleMenuClick}
            >
                <MenuIcon style={{ fontSize: '32px' }} />
            </button>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => handleTimerSwitch('stopwatch')}>Stopwatch</MenuItem>
                <MenuItem onClick={() => handleTimerSwitch('countdown')}>Countdown Timer</MenuItem>
                <MenuItem onClick={() => handleTimerSwitch('tabata')}>Tabata Timer</MenuItem>
            </Menu>
            <div className="border-2 border-bordercolor rounded-lg p-4 mb-4 w-56 text-center">
                <div className="text-3xl font-bold text-textcolor font-mono">
                    {formatTime(timeInMs)}
                </div>
            </div>
            <div className="flex flex-row items-center justify-center gap-3">
                <button 
                    className="w-14 h-14 rounded-full border-4 border-button-start bg-components text-button-start hover:bg-button-start hover:text-textcolor active:bg-button-start active:text-textcolor transition-colors flex items-center justify-center"
                    onClick={() => setIsActive(!isActive)}
                >
                    {isActive ? <PauseCircleOutlineIcon fontSize="large" /> : <PlayCircleOutlineIcon fontSize="large" />}
                </button>
                <button 
                    className="w-14 h-14 rounded-full border-4 border-button-pause bg-components-color text-button-pause hover:bg-button-pause hover:text-textcolor active:bg-button-pause active:text-textcolor transition-colors flex items-center justify-center"
                    disabled={timeInMs === 0}
                    onClick={() => {
                        if (isActive) {
                            setLaps([...laps, timeInMs]);
                        } else {
                            setTimeInMs(0);
                            setLaps([]);
                        }
                    }}
                >
                    {isActive ? <FlagCircleOutlinedIcon fontSize="large" /> : <RestartAltIcon fontSize="large" />}
                </button>
                <button 
                    className="w-14 h-14 rounded-full border-4 border-button-stop bg-components text-button-stop hover:bg-button-stop hover:text-textcolor active:bg-button-stop active:text-textcolor transition-colors flex items-center justify-center"
                    disabled={timeInMs === 0}
                    onClick={() => setIsActive(false)}
                >
                    <StopCircleOutlinedIcon fontSize="large" />
                </button>
            </div>
            {laps.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2 text-textcolor">Laps</h3>
                    <ul className="space-y-1">
                        {laps.map((lap, index) => (
                            <li key={index} className="text-base text-textcolor bg-components p-2 rounded">
                                {`Lap ${index + 1}: ${formatTime(lap)}`}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}