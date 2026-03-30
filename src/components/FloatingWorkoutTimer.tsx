import { useEffect, useMemo, useRef, useState } from "react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../classes/api";
import { SESSION_STORAGE_KEYS } from "../apis/sessionAPI";

const TIMER_POSITION_STORAGE_KEY = "workoutFloatingTimerPos";
// Minimum pointer movement before we treat interaction as a drag instead of a click.
const DRAG_THRESHOLD_PX = 6;

type Position = {
  x: number;
  y: number;
};

function formatElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function FloatingWorkoutTimer() {
  const navigate = useNavigate();
  const location = useLocation();
  const timerRef = useRef<HTMLButtonElement | null>(null);
  const dragStartRef = useRef<Position | null>(null);
  const pointerOffsetRef = useRef<Position | null>(null);
  const didDragRef = useRef(false);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [workoutName, setWorkoutName] = useState<string>("Workout in progress");
  const [tick, setTick] = useState(0);
  const [position, setPosition] = useState<Position | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Sync active workout details from localStorage and refresh elapsed time once per second.
  useEffect(() => {
    const syncFromStorage = () => {
      const id = localStorage.getItem(SESSION_STORAGE_KEYS.id);

      if (!id) {
        setSessionId(null);
        setStartedAt(null);
        setWorkoutName("Workout in progress");
        return;
      }

      let start = Number(localStorage.getItem(SESSION_STORAGE_KEYS.startedAt));
      if (!Number.isFinite(start) || start <= 0) {
        start = Date.now();
        localStorage.setItem(SESSION_STORAGE_KEYS.startedAt, start.toString());
      }

      const storedName = localStorage.getItem(SESSION_STORAGE_KEYS.workoutName);
      if (storedName) {
        setWorkoutName(storedName);
      }

      setSessionId(id);
      setStartedAt(start);
    };

    syncFromStorage();

    const interval = window.setInterval(() => {
      syncFromStorage();
      setTick((prev) => prev + 1);
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  // Fetch workout name once when a session exists and no name has been cached yet.
  useEffect(() => {
    if (!sessionId) return;
    if (localStorage.getItem(SESSION_STORAGE_KEYS.workoutName)) return;

    API.session.get().then((resp) => {
      if (typeof resp === "string") return;
      localStorage.setItem(SESSION_STORAGE_KEYS.workoutName, resp.workout_name);
      setWorkoutName(resp.workout_name);
    }).catch(() => {
      // Keep fallback text if fetching session details fails.
    });
  }, [sessionId]);

  // Restore draggable position from previous app usage.
  useEffect(() => {
    const stored = localStorage.getItem(TIMER_POSITION_STORAGE_KEY);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as Position;
      if (Number.isFinite(parsed.x) && Number.isFinite(parsed.y)) {
        setPosition(parsed);
      }
    } catch {
      // Ignore malformed saved position values.
    }
  }, []);

  const elapsedLabel = useMemo(() => {
    if (!startedAt) return "00:00";
    return formatElapsed(Math.max(0, Date.now() - startedAt));
  }, [startedAt, tick]);

  // Keep the timer inside the viewport while dragging.
  const clampPosition = (next: Position): Position => {
    const node = timerRef.current;
    if (!node) return next;

    const margin = 8;
    const maxX = window.innerWidth - node.offsetWidth - margin;
    const maxY = window.innerHeight - node.offsetHeight - margin;

    return {
      x: Math.min(Math.max(next.x, margin), Math.max(margin, maxX)),
      y: Math.min(Math.max(next.y, margin), Math.max(margin, maxY)),
    };
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;

    const rect = event.currentTarget.getBoundingClientRect();
    dragStartRef.current = { x: event.clientX, y: event.clientY };
    pointerOffsetRef.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    didDragRef.current = false;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  // Move the widget with pointer/touch and mark as dragged after threshold.
  const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!isDragging || !pointerOffsetRef.current || !dragStartRef.current) return;

    const deltaX = Math.abs(event.clientX - dragStartRef.current.x);
    const deltaY = Math.abs(event.clientY - dragStartRef.current.y);
    if (deltaX > DRAG_THRESHOLD_PX || deltaY > DRAG_THRESHOLD_PX) {
      didDragRef.current = true;
    }

    const nextPosition = clampPosition({
      x: event.clientX - pointerOffsetRef.current.x,
      y: event.clientY - pointerOffsetRef.current.y,
    });

    setPosition(nextPosition);
  };

  // End drag mode and persist final position.
  const handlePointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!isDragging) return;

    event.currentTarget.releasePointerCapture(event.pointerId);
    setIsDragging(false);
    dragStartRef.current = null;
    pointerOffsetRef.current = null;

    if (position) {
      localStorage.setItem(TIMER_POSITION_STORAGE_KEY, JSON.stringify(position));
    }
  };

  // Prevent opening Session after drag-release; only navigate on true click.
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (didDragRef.current) {
      event.preventDefault();
      didDragRef.current = false;
      return;
    }

    navigate("/session");
  };

  if (!sessionId || location.pathname === "/session") {
    return null;
  }

  return (
    <button
      ref={timerRef}
      type="button"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onClick={handleClick}
      className={`fixed z-45 flex items-center gap-3 rounded-2xl border border-[#4b4b4b] bg-[#1E1E1E]/95 px-4 py-3 text-left shadow-lg backdrop-blur-sm transition hover:border-[#F67631] ${isDragging ? "cursor-grabbing" : "cursor-grab"} ${position ? "left-0 top-0" : "left-1/2 top-24 -translate-x-1/2"}`}
      style={position ? { left: `${position.x}px`, top: `${position.y}px`, transform: "none" } : undefined}
      title="Return to workout session"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2e2e2e] text-[#F67631]">
        <FitnessCenterIcon fontSize="small" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs text-[#b7b7b7]">{workoutName}</p>
        <p className="flex items-center gap-1 text-sm font-semibold text-white">
          <AccessTimeIcon sx={{ fontSize: 14 }} />
          {elapsedLabel}
        </p>
      </div>
    </button>
  );
}
