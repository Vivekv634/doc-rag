"use client";

import { ChatMessage } from "@/redux/slices/chat.slice";
import { Bubble, BubbleContent } from "./ui/bubble";
import { ButtonGroup } from "./ui/button-group";
import { Button } from "./ui/button";
import { CopyIcon, Info } from "lucide-react";
import copy from "clipboard-copy";
import Markdown from "react-markdown";
import MessageDetailSheet from "./MessageDetailSheet";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setMessageSheet } from "@/redux/slices/utils.slice";

function BubbleMessageAction({ chat }: { chat: ChatMessage }) {
  async function copyText() {
    if (chat.role == "user") {
      copy(chat.content.query);
    } else if (chat.role == "assistant") {
      copy(chat.content.answer);
    }
  }

  return (
    <ButtonGroup>
      <Button
        onClick={copyText}
        variant={"ghost"}
        size={"icon-sm"}
        className={"cursor-pointer text-accent-foreground/40"}
      >
        <CopyIcon />
      </Button>
    </ButtonGroup>
  );
}

export default function RenderBubbles({ chats }: { chats: ChatMessage[] }) {
  const dispatch = useDispatch<AppDispatch>();
  return (
    <section className="flex flex-col gap-2">
      {chats.map((chat, i) => {
        if (chat.role == "user") {
          return (
            <Bubble key={i} align="end" variant={"tinted"}>
              <BubbleContent>{chat.content.query}</BubbleContent>
              <div className="flex justify-between">
                <BubbleMessageAction chat={chat} />
                <Button
                  onClick={() =>
                    dispatch(setMessageSheet({ open: true, message: chat }))
                  }
                  className={"cursor-pointer text-accent-foreground/40"}
                  size={"icon-sm"}
                  variant={"ghost"}
                >
                  <Info />
                </Button>
              </div>
            </Bubble>
          );
        } else if (chat.role == "assistant") {
          return (
            <Bubble key={i} variant={"secondary"}>
              <BubbleContent>
                <div className="prose prose-sm dark:prose-invert max-w-none prose-pre:bg-zinc-900 prose-pre:text-zinc-100 prose-code:text-blue-500 prose-a:text-blue-500 prose-table:border-collapse">
                  <Markdown>{chat.content.answer}</Markdown>
                </div>
              </BubbleContent>
              <div className="flex justify-between">
                <BubbleMessageAction chat={chat} />
                <Button
                  onClick={() =>
                    dispatch(setMessageSheet({ open: true, message: chat }))
                  }
                  className={"cursor-pointer text-accent-foreground/40"}
                  size={"icon-sm"}
                  variant={"ghost"}
                >
                  <Info />
                </Button>
              </div>
            </Bubble>
          );
        }
      })}

      <MessageDetailSheet />
    </section>
  );
}
