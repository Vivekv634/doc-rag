import { combineReducers } from "@reduxjs/toolkit";
import { filterSlice } from "./slices/filters.slice";
import { querySlice } from "./slices/query.slice";
import { chatSlice } from "./slices/chat.slice";

export const rootReducer = combineReducers({
  filters: filterSlice.reducer,
  query: querySlice.reducer,
  chat: chatSlice.reducer,
});
