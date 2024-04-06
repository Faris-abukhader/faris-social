
import dynamic from "next/dynamic"

const BlockContainer = dynamic(()=>import("@faris/components/blocked/BlockContainer"))

export default function Block() {
  return <BlockContainer/>
}
