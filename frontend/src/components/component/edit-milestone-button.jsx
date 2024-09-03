import { useState, useMemo } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";

// eslint-disable-next-line react/prop-types
export function EditMilestoneButton({ milestoneNumber, title, description, roles: initialRoles, deliverables: initialDeliverables, time, userId, projectId, onSave }) {
  const [roles, setRoles] = useState(initialRoles);
  const [deliverables, setDeliverables] = useState(initialDeliverables);
  const [milestoneTitle, setMilestoneTitle] = useState(title);
  const [milestoneDescription, setMilestoneDescription] = useState(description);
  const [open, setOpen] = useState(false); // State to control dialog open/close

  const initialValues = useMemo(() => ({
    milestoneTitle: title,
    milestoneDescription: description,
    roles: initialRoles,
    deliverables: initialDeliverables,
  }), [title, description, initialRoles, initialDeliverables]);

  const addRole = () => {
    setRoles([...roles, ""]);
  };

  const addDeliverable = () => {
    setDeliverables([...deliverables, ""]);
  };

  const handleRoleChange = (index, value) => {
    const newRoles = [...roles];
    newRoles[index] = value;
    setRoles(newRoles);
  };

  const handleDeliverableChange = (index, value) => {
    const newDeliverables = [...deliverables];
    newDeliverables[index] = value;
    setDeliverables(newDeliverables);
  };

  const removeRole = (index) => {
    const newRoles = [...roles];
    newRoles.splice(index, 1);
    setRoles(newRoles);
  };

  const removeDeliverable = (index) => {
    const newDeliverables = [...deliverables];
    newDeliverables.splice(index, 1);
    setDeliverables(newDeliverables);
  };

  const handleSaveChanges = async () => {
    // Check if any changes have been made using useMemo
    const isChanged =
        milestoneTitle !== initialValues.milestoneTitle ||
        milestoneDescription !== initialValues.milestoneDescription ||
        roles.join(",") !== initialValues.roles.join(",") ||
        deliverables.join(",") !== initialValues.deliverables.join(",");

    if (!isChanged) {
      setOpen(false); // Close the dialog without making the backend call
      return;
    }

    const updatedMilestone = {
      index: milestoneNumber,  // Include the index of the milestone
      title: milestoneTitle,
      description: milestoneDescription,
      roles,
      deliverables,
      time,  // Include the time (weeks)
      user_id: userId,  // Ensure you pass the correct user_id
      project_id: projectId  // Ensure you pass the correct project_id
    };

    try {
      await axios.post('http://127.0.0.1:8000/update_milestone/', updatedMilestone);
      onSave(updatedMilestone);
      setOpen(false); // Close the dialog on success
    } catch (error) {
      console.error('Error updating milestone:', error);
    }
  };

  return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="default" onClick={() => setOpen(true)}>Edit Milestone</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit milestone</DialogTitle>
            <DialogDescription>Make changes to the milestone here. Click save when you're done.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                  id="title"
                  value={milestoneTitle}
                  onChange={(e) => setMilestoneTitle(e.target.value)}
                  className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                  id="description"
                  value={milestoneDescription}
                  onChange={(e) => setMilestoneDescription(e.target.value)}
                  className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4 relative">
              <Label htmlFor="role" className="text-right">
                Roles
              </Label>
              <div className="col-span-3 flex flex-col items-start gap-2">
                {roles.map((role, index) => (
                    <div key={index} className="flex items-center gap-2 w-full">
                      <Input
                          type="text"
                          id={`role-${index}`}
                          value={role}
                          onChange={(e) => handleRoleChange(index, e.target.value)}
                          className="w-[100px]"
                      />
                      {index > 0 && (
                          <Button variant="outline" size="icon" onClick={() => removeRole(index)}>
                            <MinusIcon className="h-4 w-4" />
                            <span className="sr-only">Remove Role</span>
                          </Button>
                      )}
                    </div>
                ))}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={addRole}
                    className="absolute right-0 translate-y-1">
                  <PlusIcon className="h-4 w-4" />
                  <span className="sr-only">Add Role</span>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4 relative">
              <Label htmlFor="deliverables" className="text-right">
                Deliverables
              </Label>
              <div className="col-span-3 flex flex-col items-start gap-2">
                {deliverables.map((deliverable, index) => (
                    <div key={index} className="flex items-center gap-2 w-full">
                      <Input
                          type="text"
                          id={`deliverable-${index}`}
                          value={deliverable}
                          onChange={(e) => handleDeliverableChange(index, e.target.value)}
                          className="w-[100px]"
                      />
                      {index > 0 && (
                          <Button variant="outline" size="icon" onClick={() => removeDeliverable(index)}>
                            <MinusIcon className="h-4 w-4" />
                            <span className="sr-only">Remove Deliverable</span>
                          </Button>
                      )}
                    </div>
                ))}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={addDeliverable}
                    className="absolute right-0 translate-y-1">
                  <PlusIcon className="h-4 w-4" />
                  <span className="sr-only">Add Deliverable</span>
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSaveChanges}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  );
}

function MinusIcon(props) {
  return (
      <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
      >
        <path d="M5 12h14" />
      </svg>
  );
}

function PlusIcon(props) {
  return (
      <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
      >
        <path d="M5 12h14" />
        <path d="M12 5v14" />
      </svg>
  );
}
