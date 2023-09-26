"use client";
import { Eye } from "lucide-react";
import { Button } from "../ui/button";
import React, { useContext, useState } from "react";

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
    <Button onClick={() => preferences.toggleHideMoney()} variant="outline">
      <Eye></Eye>
    </Button>
  );
}
