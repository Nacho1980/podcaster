import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { useDispatch } from "react-redux";
import { BrowserRouter, useNavigate } from "react-router-dom";
import { selectPodcast } from "../../../reducers/podcastReducer";
import PodcastCard from "../PodcastCard";

// Mock react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

// Type-safe react-redux mock
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
}));

describe("PodcastCard", () => {
  const mockPodcast = {
    id: "123",
    imageUrl: "test-image.jpg",
    title: "Test Podcast",
    author: "Test Author",
    description: "Test Description",
    episodes: [],
  };

  // Create properly typed mock dispatch
  const mockDispatch = jest.fn();
  const mockedUseDispatch = useDispatch as jest.MockedFunction<
    typeof useDispatch
  >;

  beforeEach(() => {
    mockedUseDispatch.mockImplementation(() => mockDispatch);
    jest.clearAllMocks();
  });

  it("renders podcast data correctly", () => {
    render(
      <BrowserRouter>
        <PodcastCard podcast={mockPodcast} />
      </BrowserRouter>
    );

    expect(screen.getByAltText("Test Podcast")).toBeInTheDocument();
    expect(screen.getByText("Test Podcast")).toBeInTheDocument();
    expect(screen.getByText("Author: Test Author")).toBeInTheDocument();
  });

  it("navigates to podcast detail and dispatches action on click", () => {
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    render(
      <BrowserRouter>
        <PodcastCard podcast={mockPodcast} />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByTestId("podcast-card"));

    expect(mockNavigate).toHaveBeenCalledWith("/podcast/123");
    expect(mockDispatch).toHaveBeenCalledWith(selectPodcast(mockPodcast));
  });
});
