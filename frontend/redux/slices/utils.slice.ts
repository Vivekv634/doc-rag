import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatMessage } from "./chat.slice";
import {
  getChunks,
  getChunksResponse,
  getFileMetadataResponse,
  getFileMetadatas,
} from "../features/utils.feature";

interface initialStateProps {
  messageSheet: {
    open: boolean;
    message: ChatMessage | null;
  };
  chunks: getChunksResponse | null;
  file_metadatas: getFileMetadataResponse[] | null;
}

const initialState: initialStateProps = {
  messageSheet: {
    open: false,
    message: null,
  },
  chunks: null,
  file_metadatas: null,
};

export const utilsSlice = createSlice({
  name: "utils",
  initialState,
  reducers: {
    setMessageSheet: (
      state,
      action: PayloadAction<{ open: boolean; message: ChatMessage | null }>,
    ) => {
      state.messageSheet.open = action.payload.open;
      state.messageSheet.message = action.payload.message;
    },
    resetChunks: (state) => {
      state.chunks = null;
    },
    resetFileMetadata: (state) => {
      state.file_metadatas = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getChunks.pending, (state) => {
      state.chunks = null;
    });
    builder.addCase(getChunks.fulfilled, (state, action) => {
      state.chunks = action.payload;
    });
    builder.addCase(getFileMetadatas.pending, (state) => {
      state.chunks = null;
    });
    builder.addCase(getFileMetadatas.fulfilled, (state, action) => {
      state.file_metadatas = action.payload;
    });
  },
});

export const { setMessageSheet, resetChunks, resetFileMetadata } =
  utilsSlice.actions;
export default utilsSlice.reducer;
