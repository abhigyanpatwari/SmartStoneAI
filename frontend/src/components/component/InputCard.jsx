"use client"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ModifiedSlider } from "@/components/component/modified-slider.jsx"
import { Button } from "@/components/ui/button.jsx";
import { ModelSelect } from "@/components/component/model-select.jsx";
import { Switch } from "@/components/ui/switch.jsx";

export default function Component({
                                      userId,
                                      setUserId,
                                      projectDescription,
                                      setProjectDescription,
                                      modifyingPrompt,
                                      setModifyingPrompt,
                                      totalWeeks,
                                      setTotalWeeks,
                                      evaluate,
                                      setEvaluate,
                                      model,
                                      setModel,
                                      handleFormSubmit
                                  }) {

    return (
        <Card>
            <CardHeader>
                <CardTitle>Milestone Planning AI</CardTitle>
                <CardDescription>
                    <div className="pt-3 pb-3">I will help you set milestones for your project</div>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleFormSubmit}>
                    <div className="grid gap-3">
                        <Label htmlFor="user-id">User ID</Label>
                        <Input
                            id="user-id"
                            type="number"
                            className="w-full"
                            placeholder="Enter your user ID..."
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-3 pt-6">
                        <Label htmlFor="description">Project Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Write the project description here..."
                            className="min-h-32"
                            value={projectDescription}
                            onChange={(e) => setProjectDescription(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-6 pt-6">
                        <div className="grid gap-3">
                            <Label htmlFor="modifying-prompt">Modifying Prompt</Label>
                            <Input
                                id="modifying-prompt"
                                type="text"
                                className="w-full"
                                placeholder="Enter your modifying prompt here..."
                                value={modifyingPrompt}
                                onChange={(e) => setModifyingPrompt(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="grid gap-3 pt-6">
                        <Label htmlFor="total-weeks">Total weeks</Label>
                        <ModifiedSlider
                            value={totalWeeks}
                            onChange={(value) =>{
                                console.log("Slider value:", value); // Debugging line
                                setTotalWeeks(value)
                            }
                        }
                        />
                    </div>
                    <div className="pt-6">
                        <ModelSelect
                            value={model}
                            onChange={(value) => setModel(value)}
                        />
                    </div>
                    <div className="flex items-center space-x-2 pt-6">
                        <Switch
                            id="evaluate"
                            checked={evaluate}
                            onCheckedChange={(checked) => setEvaluate(checked)}
                        />
                        <Label htmlFor="evaluate">Evaluate</Label>
                    </div>
                    <div className="grid gap-3 pt-6 ">
                        <Button variant="outline" type="reset" onClick={() => {
                            setUserId('');
                            setProjectDescription('');
                            setModifyingPrompt('');
                            setTotalWeeks(6);
                            setEvaluate(false);
                            setModel('GPT 4');
                        }}>Clear</Button>
                        <Button type="submit">Submit</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
