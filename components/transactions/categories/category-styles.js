import { Utensils, Laptop } from "lucide-react";
import dynamic from "next/dynamic";

/** @type {Object.<string, {icon: JSX.Element, className: string, name: string}>} */
export const categoryStyles = {
  General: {
    icon: dynamic(() => import("lucide-react").then((icons) => icons.Tag)),
    className: "text-slate-700 bg-slate-200/30",
    name: "General",
  },
  Food: {
    icon: dynamic(() => import("lucide-react").then((icons) => icons.Utensils)),
    className: "text-red-400 bg-red-200/30",
    name: "Food",
  },
  Electronics: {
    icon: dynamic(() => import("lucide-react").then((icons) => icons.Laptop)),
    className: "text-blue-500 bg-blue-200/30",
    name: "GeneElectronicsral",
  },
};

/** @type {Object.<number, {icon: JSX.Element, className: string, name: string}>} */
export const categoryEnumerator = {
  1: categoryStyles.General,
  2: categoryStyles.Food,
  3: categoryStyles.Electronics,
};
