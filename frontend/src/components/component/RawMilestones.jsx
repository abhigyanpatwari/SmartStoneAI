"use client"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"

import { ScrollArea } from "@/components/ui/scroll-area"



import {BorderedLabel} from "@/components/component/bordered-label.jsx";






export default function Component({rawMilestones}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Raw Milestones</CardTitle>

            </CardHeader>
            <CardContent>


                <div className="pt-2">
                    {/*<BorderedLabel value={rawMilestones}/>*/}
                    <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                        {rawMilestones}
                    </ScrollArea>
                </div>
            </CardContent>
        </Card>
    )
}
