import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "../types/AppState";
import { Episode } from "../types/Episode";
import { Podcast } from "../types/Podcast";

/**
 * Redux reducer to update the state with different actions
 * @param state
 * @param action
 */
const initialState: AppState = {
  selectedPodcast: null,
  selectedEpisode: null,
  filterText: "",
  isLoading: false,
};
const podcastSlice = createSlice({
  name: "podcasts",
  initialState,
  reducers: {
    selectPodcast: (state, action: PayloadAction<Podcast>) => {
      state.selectedPodcast = action.payload;
    },
    deselectPodcast: (state) => {
      state.selectedPodcast = null;
    },
    selectEpisode: (state, action: PayloadAction<Episode>) => {
      state.selectedEpisode = action.payload;
    },
    deselectEpisode: (state) => {
      state.selectedEpisode = null;
    },
    setFilterText: (state, action: PayloadAction<string>) => {
      state.filterText = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  selectPodcast,
  deselectPodcast,
  selectEpisode,
  deselectEpisode,
  setFilterText,
  setLoading,
} = podcastSlice.actions;

export default podcastSlice.reducer;
