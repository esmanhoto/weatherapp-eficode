/* eslint-disable */

describe("Weather Forecast Test", () => {
  beforeEach(() => {
    cy.visit("http://localhost:8000");
  });

  it("Checks initial items", () => {
    cy.get("[data-test-id='forecastContainer']").should("be.visible");
    cy.wait(5000);
    cy.get('[data-test-id="dateTabs"]').should("be.visible");
    cy.get('[data-test-id="forecastTable"]').should("be.visible");
    cy.get('[data-test-id="forecastEntry"]').should("have.length.gt", 0);
  });

  it("should change forecast entries when clicking on different dates", () => {
    cy.wait(5000);
    let today = new Date();

    // Checks for each date button text
    for (let i = 0; i < 5; i++) {
      let date = new Date();
      date.setDate(today.getDate() + i);
      let weekday = date.toLocaleDateString("default", { weekday: "long" });
      cy.log("weekday", weekday);

      cy.get('[data-test-id="dateButton"]')
        .eq(i)
        .should("contain.text", i === 0 ? "Today" : weekday);
    }

    // Checks if they are clickable
    cy.get('[data-test-id="dateButton"]').then($dateButtons => {
      cy.wrap($dateButtons).eq(1).click();
      cy.wrap($dateButtons).eq(2).click();
      cy.wrap($dateButtons).eq(3).click();
      cy.wrap($dateButtons).eq(4).click();
    });

    // Check if the table is horizontally scrollable
    cy.get('[data-test-id="forecastTable"]').then($table => {
      expect($table[0].scrollWidth).to.be.gt($table[0].clientWidth);
    });
    cy.get('[data-test-id="forecastTable"]').then($table => {
      $table.scrollLeft(1500);
    });
    cy.get('[data-test-id="forecastEntry"]').last().should("be.visible");
  });
});

describe("Weather Forecast Test with Mock Data", function () {
  beforeEach(() => {
    // Stubbing the API response
    cy.intercept(
      {
        method: "GET",
        url: "**/api/forecast*"
      },
      { fixture: "weatherMock.json" }
    ).as("getForecast");
  });

  it("Checks if the forecast is displayed with mocked data", function () {
    // changing the current date to match with the stub data
    const now = new Date("2023-09-11").getTime();
    cy.clock(now);

    cy.visit("http://localhost:8000");

    cy.wait("@getForecast").then(interception => {
      expect(interception.response.statusCode).to.eq(200);
      expect(interception.response.body).to.exist;
    });

    cy.get('[data-test-id="forecastContainer"]').should("be.visible");
    cy.get('[data-test-id="temperatureEntry"]')
      .first()
      .should("be.visible")
      .and("contain.text", 1.11); // 1.11 was hard-coded in the stub to be checked against

    cy.get('[data-test-id="dateButton"]').then($dateButtons => {
      cy.wrap($dateButtons).eq(4).click();
    });

    cy.get('[data-test-id="forecastTable"]').then($table => {
      $table.scrollLeft(1500);
    });
    cy.get('[data-test-id="forecastEntry"]')
      .last()
      .should("be.visible")
      .and("contain.text", 1.11); // 1.11 was hard-coded in the stub to be checked against
  });
});
