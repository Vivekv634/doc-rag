import { combineReducers } from "@reduxjs/toolkit";
import { filterSlice } from "./slices/filters.slice";
import { querySlice } from "./slices/query.slice";
import { chatSlice } from "./slices/chat.slice";
import { utilsSlice } from "./slices/utils.slice";

export const rootReducer = combineReducers({
  filters: filterSlice.reducer,
  query: querySlice.reducer,
  chat: chatSlice.reducer,
  utils: utilsSlice.reducer,
});
