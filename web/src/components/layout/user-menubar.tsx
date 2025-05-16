import { Menubar, MenubarItem, MenubarContent, MenubarMenu, MenubarTrigger, MenubarSeparator } from "@/components/ui/menubar";
import { CircleGaugeIcon, BuildingIcon, SettingsIcon, LogOutIcon } from "lucide-react";

function UserMenubar({ email }: { email: string }) {
  return (
    <Menubar>
    <MenubarMenu>
      <MenubarTrigger>
        {email}
      </MenubarTrigger>
      <MenubarContent>
        <MenubarItem>
          <a href="/dashboard" className="flex items-center gap-x-2">
            <CircleGaugeIcon className="w-4 h-4" />
            Dashboard
          </a>
        </MenubarItem>
        <MenubarItem>
          <a href="/organizations" className="flex items-center gap-x-2">
            <BuildingIcon className="w-4 h-4" />
            Organizations
          </a>
        </MenubarItem>
        <MenubarItem>
          <a href="/settings" className="flex items-center gap-x-2">
            <SettingsIcon className="w-4 h-4" />
            Settings
          </a>
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem className="flex items-center gap-x-2">
          <a href="/sign-out" className="flex items-center gap-x-2">
            <LogOutIcon className="w-4 h-4" />
            Sign out
          </a>
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  </Menubar>

  )
}

export { UserMenubar }