
export default function WorkoutHistorySkeleton() {
    return <div className="bg-components border-bordercolor border rounded-xl p-2 flex w-[90%] items-center mx-auto hover:bg-components-hover active:bg-components-hover cursor-pointer" >
        <div className="pl-3 pb-1 h-full w-full flex flex-col">
            <div className="flex-1 text-left cursor-pointer mb-auto">
                <span className="skeleton w-1/2 rounded-xl inline-block h-6" />
            </div>
            <span className="skeleton w-1/4 rounded-xl inline-block h-4" />
            <span className="skeleton w-1/3 rounded-xl inline-block h-4 mt-1" />
        </div>
    </div>
}