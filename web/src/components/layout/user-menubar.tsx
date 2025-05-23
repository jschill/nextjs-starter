import { Menubar, MenubarItem, MenubarContent, MenubarMenu, MenubarTrigger, MenubarSeparator } from "@/components/ui/menubar";
import { CircleGaugeIcon, BuildingIcon, SettingsIcon, LogOutIcon } from "lucide-react";
import Link from "next/link";
function  UserMenubar({ email }: { email: string }) {
  return (
    <Menubar>
    <MenubarMenu>
      <MenubarTrigger>
        {email}
      </MenubarTrigger>
      <MenubarContent>
        <MenubarItem asChild>
          <Link href="/dashboard" className="flex items-center gap-x-2">
            <CircleGaugeIcon className="w-4 h-4" />
            Dashboard
          </Link>
        </MenubarItem>
        <MenubarItem asChild>
          <Link href="/organizations" className="flex items-center gap-x-2">
            <BuildingIcon className="w-4 h-4" />
            Organizations
          </Link>
        </MenubarItem>
        <MenubarItem asChild>
          <Link href="/settings" className="flex items-center gap-x-2">
            <SettingsIcon className="w-4 h-4" />
            Settings
          </Link>
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem asChild>
          <Link href="/sign-out" className="flex items-center gap-x-2">
            <LogOutIcon className="w-4 h-4" />
            Sign out
          </Link>
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  </Menubar>

  )
}

export { UserMenubar }