const request = require("supertest");
const chai = require("chai");
const expect = chai.expect;
const app = require("../src/index");

describe("Weather App API", () => {
  describe("GET /api/forecast", () => {
    it("should require latitude and longitude", async () => {
      const res = await request(app.callback()).get("/api/forecast");
      expect(res.status).to.equal(400);
      expect(res.text).to.equal("Latitude and Longitude are required.");
    });

    it("should fetch the forecast for the given coordinates", async () => {
      const lat = 60.1694696;
      const lon = 24.9235992;
      const res = await request(app.callback()).get(
        `/api/forecast?lat=${lat}&lon=${lon}`
      );
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
    });

    it("should handle invalid latitudes", async () => {
      const invalidLatitudes = ["", "invalidString", "200", "-200"];
      const lon = 24.9235992;

      for (const lat of invalidLatitudes) {
        const res = await request(app.callback()).get(
          `/api/forecast?lat=${lat}&lon=${lon}`
        );
        expect(res.status).to.be.oneOf(
          [400, 422],
          `Failed for latitude: ${lat}`
        );
      }
    });

    it("should handle invalid longitude", async () => {
      const lat = 60.1694696;
      const invalidLongitudes = [
        "",
        "invalidString",
        "190",
        "-190",
        "ABC",
        "   ",
        "@!#$",
      ];

      for (const lon of invalidLongitudes) {
        const res = await request(app.callback()).get(
          `/api/forecast?lat=${lat}&lon=${lon}`
        );
        expect(res.status).to.be.oneOf(
          [400, 422],
          `Failed for longitude: ${lon}`
        );
      }
    });
  });
});
