// This pagecontainer holds the default styling we use on pretty much every page.
interface PageContainerProps {
    children?: React.ReactElement | undefined | string | React.ReactElement[]
}

export default function PageContainer({ children }: PageContainerProps) {
    return <div className="p-5 pb-20 w-full h-full">{children} </div>
}