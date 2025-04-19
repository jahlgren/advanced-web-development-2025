import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NiceModal from "@ebay/nice-modal-react";
import { showCreateProjectModal } from "@/components/modals/create-project-modal";
import { useCreateProjectMutation } from "@/mutations/use-create-project-mutation";
import { useEffect } from "react";
import '@testing-library/jest-dom';

// Mock the mutation
jest.mock("@/mutations/use-create-project-mutation");

describe("CreateProjectModal", () => {
  const mutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useCreateProjectMutation as jest.Mock).mockReturnValue({
      mutate,
      isPending: false,
    });
  });

  it("allows user to fill in form and submit", async () => {
    const user = userEvent.setup();

    render(
      <NiceModal.Provider>
        {/* Show modal inside provider */}
        <TestWrapper />
      </NiceModal.Provider>
    );

    // Modal should appear
    expect(await screen.findByText(/Create a New Project/i)).toBeInTheDocument();

    // Fill title
    await user.type(screen.getByLabelText(/Title/i), "My Cool Project");

    // Fill description
    await user.type(screen.getByLabelText(/Description/i), "This is a test project");

    // Fill categories
    await user.type(screen.getByLabelText(/Categories/i), "Design, Dev");

    // Click Create button
    await user.click(screen.getByRole("button", { name: /Create/i }));

    await waitFor(() => {
      expect(mutate).toHaveBeenCalledWith(
        {
          title: "My Cool Project",
          description: "This is a test project",
          categories: ["Design", "Dev"],
        },
        expect.any(Object) // mutation options
      );
    });
  });
});

// Helper component to trigger modal
function TestWrapper() {
  useEffect(() => {
    showCreateProjectModal();
  }, []);

  return null;
}
