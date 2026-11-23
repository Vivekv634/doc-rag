import { createAsyncThunk } from "@reduxjs/toolkit";

export const generateLLMResponse = createAsyncThunk<
  { answer: string; sources: object },
  { query: string; document_ids: object; model: string }
>(
  "query/generateLLMResponse",
  async ({ query, document_ids, model }, thunkAPI) => {
    try {
      if (!query || !model) {
        return thunkAPI.rejectWithValue("'query' or 'model' is missing.");
      }
      const apiResponse = await fetch("/query", {
        method: "POST",
        body: JSON.stringify({ query, document_ids, model }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!apiResponse.ok) {
        return thunkAPI.rejectWithValue(apiResponse.json());
      }
      const data = await apiResponse.json();

      return data.response as { answer: string; sources: object };
    } catch (error) {
      console.error(error as string);
      return thunkAPI.rejectWithValue(error);
    }
  },
);
