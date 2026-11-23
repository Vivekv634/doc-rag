"use client";

import { ChatMessage } from "@/redux/slices/chat.slice";
import { Bubble, BubbleContent } from "./ui/bubble";
import { ButtonGroup } from "./ui/button-group";
import { Button } from "./ui/button";
import { CopyIcon } from "lucide-react";
import copy from "clipboard-copy";

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
      <Button onClick={copyText} variant={"ghost"} size={"icon-sm"}>
        <CopyIcon />
      </Button>
    </ButtonGroup>
  );
}

export default function RenderBubbles({ chats }: { chats: ChatMessage[] }) {
  return (
    <section className="flex flex-col gap-2">
      {chats.map((chat, i) => {
        if (chat.role == "user") {
          return (
            <Bubble key={i} align="end" variant={"tinted"}>
              <BubbleContent>{chat.content.query}</BubbleContent>
              <BubbleMessageAction chat={chat} />
            </Bubble>
          );
        } else if (chat.role == "assistant") {
          return (
            <Bubble key={i} variant={"secondary"}>
              <BubbleContent>{chat.content.answer}</BubbleContent>
              <BubbleMessageAction chat={chat} />
            </Bubble>
          );
        }
      })}
    </section>
  );
}
