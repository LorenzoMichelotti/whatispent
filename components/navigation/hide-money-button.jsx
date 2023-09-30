"use client";
import { Eye } from "lucide-react";
import { Button } from "../ui/button";
import React, { useContext, useState } from "react";
import { EyeOff } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const PreferenceContext = React.createContext({
  hideMoney: true,
  toggleHideMoney: () => {},
});

export function PreferenceContextProvider({ children }) {
  const [preferences, setpreferences] = useState({
    hideMoney: true,
    toggleHideMoney: () => {
      setpreferences((prev) => ({ ...prev, hideMoney: !prev.hideMoney }));
    },
  });
  return (
    <PreferenceContext.Provider value={preferences}>
      {children}
    </PreferenceContext.Provider>
  );
}

export default function HideMoneyButton() {
  const preferences = useContext(PreferenceContext);
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={() => preferences.toggleHideMoney()}
          variant="outline"
          className="w-14"
        >
          {preferences.hideMoney ? <EyeOff></EyeOff> : <Eye></Eye>}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Toggle hide sensitive data</p>
      </TooltipContent>
    </Tooltip>
  );
}
