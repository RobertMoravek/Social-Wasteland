import BioEditor from "./bioEditor.js";
import { render, fireEvent, waitFor } from "@testing-library/react";

test("Shows Add button when no prop is passed", () => {
    const { container } = render(<BioEditor/>);
    expect(container.querySelector("button").innerHTML).toContain("Add");
});

test("When a bio is passed to it, an Edit button is rendered", () => {
    const { container } = render(<BioEditor bio="hallo"/>);
    expect(container.querySelector("button").innerHTML).toContain("Edit");
});

test('Clicking either the "Add" or "Edit" button causes a textarea and a "Save" button to be rendered', () => {
    const { container } = render(<BioEditor bio="hallo"/>);
    fireEvent.click(container.querySelector("button"));
    expect(container.querySelector("button").innerHTML).toContain("Save");
    expect(container.querySelectorAll("textarea").length).toBe(1);
});

test("Clicking the Save button causes an HTTP request", async () => {
    fetch.mockResolvedValueOnce({
        async json() {
            return {
                bio: "123456",
                isEditorOpen: false
            };
        },
    });

    function giveBackBio(newBio){
        
    }

    const { container } = render(<BioEditor giveBackBio={giveBackBio}/>);

    fireEvent.click(container.querySelector("button#add"));

    await waitFor(() => expect(container.querySelector("button#save")).toBeTruthy());

    fireEvent.change(container.querySelector("textarea"), {target: {value: "123456"}});

    fireEvent.click(container.querySelector("button#save"));

    await waitFor(() => expect(container.querySelectorAll("textarea").length).toBe(0));

    expect(container.querySelector("button").innerHTML).toContain("Add");

    // expect(container.querySelector("div.bioText").innerHTML).toContain("123456");



});

