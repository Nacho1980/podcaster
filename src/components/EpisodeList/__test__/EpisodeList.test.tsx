import { screen } from "@testing-library/dom";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import { Episode } from "../../../types/Episode";
import EpisodeList from "../EpisodeList";

const mockStore = configureStore([]);

describe("EpisodeList", () => {
  it("renders a list of episodes correctly", () => {
    const episodes = [
      {
        id: "1",
        title: "Episode 1",
        date: "2023-01-01",
        duration: "30:00",
        description: "Episode desc 1",
        url: "http://url.com",
      },
      {
        id: "2",
        title: "Episode 2",
        date: "2023-01-02",
        duration: "45:00",
        description: "Episode desc 2",
        url: "http://url.com",
      },
    ];

    const store = mockStore({
      podcasts: {
        selectedPodcast: {
          id: "123",
          title: "Test Podcast",
          author: "Test Author",
          description: "Test Description",
          imageUrl: "test.jpg",
          episodes: episodes,
        },
      },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <EpisodeList episodes={episodes} />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText("Episodes: 2")).toBeInTheDocument();
    expect(screen.getByText("Episode 1")).toBeInTheDocument();
    expect(screen.getByText("Episode 2")).toBeInTheDocument();
    expect(screen.getByText("2023-01-01")).toBeInTheDocument();
    expect(screen.getByText("2023-01-02")).toBeInTheDocument();
    expect(screen.getByText("30:00")).toBeInTheDocument();
    expect(screen.getByText("45:00")).toBeInTheDocument();
  });

  it("renders the header row correctly", () => {
    const episodes: Episode[] = [];

    const store = mockStore({
      podcasts: {
        selectedPodcast: {
          id: "123",
          title: "Test Podcast",
          author: "Test Author",
          description: "Test Description",
          imageUrl: "test.jpg",
          episodes: episodes,
        },
      },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <EpisodeList episodes={episodes} />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("Duration")).toBeInTheDocument();
  });
});
