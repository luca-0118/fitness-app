import AddIcon from "@mui/icons-material/Add";

export default function ExerciseDescriptionOverlay({id, toggle}: {id:string, toggle:()=>void}){
    if(toggle) {return (<div className="bg-[#1E1E1E] border-[#414141] border rounded-xl px-2 mb-3 flex w-[90%] items-center mx-auto hover:bg-[#252525] active:bg-[#252525] cursor-pointer mt-2">
        {id}
      <button onClick={toggle}>
        <AddIcon sx={{ fontSize: 49 }} />
      </button>
    </div>
    )}

    if(!toggle){
        return id
    }


 

}



