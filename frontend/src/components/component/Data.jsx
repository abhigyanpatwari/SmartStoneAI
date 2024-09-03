"use client"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { BorderedLabel } from "@/components/component/bordered-label.jsx";

// Helper function to parse callbacks string
const parseCallbacks = (callbacks) => {
    if (typeof callbacks !== 'string') {
        return {}; // Return an empty object if callbacks is not a string
    }

    const lines = callbacks.split('\n').map(line => line.trim());
    const data = {};

    lines.forEach(line => {
        const [key, value] = line.split(':').map(item => item.trim());
        if (key && value) {
            data[key] = value;
        }
    });

    return data;
};

export default function Component({ averageCosineSimilarity, generationTime, callbacks }) {
    const parsedCallbacks = parseCallbacks(callbacks);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Output Technical Data</CardTitle>
            </CardHeader>
            <CardContent>
                <Label>Average Cosine Similarity</Label>
                <div className="grid gap-6 pt-2">
                    <BorderedLabel value={averageCosineSimilarity || "N/A"} />
                </div>
                <div className="pt-6">
                    <Label>Generation time (in seconds)</Label>
                    <div className="grid gap-6 pt-2">
                        <BorderedLabel value={generationTime || "N/A"} />
                    </div>
                </div>
                <div className="pt-14">
                    <Card>
                        <CardHeader>
                            <CardTitle>Callback Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6 pt-2">
                                <div className="space-y-2">
                                    <div className="pt-4">
                                        <Label>Tokens Used</Label>
                                        <BorderedLabel value={parsedCallbacks["Tokens Used"] || "N/A"}/>
                                    </div>
                                    <div className="pt-4">
                                        <Label>Prompt Tokens</Label>
                                        <BorderedLabel value={parsedCallbacks["Prompt Tokens"] || "N/A"}/>
                                    </div>
                                    <div className="pt-4">
                                        <Label>Completion Tokens</Label>
                                        <BorderedLabel value={parsedCallbacks["Completion Tokens"] || "N/A"}/>
                                    </div>
                                    <div className="pt-4">
                                        <Label>Successful Requests</Label>
                                        <BorderedLabel value={parsedCallbacks["Successful Requests"] || "N/A"}/>
                                    </div>
                                    <div className="pt-4">
                                        <Label>Total Cost (USD)</Label>
                                        <BorderedLabel value={parsedCallbacks["Total Cost (USD)"] || "N/A"}/>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </CardContent>
        </Card>
    )
}
