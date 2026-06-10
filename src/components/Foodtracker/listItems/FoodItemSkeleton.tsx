import { Skeleton } from "@mui/material";

export default function FoodItemSkeleton() {
  return (
    <div className="bg-components border-bordercolor border rounded-xl px-2 mb-3 flex w-[90%] items-center mx-auto">
      <div className="pl-3 p-6 w-full">
        <Skeleton
          variant="text"
          width="80%"
          height={24}
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.11)",
          }}
        />
      </div>
    </div>
  );
}
