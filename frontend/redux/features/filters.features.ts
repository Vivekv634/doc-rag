import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchAllDocumentIDs = createAsyncThunk<object[]>(
  "fetch/documentIDS",
  async (_, thunkAPI) => {
    try {
      const apiResponse = await fetch("/all-documents", { method: "GET" });

      if (!apiResponse.ok) {
        return thunkAPI.rejectWithValue(apiResponse.statusText);
      }
      const data = await apiResponse.json();

      return data.documents as object[];
    } catch (error) {
      console.error(error as string);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const fetchAllModels = createAsyncThunk<string[]>(
  "fetch/models",
  async (_, thunkAPI) => {
    try {
      const apiResponse = await fetch("/all-models", { method: "GET" });

      if (!apiResponse.ok) {
        return thunkAPI.rejectWithValue(apiResponse.statusText);
      }
      const data = await apiResponse.json();

      return data.models as string[];
    } catch (error) {
      console.error(error as string);
      return thunkAPI.rejectWithValue(error);
    }
  },
);
