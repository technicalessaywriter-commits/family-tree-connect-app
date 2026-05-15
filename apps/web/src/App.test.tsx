import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("shows authentication screen when logged out", () => {
    localStorage.clear();
    render(<App />);
    expect(screen.getByText("Familia Connect")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
  });
});
