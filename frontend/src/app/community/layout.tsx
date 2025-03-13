import type { ReactNode } from "react"
import LocalHeader from "./components/local-header"
import LocalFooter from "./components/local-footer"

export default function CommunityLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <>
      <LocalHeader />
      <main>{children}</main>
      <LocalFooter />
    </>
  )
}

