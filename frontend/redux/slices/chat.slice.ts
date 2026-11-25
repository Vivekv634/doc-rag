import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserChatMessage {
  id: string;
  role: "user";
  timestamp: string;
  content: {
    model: string;
    document_ids: string[];
    query: string;
  };
}

export interface AssistantChatMessage {
  id: string;
  role: "assistant";
  timestamp: string;
  content: {
    answer: string;
    sources: object;
  };
}

export type ChatMessage = UserChatMessage | AssistantChatMessage;

interface initialStateProps {
  chat: ChatMessage[];
}

const initialState: initialStateProps = {
  chat: [],
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    appendMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.chat = [...state.chat, action.payload];
    },
  },
});

export default chatSlice.reducer;
export const { appendMessage } = chatSlice.actions;
