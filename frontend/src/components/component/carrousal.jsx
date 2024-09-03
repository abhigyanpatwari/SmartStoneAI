import * as React from "react";
import { MilestoneCard } from "@/components/component/milestone-card.jsx";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

export function CarouselSpacing({ milestones, userId, projectId }) {
    return (
        <Carousel className="w-full h-full">
            <CarouselContent className="-ml-1">
                {milestones.map((milestone, index) => (
                    <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3">
                        <div className="p-1">
                            <MilestoneCard
                                milestoneNumber={index + 1}
                                time={milestone.time}
                                title={milestone.title}
                                description={milestone.descriptions}
                                roles={milestone.roles.map(role => role.roles)}
                                deliverables={milestone.deliverables}
                                userId={userId}  // Pass userId to MilestoneCard
                                projectId={projectId}  // Pass projectId to MilestoneCard
                            />
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    );
}
