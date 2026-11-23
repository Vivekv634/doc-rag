import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchAllModels,
  fetchAllDocumentIDs,
} from "../features/filters.features";

interface initialStateProps {
  models: string[];
  modelLoadingState: boolean;
  documents: object[];
  documentsLoadingState: boolean;
}

const initialState: initialStateProps = {
  models: [],
  modelLoadingState: false,
  documents: [],
  documentsLoadingState: false,
};

export const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchAllModels.pending, (state) => {
      state.modelLoadingState = true;
    });
    builder.addCase(
      fetchAllModels.fulfilled,
      (state, action: PayloadAction<string[]>) => {
        state.models = action.payload;
        state.modelLoadingState = false;
      },
    );
    builder.addCase(fetchAllDocumentIDs.pending, (state) => {
      state.documentsLoadingState = true;
    });
    builder.addCase(
      fetchAllDocumentIDs.fulfilled,
      (state, action: PayloadAction<object[]>) => {
        state.documents = action.payload;
        state.documentsLoadingState = false;
      },
    );
  },
});

export default filterSlice.reducer;
