import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import configureMockStore from "redux-mock-store";
import * as useTopPodcastsModule from "../../../hooks/useTopPodcasts";
import { setLoading } from "../../../reducers/podcastReducer";
import PodcastList from "../PodcastList";

const mockStore = configureMockStore([]);

describe("PodcastList", () => {
  const mockPodcasts = [
    {
      id: "1",
      title: "Podcast 1",
      author: "Author A",
      imageUrl: "url1",
      description: "Description 1",
      episodes: [],
    },
    {
      id: "2",
      title: "Podcast 2",
      author: "Author B",
      imageUrl: "url2",
      description: "Description 2",
      episodes: [],
    },
  ];

  it("renders podcasts correctly", () => {
    jest.spyOn(useTopPodcastsModule, "useTopPodcasts").mockReturnValue({
      podcasts: mockPodcasts,
      loading: false,
      error: null,
    });

    const store = mockStore({ podcasts: { filterText: "" } });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <PodcastList />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText("Podcast 1")).toBeInTheDocument();
    expect(screen.getByText("Podcast 2")).toBeInTheDocument();
  });

  it("renders error message when error occurs", () => {
    jest.spyOn(useTopPodcastsModule, "useTopPodcasts").mockReturnValue({
      podcasts: [],
      loading: false,
      error: "Test Error",
    });

    const store = mockStore({ podcasts: { filterText: "" } });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <PodcastList />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText("Error: Test Error")).toBeInTheDocument();
  });

  it("filters podcasts correctly", () => {
    jest.spyOn(useTopPodcastsModule, "useTopPodcasts").mockReturnValue({
      podcasts: mockPodcasts,
      loading: false,
      error: null,
    });

    const store = mockStore({ podcasts: { filterText: "Podcast 1" } });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <PodcastList />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText("Podcast 1")).toBeInTheDocument();
    expect(screen.queryByText("Podcast 2")).toBeNull();
  });

  it("dispatches setLoading when loading state changes", () => {
    const store = mockStore({ podcasts: { filterText: "" } });

    jest.spyOn(useTopPodcastsModule, "useTopPodcasts").mockReturnValue({
      podcasts: mockPodcasts,
      loading: true,
      error: null,
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <PodcastList />
        </BrowserRouter>
      </Provider>
    );

    const actions = store.getActions();
    expect(actions).toEqual([setLoading(true)]);
  });
});
