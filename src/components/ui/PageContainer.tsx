interface PageContainerProps {
    children?: React.ReactNode
}

export default function PageContainer({children}: PageContainerProps){
    return <div className={"flex w-full h-full gap-4 flex-col p-4 overflow-y-scroll no-scrollbar"}>
        {children}
    </div>
}