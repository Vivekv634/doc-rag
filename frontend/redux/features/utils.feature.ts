import { createAsyncThunk } from "@reduxjs/toolkit";

export interface tailoredChunkInterface {
  document: string;
  id: string;
  metadata: {
    chunk_id: string;
    source: string;
    page_end: number;
    document_id: string;
    page_no: number;
    chunk_index: number;
    start_index: number;
  };
}

export interface getChunksResponse {
  ids: string[];
  documents: string[];
  metadatas: tailoredChunkInterface["metadata"][];
}

export interface getFileMetadataResponse {
  document_id: string;
  total_pages: number;
  file_path: string;
}

export const getChunks = createAsyncThunk<
  getChunksResponse,
  { chunk_ids: string[] }
>("utils/getChunks", async ({ chunk_ids }, thunkAPI) => {
  try {
    if (chunk_ids.length == 0) {
      return thunkAPI.rejectWithValue("'chunk_ids' is missing.");
    }

    const apiResponse = await fetch("/get-chunks", {
      method: "POST",
      body: JSON.stringify({ document_ids: chunk_ids, include: [] }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!apiResponse.ok) {
      const body = await apiResponse.json().catch(() => null);
      return thunkAPI.rejectWithValue(
        body?.detail ?? `Request failed (${apiResponse.status})`,
      );
    }
    const data = await apiResponse.json();

    return data;
  } catch (error) {
    console.error(error as string);
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : String(error),
    );
  }
});

export const getFileMetadatas = createAsyncThunk<
  getFileMetadataResponse[],
  { document_ids: string[] }
>("utils/get-file-metadatas", async ({ document_ids }, thunkAPI) => {
  try {
    if (document_ids.length == 0) {
      return thunkAPI.rejectWithValue("'document_ids' is missing.");
    }

    const apiResponse = await fetch("/get-file-metadata", {
      method: "POST",
      body: JSON.stringify({ document_ids: document_ids }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!apiResponse.ok) {
      const body = await apiResponse.json().catch(() => null);
      return thunkAPI.rejectWithValue(
        body?.detail ?? `Request failed (${apiResponse.status})`,
      );
    }
    const data = await apiResponse.json();

    return data;
  } catch (error) {
    console.error(error as string);
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : String(error),
    );
  }
});
