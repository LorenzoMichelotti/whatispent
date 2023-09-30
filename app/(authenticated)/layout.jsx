export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import UserMenu from "@/components/navigation/user-menu";
import React from "react";
import HideMoneyButton, {
  PreferenceContextProvider,
} from "@/components/navigation/hide-money-button";

export const dynamic = "force-dynamic";

export default function AuthenticatedLayout({ children }) {
  return (
    <PreferenceContextProvider>
      <div className="w-full flex flex-col p-4">
        <nav className="flex justify-between w-full pb-4">
          <UserMenu />
          <TooltipProvider>
            <div className="flex items-center space-x-2">
              <HideMoneyButton></HideMoneyButton>
              <form action="/auth/signout" method="post">
                <div className="ml-auto">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" type="submit" className="w-14">
                        <LogOut></LogOut>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Sign Out</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </form>
            </div>
          </TooltipProvider>
        </nav>
        {children}
      </div>
    </PreferenceContextProvider>
  );
}
