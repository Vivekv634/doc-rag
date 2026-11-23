"use client";
import React from "react";
import {
  Combobox,
  ComboboxChips,
  ComboboxValue,
  ComboboxChip,
  ComboboxEmpty,
  ComboboxList,
  ComboboxItem,
  ComboboxChipsInput,
  ComboboxContent,
  useComboboxAnchor,
} from "./ui/combobox";
import {
  DialogContent,
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";
import { Dispatch, SetStateAction, useEffect } from "react";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Field, FieldGroup } from "./ui/field";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchAllDocumentIDs } from "@/redux/features/filters.features";
import { setDocuments } from "@/redux/slices/query.slice";

interface QueryFilterComponentProps {
  state: boolean;
  onStateChange: Dispatch<SetStateAction<boolean>>;
}

export interface Metadata {
  source: string;
  page_no: number;
  page_end: number;
  document_id: string;
  start_index: number;
  chunk_id: string;
  chunk_index: number;
}

export default function QueryFilterComponent({
  state,
  onStateChange,
}: QueryFilterComponentProps) {
  const anchor = useComboboxAnchor();
  const { documents } = useSelector((state: RootState) => state.filters);
  const { documents: queryDocuments } = useSelector(
    (state: RootState) => state.query,
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    async function fetch() {
      await dispatch(fetchAllDocumentIDs());
    }
    fetch();
  }, [dispatch]);

  if (!documents) {
    return null;
  }

  return (
    <Dialog open={state} onOpenChange={(e) => onStateChange(e)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className={"text-lg font-semibold"}>Filters</DialogTitle>
        </DialogHeader>

        {/* pages combobox */}
        <FieldGroup>
          <Field>
            <Label>
              Documents to include
              <span className="text-accent-foreground/80 italic font-semibold">
                (includes all, if empty)
              </span>
            </Label>
            <Combobox
              multiple
              autoHighlight
              items={documents}
              itemToStringLabel={(d: Metadata) => d.source}
              isItemEqualToValue={(a: Metadata, b: Metadata) =>
                a.document_id === b.document_id
              }
              value={queryDocuments}
              onValueChange={(e) => dispatch(setDocuments(e))}
            >
              <ComboboxChips ref={anchor} className="w-full">
                <ComboboxValue>
                  {(values: Metadata[]) => (
                    <React.Fragment>
                      {values.map((v) => (
                        <ComboboxChip key={v.document_id}>
                          {v.source}
                        </ComboboxChip>
                      ))}
                      <ComboboxChipsInput />
                    </React.Fragment>
                  )}
                </ComboboxValue>
              </ComboboxChips>
              <ComboboxContent anchor={anchor}>
                <ComboboxEmpty>No items found.</ComboboxEmpty>
                <ComboboxList>
                  {(item: Metadata) => (
                    <ComboboxItem
                      key={item.document_id}
                      value={item}
                      className={"flex justify-between px-1"}
                    >
                      <span className="w-8/10 truncate">{item.source}</span>
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </Field>
        </FieldGroup>

        <DialogFooter>
          <DialogClose render={<Button variant={"outline"}>close</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
