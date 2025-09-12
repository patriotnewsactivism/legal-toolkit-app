import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders toolkit header", () => {
  render(<App />);
  const heading = screen.getByText(/Civil Rights Legal Toolkit Pro/i);
  expect(heading).toBeInTheDocument();
});
