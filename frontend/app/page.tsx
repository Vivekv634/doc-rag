"use client";
import RenderBubbles from "@/components/chat-bubble";
import LLMSelector from "@/components/llm-selector";
import QueryDropdown from "@/components/query-dropdown";
import QueryFilterComponent from "@/components/query-filter";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { fetchAllModels } from "@/redux/features/filters.features";
import { generateLLMResponse } from "@/redux/features/query.feature";
import {
  appendMessage,
  AssistantChatMessage,
  UserChatMessage,
} from "@/redux/slices/chat.slice";
import { setQuery } from "@/redux/slices/query.slice";
import { AppDispatch, RootState } from "@/redux/store";
import { Loader2, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uid } from "uid";

export default function Home() {
  const [textQuery, setTextQuery] = useState<string>("");

  const [filterDialogState, setFilterDialogState] = useState<boolean>(false);
  const { responseLoadingState, query, documents, model } = useSelector(
    (state: RootState) => state.query,
  );
  const { chat } = useSelector((state: RootState) => state.chat);
  const dispatch = useDispatch<AppDispatch>();

  async function fetchResponse() {
    const document_ids = documents.map((d) => d.document_id);

    // append user message to chat message list
    const user_msg: UserChatMessage = {
      timestamp: new Date().toISOString(),
      content: { model: model, document_ids: document_ids, query: query },
      id: uid(),
      role: "user",
    };
    dispatch(appendMessage(user_msg));

    setTextQuery("");
    dispatch(setQuery(""));

    const dispatchResponse = await dispatch(
      generateLLMResponse({ query, document_ids, model }),
    );

    if (dispatchResponse.meta.requestStatus == "fulfilled") {
      const assistant_msg: AssistantChatMessage = {
        id: uid(),
        role: "assistant",
        timestamp: new Date().toISOString(),
        content: dispatchResponse.payload as AssistantChatMessage["content"],
      };
      dispatch(appendMessage(assistant_msg));
      setTextQuery("");
    } else if (dispatchResponse.meta.requestStatus == "rejected") {
      toast.add({ description: dispatchResponse.payload as string });
      setTextQuery(user_msg.content.query);
      dispatch(setQuery(user_msg.content.query));
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setQuery(textQuery));
    }, 300);
    return () => clearTimeout(timer);
  }, [textQuery, dispatch]);

  useEffect(() => {
    async function fetch() {
      await dispatch(fetchAllModels());
    }
    fetch();
  }, [dispatch]);

  return (
    <main className="w-full flex flex-col">
      <section className="min-h-4/12 w-full md:w-2xl mx-auto overflow-y-auto overflow-x-hidden pb-56 px-2">
        <RenderBubbles chats={chat} />
      </section>

      <section className="fixed md:absolute bottom-0 inset-x-0 mx-auto z-10 bg-white px-2">
        <div className="shrink-0 w-full md:w-2xl mx-auto pb-2">
          <Textarea
            className="w-full min-h-20 bg-white max-h-56 resize-none mb-1 field-sizing-content"
            placeholder="Write your query..."
            value={textQuery}
            onChange={(e) => setTextQuery(e.target.value)}
          />
          <div className="flex justify-between">
            <div className="flex gap-2">
              <LLMSelector />
              <Button
                variant={"outline"}
                onClick={() => setFilterDialogState(true)}
              >
                <span className="tracking-wide cursor-pointer">filter</span>
              </Button>
            </div>
            <Button
              className={"cursor-pointer"}
              onClick={() => fetchResponse()}
              disabled={responseLoadingState || !model || !textQuery.trim()}
            >
              {responseLoadingState ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Send />
              )}
            </Button>
          </div>
        </div>
      </section>

      <QueryFilterComponent
        state={filterDialogState}
        onStateChange={setFilterDialogState}
      />

      <QueryDropdown />
    </main>
  );
}
