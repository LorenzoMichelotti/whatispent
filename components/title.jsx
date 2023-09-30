import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

export default function Title({ size = "md" }) {
  return (
    <div className="flex justify-between flex-col xl:flex-row">
      <h1 className={cn("text-2xl", size == "sm" && "text-md")}>whatispent</h1>
      <div className="text-xs -mt-2 mb-8 xl:mt-0 xl:mb-0">
        By{" "}
        <a href="https://www.linkedin.com/in/lorenzo-michelotti-b1b4441a7/">
          <Button className="p-0 m-0 text-blue-700" variant="link">
            Lorenzo Michelotti
          </Button>
        </a>
        , Software Developer
      </div>
    </div>
  );
}
