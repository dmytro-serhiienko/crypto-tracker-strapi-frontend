/// <reference types="cypress" />

describe("Crypto Tracker E2E Test", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/api/coins**", {
      statusCode: 200,
      body: {
        data: [
          {
            documentId: "btc",
            name: "Bitcoin",
            symbol: "BTC",
            category: "Layer1",
            currentPrice: 62945.03,
            priceChange24h: -0.32,
            sparkline: [62800, 62710, 62945],
            description: "Bitcoin test coin",
            logo: null,
          },
          {
            documentId: "eth",
            name: "Ethereum",
            symbol: "ETH",
            category: "Layer1",
            currentPrice: 1698.36,
            priceChange24h: -0.84,
            sparkline: [1710, 1703, 1698],
            description: "Ethereum test coin",
            logo: null,
          },
        ],
      },
    }).as("getCoins");

    cy.visit("/");
    cy.wait("@getCoins");
  });

  it("renders tracker header", () => {
    cy.contains("Crypto Tracker", { timeout: 10000 }).should("be.visible");
  });

  it("loads coins list", () => {
    cy.contains("Bitcoin", { timeout: 10000 }).should("be.visible");
    cy.contains("Ethereum", { timeout: 10000 }).should("be.visible");
  });
});
