"use client";
import { useDispatch, useSelector } from "react-redux";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "./ui/sheet";
import { AppDispatch, RootState } from "@/redux/store";
import {
  resetChunks,
  resetFileMetadata,
  setMessageSheet,
} from "@/redux/slices/utils.slice";
import { FieldGroup, Field } from "./ui/field";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  getChunks,
  getFileMetadatas,
  tailoredChunkInterface,
} from "@/redux/features/utils.feature";
import { Separator } from "./ui/separator";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { cn } from "cn";

export default function MessageDetailSheet() {
  const { messageSheet, chunks, file_metadatas } = useSelector(
    (root: RootState) => root.utils,
  );
  const dispatch = useDispatch<AppDispatch>();
  const [tailoredChunks, setTailoredChunks] =
    useState<tailoredChunkInterface[]>();

  function onOpenChangeHandler(e: boolean) {
    if (!e) {
      dispatch(setMessageSheet({ message: null, open: false }));
      dispatch(resetChunks());
      dispatch(resetFileMetadata());
    }
  }

  async function sheetOpenChangeHandler() {
    if (messageSheet.message && messageSheet.message.role == "assistant") {
      dispatch(
        getChunks({
          chunk_ids: messageSheet.message.content.sources.map(
            (s) => s.chunk_id,
          ),
        }),
      );
    } else if (messageSheet.message && messageSheet.message.role == "user") {
      dispatch(
        getFileMetadatas({
          document_ids: messageSheet.message.content.document_ids,
        }),
      );
    }
  }

  useEffect(() => {
    function tailorChunks() {
      if (chunks && chunks.documents) {
        const processedChunks: tailoredChunkInterface[] = [];
        for (let i = 0; i < chunks.documents.length; i++) {
          processedChunks.push({
            document: chunks.documents[i],
            id: chunks.ids[i],
            metadata: chunks.metadatas[i],
          });
        }
        setTailoredChunks(processedChunks);
      }
    }
    tailorChunks();
  }, [chunks]);

  if (!messageSheet.message) {
    return null;
  }

  return (
    <Sheet
      open={messageSheet.open}
      onOpenChange={(e) => {
        onOpenChangeHandler(e);
      }}
      onOpenChangeComplete={() => sheetOpenChangeHandler()}
    >
      <SheetContent className={"p-3"}>
        <SheetHeader>
          <SheetTitle>Message Info</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>

        {messageSheet.message.role == "user" ? (
          <section className="overflow-y-auto">
            <FieldGroup>
              <Field>
                <Label>Model used:</Label>
                <Input value={messageSheet.message.content.model} disabled />
              </Field>
              {file_metadatas && (
                <Field>
                  <Label>Selected Documents:</Label>
                  <div>
                    {file_metadatas &&
                      file_metadatas.map((d, i) => {
                        const file_name = d.file_path.split("/").reverse()[0];
                        return (
                          <Card
                            key={i}
                            className={cn(i % 2 == 0 && "bg-muted", "mx-1")}
                          >
                            <CardHeader className="">
                              <CardTitle>{file_name}</CardTitle>
                              <CardDescription>{d.document_id}</CardDescription>
                            </CardHeader>
                            <Separator />
                            <CardFooter className="flex justify-between">
                              <span className="font-semibold text-muted-foreground">
                                {file_name
                                  .split(".")
                                  .reverse()[0]
                                  .toUpperCase()}
                              </span>
                              <span className="text-muted-foreground">
                                {d.total_pages} pages
                              </span>
                            </CardFooter>
                          </Card>
                        );
                      })}
                  </div>
                </Field>
              )}
              <Field>
                <span className="tracking-wide text-muted-foreground">
                  {new Date(messageSheet.message.timestamp).toUTCString()}
                </span>
              </Field>
            </FieldGroup>
          </section>
        ) : (
          <section className="overflow-y-auto">
            <FieldGroup>
              <Field>
                <Label>Chunks: </Label>
                <div>
                  {tailoredChunks &&
                    tailoredChunks.map((tc, i) => {
                      return (
                        <Card
                          key={i}
                          className={cn(i % 2 == 0 && "bg-muted", "mb-2 mx-1")}
                        >
                          <CardHeader>
                            <CardTitle>
                              [{i + 1}] {tc.metadata["source"]}
                            </CardTitle>
                            <CardDescription>
                              {tc.metadata["chunk_id"]}
                            </CardDescription>
                          </CardHeader>
                          <Separator />
                          <CardContent>{tc.document}</CardContent>
                        </Card>
                      );
                    })}
                </div>
              </Field>
              <Field>
                <span className="tracking-wide text-muted-foreground">
                  {new Date(messageSheet.message.timestamp).toUTCString()}
                </span>
              </Field>
            </FieldGroup>
          </section>
        )}
      </SheetContent>
    </Sheet>
  );
}
