import { Copy, Ellipsis, Save } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { buttonVariants } from "./ui/button";
import { cn } from "cn";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import copy from "clipboard-copy";

export default function QueryDropdown() {
  const { chat } = useSelector((root: RootState) => root.chat);
  return (
    <div className={cn(!chat.length && "hidden", "fixed right-4")}>
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          <Ellipsis />
        </DropdownMenuTrigger>
        <DropdownMenuContent className={"min-w-fit"}>
          <DropdownMenuItem>
            <Save /> Save query
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => copy(JSON.stringify(chat))}>
            <Copy /> <span>Copy RAW</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
