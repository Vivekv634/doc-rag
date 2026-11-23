import { Metadata } from "@/components/query-filter";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { generateLLMResponse } from "../features/query.feature";

interface initialStateProps {
  model: string;
  query: string;
  documents: Metadata[];
  response: object;
  responseLoadingState: boolean;
}

const initialState: initialStateProps = {
  model: "",
  query: "",
  documents: [],
  response: {},
  responseLoadingState: false,
};

export const querySlice = createSlice({
  name: "query",
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    setModel: (state, action: PayloadAction<string>) => {
      state.model = action.payload;
    },
    setDocuments: (state, action: PayloadAction<Metadata[]>) => {
      state.documents = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(generateLLMResponse.pending, (state) => {
      state.responseLoadingState = true;
    });
    builder.addCase(generateLLMResponse.fulfilled, (state, action) => {
      state.response = action.payload;
      state.responseLoadingState = false;
    });
    builder.addCase(generateLLMResponse.rejected, (state) => {
      state.responseLoadingState = false;
    });
  },
});

export default querySlice.reducer;
export const { setQuery, setModel, setDocuments } = querySlice.actions;
