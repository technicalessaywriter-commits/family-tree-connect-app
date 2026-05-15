import { describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "./app.js";

describe("health", () => {
  it("returns ok", async () => {
    const response = await request(createApp()).get("/health");
    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
  });
});
