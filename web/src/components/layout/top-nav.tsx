"use client"

import { UserMenubar } from "./user-menubar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useUserStore } from "@/stores/user";
import { useEffect } from "react";

function TopNav() {
  const { user, isLoading } = useAuth()
  const fetchUser = useUserStore((state) => state.fetchUser)

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  return (
    <div className="bg-accent-foreground text-white flex justify-between items-center p-4">
      <span>next-starter</span>
      <div className="text-black">
        {isLoading && <span>Loading...</span>}
        {user?.email && !isLoading && <UserMenubar email={user.email} />}
        {!user?.email && !isLoading && <Button variant="outline" asChild><Link href="/login">Login</Link></Button>}
      </div>
    </div>
  )
}

export { TopNav }