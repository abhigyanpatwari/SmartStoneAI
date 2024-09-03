import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EditMilestoneButton } from "@/components/component/edit-milestone-button.jsx";
import { useState } from "react";

// eslint-disable-next-line react/prop-types
export function MilestoneCard({ milestoneNumber, time, title, description, roles, deliverables, userId, projectId }) {
    const [milestoneData, setMilestoneData] = useState({
        title,
        description,
        roles,
        deliverables,
    });

    const handleSave = (updatedMilestone) => {
        setMilestoneData(updatedMilestone);
    };

    return (
        <Card className="mx-auto relative flex flex-col p-4 space-y-4 w-96">
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                <Badge
                    variant="outline"
                    className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs font-medium">
                    Milestone: {milestoneNumber}
                </Badge>
                <Badge
                    variant="outline"
                    className="bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-medium">
                    {time} {time > 1 ? 'weeks' : 'week'}
                </Badge>
            </div>
            <div className="pt-12">
                <CardHeader className="flex flex-col space-y-2 text-left">
                    <CardTitle>{milestoneData.title}</CardTitle>
                    <CardDescription className="overflow-wrap break-word">
                        {milestoneData.description}
                    </CardDescription>
                </CardHeader>
            </div>
            <CardContent className="text-left space-y-10">
                <div className="flex flex-col space-y-2">
                    <CardTitle>Roles</CardTitle>
                    <CardDescription className="overflow-wrap break-word">
                        {milestoneData.roles.length > 0 ? milestoneData.roles.join(', ') : 'No roles specified'}
                    </CardDescription>
                </div>
                <div className="flex flex-col space-y-2">
                    <CardTitle>Deliverables</CardTitle>
                    <CardDescription className="overflow-wrap break-word">
                        {milestoneData.deliverables.length > 0 ? milestoneData.deliverables.join(', ') : 'No deliverables specified'}
                    </CardDescription>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                {/*<Button variant="outline">Cancel</Button>*/}
                <EditMilestoneButton
                    milestoneNumber={milestoneNumber}  // Pass milestone number to identify which milestone is being edited
                    time={time}  // Pass the time associated with the milestone
                    title={milestoneData.title}
                    description={milestoneData.description}
                    roles={milestoneData.roles}
                    deliverables={milestoneData.deliverables}
                    userId={userId}  // Pass user ID to uniquely identify the user
                    projectId={projectId}  // Pass project ID to uniquely identify the project
                    onSave={handleSave}
                >
                    Edit
                </EditMilestoneButton>
            </CardFooter>
        </Card>
    );
}
