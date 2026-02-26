import { useNavigate } from "react-router-dom";

export default function Profile({to = "/history"}) {
  const navigate = useNavigate();
  return (
    <>
      <button onClick={() => navigate(to)} className="bg-[#1E1E1E] border-[#414141] border hover:bg-[#252525] rounded-xl py-4 px-6 mb-3 flex w-full font-bold">
              Workout geschiedenis
      </button>
      
    </>
  );
}
