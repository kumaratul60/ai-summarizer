import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const { VITE_RAPID_API_ARTICLE_KEY: rapidApiKey } = import.meta.env;

export const articleApi = createApi({
  reducerPath: "articleApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://article-extractor-and-summarizer.p.rapidapi.com/",
    prepareHeaders: (headers) => {
      headers.set("X-RapidAPI-Key", rapidApiKey);
      headers.set(
        "X-RapidAPI-Host",
        "article-extractor-and-summarizer.p.rapidapi.com"
      );
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getSummary: builder.query({
      query: (params) =>
        `/summarize?url=${encodeURIComponent(params.articleUrl)}&length=3`,
    }),
  }),
});

// to immediate call when app load
// export const {useGetSummaryQuery} = articleApi

// to immediate call on demand like btn click or something
export const { useLazyGetSummaryQuery } = articleApi;
