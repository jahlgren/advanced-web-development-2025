import { render, screen, waitFor } from "@testing-library/react";
import { useCategoriesQuery } from "@/queries/use-categories-query";
import { useActiveTimelogQuery } from "@/queries/use-active-timelog-query";
import { useCreateTimelogMutation } from "@/mutations/use-create-timelog-mutation";
import { useUpdateTimelogMutation } from "@/mutations/use-update-timelog-mutation";
import userEvent from "@testing-library/user-event";
import { TimelogControlBlock } from "@/components/blocks/timelog-control-block";
import '@testing-library/jest-dom';

jest.mock("@/queries/use-categories-query");
jest.mock("@/queries/use-active-timelog-query");
jest.mock("@/mutations/use-create-timelog-mutation");
jest.mock("@/mutations/use-update-timelog-mutation");

const mockUseCategoriesQuery = useCategoriesQuery as jest.Mock;
const mockUseActiveTimelogQuery = useActiveTimelogQuery as jest.Mock;
const mockUseCreateTimelogMutation = useCreateTimelogMutation as jest.Mock;
const mockUseUpdateTimelogMutation = useUpdateTimelogMutation as jest.Mock;

const mockProjectId = "test-project-id";

// Required for some radix ui (shadcn ui) component testing..
if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = () => false;
}
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = jest.fn();
}
// ---

describe("TimelogControlBlock", () => {
  beforeEach(() => {
    // Default mock return values
    mockUseCategoriesQuery.mockReturnValue({
      data: [
        { id: "cat1", name: "Design" },
        { id: "cat2", name: "Development" },
      ],
      isPending: false,
      error: null,
    });

    mockUseActiveTimelogQuery.mockReturnValue({
      data: null,
      isPending: false,
    });

    mockUseCreateTimelogMutation.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });

    mockUseUpdateTimelogMutation.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      isError: false,
    });
  });

  it("renders without crashing", () => {
    render(<TimelogControlBlock projectId={mockProjectId} />);
    expect(screen.getByText(/Start New Timelog/i)).toBeInTheDocument();
  });

  it("disables start button when no category is selected", () => {
    render(<TimelogControlBlock projectId={mockProjectId} />);
    expect(screen.getByRole("button", { name: /Start/i })).toBeDisabled();
  });

  it("allows selecting a category and entering description", async () => {
    render(<TimelogControlBlock projectId={mockProjectId} />);

    const select = screen.getByTestId('category-select-trigger');
    await userEvent.click(select);

    const option = await screen.findByText(/Design/i);
    await userEvent.click(option);

    const textarea = screen.getByTestId("description-textarea");
    await userEvent.type(textarea, "Working on homepage");

    expect(textarea).toHaveValue("Working on homepage");
  });

  it("calls start mutation when Start is clicked", async () => {
    const startMock = jest.fn();
    mockUseCreateTimelogMutation.mockReturnValue({
      mutate: startMock,
      isPending: false,
    });

    render(<TimelogControlBlock projectId={mockProjectId} />);

    const select = screen.getByTestId('category-select-trigger');
    await userEvent.click(select);

    const option = await screen.findByText(/Design/i);
    await userEvent.click(option);

    const startBtn = screen.getByRole("button", { name: /Start/i });
    expect(startBtn).toBeEnabled();
    await userEvent.click(startBtn);

    await waitFor(() => {
      expect(startMock).toHaveBeenCalled();
    });
  });

  it("calls update mutation when Stop is clicked", async () => {
    const updateMock = jest.fn();
    const activeTimelogMock = {
      id: "timelog-1",
      categoryId: "cat1",
      description: "Working on homepage",
      start: new Date(),
    };
  
    mockUseActiveTimelogQuery.mockReturnValue({
      data: activeTimelogMock,
      isPending: false,
    });
  
    mockUseUpdateTimelogMutation.mockReturnValue({
      mutate: updateMock,
      isPending: false,
      isError: false,
    });
  
    render(<TimelogControlBlock projectId={mockProjectId} />);
  
    const stopBtn = await screen.findByRole("button", { name: /Stop/i });
    expect(stopBtn).toBeEnabled();
  
    await userEvent.click(stopBtn);
  
    await waitFor(() => {
      expect(updateMock).toHaveBeenCalledWith(
        expect.objectContaining({
          projectId: mockProjectId,
          timelogId: "timelog-1",
          categoryId: "cat1",
          description: "Working on homepage",
          end: expect.any(String),
        }),
        expect.any(Object) // mutation options
      );
    });
  });
});
