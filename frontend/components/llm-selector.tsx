import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setModel } from "@/redux/slices/query.slice";
import { cn } from "cn";

export default function LLMSelector() {
  const dispatch = useDispatch<AppDispatch>();
  const { model } = useSelector((root: RootState) => root.query);
  const { models } = useSelector((root: RootState) => root.filters);

  return (
    <Select
      onValueChange={(e) => {
        dispatch(setModel(e as string));
      }}
      value={model}
    >
      <SelectTrigger className={cn("min-w-24 max-h-fit bg-white")}>
        <SelectValue placeholder="Choose LLM" />
      </SelectTrigger>
      <SelectContent className={"min-w-fit"}>
        <SelectGroup>
          <SelectLabel>LLMs</SelectLabel>
          {models.map((m, i) => {
            return (
              <SelectItem
                key={i}
                value={m}
                className={cn(i % 2 == 0 && "bg-accent", "cursor-pointer")}
              >
                {m}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
