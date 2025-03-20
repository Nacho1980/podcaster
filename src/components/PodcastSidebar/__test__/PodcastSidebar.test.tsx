import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter, useNavigate } from "react-router-dom";
import PodcastSidebar from "../PodcastSidebar";

// Mock useNavigate
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("PodcastSidebar", () => {
  const mockPodcast = {
    id: "123",
    imageUrl: "test-image.jpg",
    title: "Test Podcast",
    author: "Test Author",
    description: "Test Description",
    episodes: [],
  };

  it("renders podcast data correctly", () => {
    render(
      <BrowserRouter>
        <PodcastSidebar podcast={mockPodcast} />
      </BrowserRouter>
    );

    expect(screen.getByAltText("Test Podcast")).toBeInTheDocument();
    expect(screen.getByText("Test Podcast")).toBeInTheDocument();
    expect(screen.getByText("by Test Author")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  it("navigates to podcast detail on click", () => {
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    render(
      <BrowserRouter>
        <PodcastSidebar podcast={mockPodcast} />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByTestId("podcast-sidebar"));

    expect(mockNavigate).toHaveBeenCalledWith("/podcast/123");
  });
});
