import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import useCreateQuote from "../src/hooks/useCreateQuote";
import { beforeEach, describe, expect, test, vi, Mock } from "vitest";
import CreateQuote from '../src/components/CreateQuote';
import React from "react";

vi.mock('../src/hooks/useCreateQuote', () => ({
  default: vi.fn(),
}));

describe("CreateQuote Component", () => {
  let mockMutate: Mock;
  let mockQuote: { quote: string; author: string };

  beforeEach(() => {
    mockQuote = { quote: 'Test Quote', author: 'Tester' };
    mockMutate = vi.fn();

    (useCreateQuote as unknown as Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isError: false,
      isSuccess: false,
    });
  });

  test("renders the form correctly", () => {
    const {container} = render(<CreateQuote />);

    const quoteInput = container.querySelector('[name="quote"]')!;
    const authorInput = container.querySelector('[name="author"]')!;
    const submitButton = container.querySelector('[name="btn-submit"]')!;

    expect(quoteInput).toBeInTheDocument();
    expect(authorInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  test("calls mutate function when form is submitted", async () => {
    const {container} = render(<CreateQuote />);

    const quoteInput = container.querySelector('[name="quote"]')!;
    const authorInput = container.querySelector('[name="author"]')!;
    const submitButton = container.querySelector('[name="btn-submit"]')!;

    fireEvent.change(quoteInput, { target: { value: "Test Quote" } });
    fireEvent.change(authorInput, { target: { value: "Test Author" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({ quote: "Test Quote", author: "Test Author" });
    });
  });

  test("displays success message when quote is added", () => {
    (useCreateQuote as unknown as Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isError: false,
      isSuccess: true,
    });

    render(<CreateQuote />);
    expect(screen.getByText(/quote added successfully/i)).toBeInTheDocument();
  });

  test("displays error message on failure", () => {
    (useCreateQuote as unknown as Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isError: true,
      isSuccess: false,
    });

    render(<CreateQuote />);
    expect(screen.getByText(/error creating quote/i)).toBeInTheDocument();
  });

  test("disables submit button when mutation is pending", () => {
    (useCreateQuote as unknown as Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
      isError: false,
      isSuccess: false,
    });

    const {container} = render(<CreateQuote />);
    
    const submitButton = container.querySelector('[name="btn-submit"]');
    expect(submitButton).toBeDisabled();
  });
});
