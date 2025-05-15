import { User } from "@supabase/supabase-js";
import { UserMenubar } from "./user-menubar";
import { Button } from "@/components/ui/button";
import Link from "next/link";


function TopNav({ user }: { user?: User }) {
  return (
    <div className="bg-accent-foreground text-white flex justify-between items-center p-4">
      <span>next-starter</span>
      <div className="text-black">
        {user?.email && <UserMenubar email={user.email} />}
        {!user?.email && <Button variant="outline" asChild><Link href="/login">Login</Link></Button>}
      </div>
    </div>
  )
}

export { TopNav }