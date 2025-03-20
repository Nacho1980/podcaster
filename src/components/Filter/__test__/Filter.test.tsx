import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { setFilterText } from "../../../reducers/podcastReducer";
import Filter from "../Filter";

const mockStore = configureStore([]);

describe("Filter", () => {
  it("displays the correct initial filter text", () => {
    const store = mockStore({
      podcasts: {
        filterText: "initial filter",
      },
    });

    render(
      <Provider store={store}>
        <Filter />
      </Provider>
    );

    const inputElement = screen.getByPlaceholderText(
      "Filter podcasts..."
    ) as HTMLInputElement;
    expect(inputElement.value).toBe("initial filter");
  });

  it("dispatches the setFilterText action when the input value changes", () => {
    const store = mockStore({
      podcasts: {
        filterText: "",
      },
    });

    render(
      <Provider store={store}>
        <Filter />
      </Provider>
    );

    const inputElement = screen.getByPlaceholderText(
      "Filter podcasts..."
    ) as HTMLInputElement;
    fireEvent.change(inputElement, { target: { value: "new filter" } });

    const actions = store.getActions();
    expect(actions).toEqual([setFilterText("new filter")]);
  });

  it("renders the div with the number 100", () => {
    const store = mockStore({
      podcasts: {
        filterText: "",
      },
    });

    render(
      <Provider store={store}>
        <Filter />
      </Provider>
    );

    expect(screen.getByText("100")).toBeInTheDocument();
  });
});
