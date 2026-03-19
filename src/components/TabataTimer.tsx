import { useEffect, useState } from "react";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import StopCircleOutlinedIcon from '@mui/icons-material/StopCircleOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

interface TabataTimerProps {
  onTimerChange: (timer: string) => void;
}

export default function TabataTimer({ onTimerChange }: TabataTimerProps) {
    const [workSeconds, setWorkSeconds] = useState(20);
    const [restSeconds, setRestSeconds] = useState(10);
    const [totalRounds, setTotalRounds] = useState(8);

    const [timeLeftMs, setTimeLeftMs] = useState(20000);
    const [isActive, setIsActive] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const [currentRound, setCurrentRound] = useState(1);
    const [isWorkPhase, setIsWorkPhase] = useState(true);

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
        if (!hasStarted) {
            setTimeLeftMs(workSeconds * 1000);
        }
    }, [workSeconds, hasStarted]);

    useEffect(() => {
        let timer: number | undefined;

        if (isActive && timeLeftMs > 0) {
            timer = window.setInterval(() => {
                setTimeLeftMs((prev) => Math.max(0, prev - 10));
            }, 10);
        }

        return () => {
            if (timer) {
                clearInterval(timer);
            }
        };
    }, [isActive, timeLeftMs]);

    useEffect(() => {
        if (!isActive || timeLeftMs > 0) {
            return;
        }

        if (isWorkPhase) {
            setIsWorkPhase(false);
            setTimeLeftMs(restSeconds * 1000);
            return;
        }

        if (currentRound >= totalRounds) {
            setIsActive(false);
            return;
        }

        setCurrentRound((prev) => prev + 1);
        setIsWorkPhase(true);
        setTimeLeftMs(workSeconds * 1000);
    }, [timeLeftMs, isActive, isWorkPhase, currentRound, totalRounds, workSeconds, restSeconds]);

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

    const handleStart = () => {
        if (!hasStarted) {
            setTimeLeftMs(workSeconds * 1000);
            setCurrentRound(1);
            setIsWorkPhase(true);
            setHasStarted(true);
        }
        setIsActive(true);
    };

    const handleReset = () => {
        setIsActive(false);
        setHasStarted(false);
        setCurrentRound(1);
        setIsWorkPhase(true);
        setTimeLeftMs(workSeconds * 1000);
    };

    return (
        <div className="flex flex-col items-center justify-center relative w-87 bg-[#1E1E1E] border-2 border-[#565d5d] rounded-lg p-6 pt-8">
            <button
                className="absolute top-2 right-2 text-orange-500 hover:text-orange-400 active:text-orange-400 transition-colors z-10"
                onClick={handleMenuClick}
            >
                <MenuIcon style={{ fontSize: '32px' }} />
            </button>
            <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                <MenuItem onClick={() => handleTimerSwitch('stopwatch')}>Stopwatch</MenuItem>
                <MenuItem onClick={() => handleTimerSwitch('countdown')}>Countdown Timer</MenuItem>
                <MenuItem onClick={() => handleTimerSwitch('tabata')}>Tabata Timer</MenuItem>
            </Menu>

            {!hasStarted && (
                <div className="mb-4 flex gap-3">
                    <div className="flex flex-col items-center">
                        <label className="text-sm text-gray-400 mb-1">work</label>
                        <select
                            value={workSeconds}
                            onChange={(e) => setWorkSeconds(Number(e.target.value))}
                            className="px-3 py-2 border-2 border-[#565d5d] rounded-lg bg-gray-800 text-white cursor-pointer"
                        >
                            {Array.from({ length: 60 }, (_, i) => i + 1).map((v) => (
                                <option key={v} value={v}>{v}s</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col items-center">
                        <label className="text-sm text-gray-400 mb-1">rest</label>
                        <select
                            value={restSeconds}
                            onChange={(e) => setRestSeconds(Number(e.target.value))}
                            className="px-3 py-2 border-2 border-[#565d5d] rounded-lg bg-gray-800 text-white cursor-pointer"
                        >
                            {Array.from({ length: 60 }, (_, i) => i + 1).map((v) => (
                                <option key={v} value={v}>{v}s</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col items-center">
                        <label className="text-sm text-gray-400 mb-1">rounds</label>
                        <select
                            value={totalRounds}
                            onChange={(e) => setTotalRounds(Number(e.target.value))}
                            className="px-3 py-2 border-2 border-[#565d5d] rounded-lg bg-gray-800 text-white cursor-pointer"
                        >
                            {Array.from({ length: 20 }, (_, i) => i + 1).map((v) => (
                                <option key={v} value={v}>{v}</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            <div className="text-lg font-bold mb-2 text-white">
                Round {currentRound}/{totalRounds} · {isWorkPhase ? "WORK" : "REST"}
            </div>

            <div className="border-2 border-[#565d5d] rounded-lg p-4 mb-4 w-56 text-center">
                <div className="text-3xl font-bold text-white font-mono">
                    {formatTime(timeLeftMs)}
                </div>
            </div>

            <div className="flex flex-row items-center justify-center gap-3">
                <button
                    className="w-14 h-14 rounded-full border-4 border-green-500 bg-gray-900 text-green-500 hover:bg-green-500 hover:text-white active:bg-green-500 active:text-white transition-colors flex items-center justify-center"
                    onClick={() => {
                        if (isActive) {
                            setIsActive(false);
                        } else {
                            handleStart();
                        }
                    }}
                >
                    {isActive ? <PauseCircleOutlineIcon fontSize="large" /> : <PlayCircleOutlineIcon fontSize="large" />}
                </button>
                <button
                    className="w-14 h-14 rounded-full border-4 border-red-500 bg-gray-900 text-red-500 hover:bg-red-500 hover:text-white active:bg-red-500 active:text-white transition-colors flex items-center justify-center"
                    onClick={handleReset}
                >
                    <StopCircleOutlinedIcon fontSize="large" />
                </button>
            </div>
        </div>
    );
}