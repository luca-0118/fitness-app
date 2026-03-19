import { useState, useEffect } from "react";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import StopCircleOutlinedIcon from '@mui/icons-material/StopCircleOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

interface CountDownTimerProps {
  onTimerChange: (timer: string) => void;
}

export default function CountDownTimer({ onTimerChange }: CountDownTimerProps) {
    const [timeLeftMs, setTimeLeftMs] = useState(60000);
    const [isActive, setIsActive] = useState(false);
    const [inputtimeMs, setInputTimeMs] = useState(60000);
    const [hasStarted, setHasStarted] = useState(false);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(1);
    const [seconds, setSeconds] = useState(0);
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
        if (isActive && timeLeftMs > 0) {
            timer = setInterval(() => setTimeLeftMs((prev) => Math.max(0, prev - 10)), 10);
        } else if (!isActive && timeLeftMs !== 0) {
            if (timer) clearInterval(timer);
        }
        
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [isActive, timeLeftMs]);

    const handleStart= () => {
        setTimeLeftMs(inputtimeMs);
        setIsActive(true);
        setHasStarted(true);
    }

    const handleTimeChange = (h: number, m: number, s: number) => {
        setHours(h);
        setMinutes(m);
        setSeconds(s);
        const totalMs = (h * 3600 + m * 60 + s) * 1000;
        setInputTimeMs(totalMs);
        if (!hasStarted) {
            setTimeLeftMs(totalMs);
        }
    };

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
    <>
      <div className="flex flex-col items-center justify-center  w-87 bg-[#1E1E1E] border-2 border-[#565d5d] rounded-lg p-6 pt-12">
        <button 
          className="absolute top-2 right-2 text-orange-500 hover:text-orange-400 active:text-orange-400 transition-colors z-10"
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
        {!hasStarted && (
          <div className="mb-6">
            <div className="flex justify-center gap-3 mb-4">
              <div className="flex flex-col items-center">
                <select 
                  value={hours} 
                  onChange={(e) => handleTimeChange(Number(e.target.value), minutes, seconds)}
                  className="px-3 py-2 border-2 border-[#565d5d] rounded-lg bg-gray-800 text-white text-xl font-semibold mb-1 cursor-pointer hover:border-gray-500 active:border-gray-500 focus:outline-none focus:border-blue-500"
                  disabled={isActive}
                >
                  {[...Array(24)].map((_, i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
                <label className="text-sm text-gray-400">hours</label>
              </div>
              <div className="flex flex-col items-center">
                <select 
                  value={minutes} 
                  onChange={(e) => handleTimeChange(hours, Number(e.target.value), seconds)}
                  className="px-3 py-2 border-2 border-[#565d5d] rounded-lg bg-gray-800 text-white text-xl font-semibold mb-1 cursor-pointer hover:border-gray-500 active:border-gray-500 focus:outline-none focus:border-blue-500"
                  disabled={isActive}
                >
                  {[...Array(60)].map((_, i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
                <label className="text-sm text-gray-400">min</label>
              </div>
              <div className="flex flex-col items-center">
                <select 
                  value={seconds} 
                  onChange={(e) => handleTimeChange(hours, minutes, Number(e.target.value))}
                  className="px-3 py-2 border-2 border-[#565d5d] rounded-lg bg-gray-800 text-white text-xl font-semibold mb-1 cursor-pointer hover:border-gray-500 active:border-gray-500 focus:outline-none focus:border-blue-500"
                  disabled={isActive}
                >
                  {[...Array(60)].map((_, i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
                <label className="text-sm text-gray-400">sec</label>
              </div>
            </div>
          </div>
        )}
        
        <div className="border-2 border-[#565d5d] rounded-lg p-4 mb-4 w-56 text-center">
          <div className="text-3xl font-bold text-white font-mono">
            {formatTime(timeLeftMs)}
          </div>
        </div>
        <div className="flex flex-row items-center justify-center gap-3">
          {!hasStarted ? (
            <button 
              className="w-14 h-14 rounded-full border-4 border-green-500 bg-gray-900 text-green-500 hover:bg-green-500 hover:text-white transition-colors active:bg-green-500 active:text-white flex items-center justify-center"
              onClick={handleStart}
            >
              <PlayCircleOutlineIcon fontSize="large" />
            </button>
          ) : (
            <button 
              className="w-14 h-14 rounded-full border-4 border-yellow-500 bg-gray-900 text-yellow-500 hover:bg-yellow-500 hover:text-white active:bg-yellow-500 active:text-white transition-colors flex items-center justify-center"
              onClick={() => setIsActive(!isActive)}
              disabled={timeLeftMs === 0}
            >
              <PauseCircleOutlineIcon fontSize="large" />
            </button>
          )}
          <button 
            className="w-14 h-14 rounded-full border-4 border-red-500 bg-gray-900 text-red-500 hover:bg-red-500 hover:text-white active:bg-red-500 active:text-white transition-colors flex items-center justify-center"
            onClick={() => { setTimeLeftMs(inputtimeMs); setIsActive(false); setHasStarted(false); }}
          >
            <StopCircleOutlinedIcon fontSize="large" />
          </button>
        </div>
      </div>
    </>
  );
}
