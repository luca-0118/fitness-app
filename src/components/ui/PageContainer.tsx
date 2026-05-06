import { twMerge } from "flowbite-react/helpers/tailwind-merge"
import React from "react"

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode

}

export default function PageContainer({children, ...props}: PageContainerProps){
    const styling = twMerge("flex w-full h-full gap-4 flex-col px-4 pt-4 overflow-y-scroll no-scrollbar",props.className);

    return <div {...props} className={styling}>
        {children}
    </div>
}