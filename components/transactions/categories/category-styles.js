import { Utensils, Laptop, Tag } from "lucide-react";

/** @type {Object.<string, {icon: JSX.Element, className: string, name: string}>} */
export const categoryStyles = {
  General: {
    icon: Tag,
    className: "text-slate-700 bg-slate-200/30",
    name: "General",
  },
  Food: {
    icon: Utensils,
    className: "text-red-400 bg-red-200/30",
    name: "Food",
  },
  Electronics: {
    icon: Laptop,
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
