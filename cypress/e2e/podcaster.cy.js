describe("Podcast App E2E Tests", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get('[data-testid="loader"]').should("exist"); // Wait for initial loader
    cy.get('[data-testid="loader"]').should("not.exist");
  });

  it("loads the home page and displays podcasts", () => {
    cy.get('[data-testid="podcast-card"]').should("have.length.greaterThan", 0);
    cy.get('[data-testid="header-title"]').should("contain", "Podcaster");
    cy.get('[data-testid="filter-input"]').should("exist");
  });

  it("filters podcasts by title", () => {
    const filterText = "music";
    cy.get('[data-testid="filter-input"]').type(filterText);
    cy.wait(1000); // Wait for 1 second
    cy.get('[data-testid="podcast-card"]').each(($card) => {
      // Access the DOM element using $card[0]
      const title = $card[0]
        .querySelector('[data-testid="podcast-title"]')
        .textContent.toLowerCase();
      const author = $card[0]
        .querySelector('[data-testid="podcast-author"]')
        .textContent.toLowerCase();
      return (
        title.includes(filterText.toLowerCase()) ||
        author.includes(filterText.toLowerCase())
      );
    });
  });

  it("navigates to podcast detail page and displays details", () => {
    cy.get('[data-testid="podcast-card"]').first().click();
    cy.get('[data-testid="loader"]').should("not.exist");
    cy.url().should("include", "/podcast/");
    cy.get('[data-testid="podcast-sidebar"]').should("exist");
    cy.get('[data-testid="episode-list"]').should("exist");
    cy.get('[data-testid="episode-list-item"]').should(
      "have.length.greaterThan",
      0
    );
  });

  it("navigates to episode detail page and plays episode", () => {
    cy.get('[data-testid="podcast-card"]').first().click();
    cy.get('[data-testid="loader"]').should("not.exist");
    cy.get('[data-testid="episode-list-item"]').first().click();
    cy.get('[data-testid="loader"]').should("not.exist");
    cy.url().should("include", "/episode/");
    cy.get('[data-testid="episode-player"]').should("exist");
    cy.get("audio", { timeout: 10000 }).then(($audio) => {
      const audio = $audio[0];
      audio.addEventListener("loadedmetadata", () => {
        audio
          .play()
          .then(() => {
            cy.wait(1000);
            expect(audio.paused).to.be.false;
            audio.pause();
          })
          .catch((error) => {
            cy.log(`Audio play error: ${error.message}`);
            if (
              error.message !==
              "The play() request was interrupted because the media was removed from the document."
            ) {
              throw error;
            }
          });
      });
    });
  });

  it("navigates back to home page from header", () => {
    cy.get('[data-testid="podcast-card"]').first().click();
    cy.get('[data-testid="loader"]').should("not.exist");
    cy.get('[data-testid="header-title"]').click();
    cy.get('[data-testid="loader"]').should("not.exist");
    cy.url().should("eq", `${Cypress.config().baseUrl}/`);
    cy.get('[data-testid="podcast-card"]').should("have.length.greaterThan", 0);
  });

  it("navigates from episode page back to podcast page", () => {
    cy.get('[data-testid="podcast-card"]').first().click();
    cy.get('[data-testid="loader"]').should("not.exist");
    cy.get('[data-testid="episode-list-item"]').first().click();
    cy.get('[data-testid="loader"]').should("not.exist");
    cy.get('[data-testid="podcast-sidebar"]').click();
    cy.get('[data-testid="loader"]').should("not.exist");
    cy.url().should("include", "/podcast/");
  });

  it("handles error on podcast detail page", () => {
    // Select a podcast card
    cy.get('[data-testid="podcast-card"]').first().click();
    // Intercept the podcast details API call and force a 500 error
    cy.intercept(
      {
        method: "GET",
        url: `https://thingproxy.freeboard.io/fetch/https://itunes.apple.com/lookup?id=*&country=US&media=podcast&entity=podcastEpisode&limit=100`,
      },
      { statusCode: 500 }
    ).as("podcastDetailError");
    // Wait for the API call to fail
    cy.wait("@podcastDetailError");
    // Check for the error message
    cy.get("div").should("contain", "Error loading podcast detail");
    // Check that loader is gone
    cy.get('[data-testid="loader"]').should("not.exist");
  });
});
