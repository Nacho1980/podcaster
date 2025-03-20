import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import Loader from "../Loader";

const mockStore = configureMockStore([]);

describe("Loader", () => {
  it("renders the loader when isLoading is true", () => {
    const store = mockStore({
      podcasts: {
        isLoading: true,
      },
    });

    render(
      <Provider store={store}>
        <Loader />
      </Provider>
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveClass("animate-ping");
    expect(screen.getByRole("status")).toHaveClass("bg-blue-500");
    expect(screen.getByRole("status")).toHaveClass("rounded-full");
  });

  it("does not render the loader when isLoading is false", () => {
    const store = mockStore({
      podcasts: {
        isLoading: false,
      },
    });

    render(
      <Provider store={store}>
        <Loader />
      </Provider>
    );

    expect(screen.queryByRole("status")).toBeNull();
  });
});
