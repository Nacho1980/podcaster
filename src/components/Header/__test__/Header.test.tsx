import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import configureMockStore from "redux-mock-store";
import {
  deselectEpisode,
  deselectPodcast,
} from "../../../reducers/podcastReducer";
import Header from "../Header";

const mockStore = configureMockStore([]);

describe("Header", () => {
  it("renders the link", () => {
    const store = mockStore({
      podcasts: {
        isLoading: false,
      },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText("Podcaster")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Podcaster/i })).toHaveAttribute(
      "href",
      "/"
    );
  });

  it("dispatches deselectPodcast and deselectEpisode actions when the link is clicked", () => {
    const store = mockStore({
      podcasts: {
        isLoading: false,
      },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </Provider>
    );

    fireEvent.click(screen.getByRole("link", { name: /Podcaster/i }));

    const actions = store.getActions();
    expect(actions).toEqual([deselectPodcast(), deselectEpisode()]);
  });
});
