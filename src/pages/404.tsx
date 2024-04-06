import dynamic from "next/dynamic"

const NotFound = dynamic(()=>import('@faris/components/404/NotFound'))

export default function NotFoundPage() {
  return <NotFound/>
}
