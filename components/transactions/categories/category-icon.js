import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { categoryEnumerator } from "./category-styles";
import { cn } from "@/lib/utils";

export default function CategoryIcon({ row }) {
  const categoryStyle = categoryEnumerator[row.getValue("category_id")];
  const className = categoryStyle.className;
  const Icon = categoryStyle.icon;
  return (
    <Tooltip>
      <TooltipTrigger className="cursor-default ">
        <motion.div
          initial={{ scale: 0.8, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          className={cn(
            "text-right font-medium rounded-full w-8 aspect-square flex justify-center items-center",
            className
          )}
        >
          <Icon size={18}></Icon>
        </motion.div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{categoryStyle.name}</p>
      </TooltipContent>
    </Tooltip>
  );
}
