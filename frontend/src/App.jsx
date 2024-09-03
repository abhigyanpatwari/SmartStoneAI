import { useState, useEffect } from "react";
import { ThemeProvider } from "@/components/component/Theme-Provider.jsx";
import './App.css';
import InputCard from "@/components/component/InputCard.jsx";
import Data from "@/components/component/Data.jsx";
import RawMilestones from "@/components/component/RawMilestones.jsx";
import { CarouselSpacing } from "@/components/component/carrousal.jsx";
import axios from "axios";
import { Progress } from "@/components/ui/progress";
import { Darkmodebutton } from "@/components/component/darkmodebutton.jsx"; // Import the Darkmodebutton component

function App() {
    const [userId, setUserId] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [modifyingPrompt, setModifyingPrompt] = useState('');
    const [totalWeeks, setTotalWeeks] = useState(6);
    const [evaluate, setEvaluate] = useState(false);
    const [model, setModel] = useState('GPT 4o');
    const [response, setResponse] = useState(null);
    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [theme, setTheme] = useState(() => {
        // Set initial theme based on localStorage value or default to light
        return localStorage.getItem('theme') || 'light';
    });

    // Progress animation effect
    useEffect(() => {
        let interval;
        if (isLoading) {
            setProgress(0); // Reset progress to 0 before starting
            interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 90) { // Stop at 90% until the request completes
                        clearInterval(interval);
                        return prev;
                    }
                    return prev + 5; // Increment progress
                });
            }, 400); // Adjust timing for smoother animation
        } else if (progress === 100) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isLoading]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const requestData = {
            user_id: userId,
            project_description: projectDescription,
            modifying_prompt: modifyingPrompt || null,
            total_weeks: totalWeeks,
            evaluate: evaluate,
            model: model,
        };

        try {
            const res = await axios.post('http://127.0.0.1:8000/generate_milestones/', requestData);
            setResponse(res.data);
            setProgress(100); // Complete the progress bar when the response is received
        } catch (error) {
            console.error('Error submitting form:', error);
            setProgress(0); // Reset progress on error
        } finally {
            setIsLoading(false);
        }
    };

    const handleDarkMode = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme); // Save theme to localStorage
    };

    useEffect(() => {
        // Apply the theme to the document body
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    // Extracting data from the response
    const milestones = response?.generated_milestones || [];
    const averageCosineSimilarity = response?.average_cosine_similarity || null;
    const rawMilestones = response?.raw_milestones || "";
    const generationTime = response?.generation_time || 0;
    const callbacks = response?.callbacks || 0;

    return (
        <ThemeProvider defaultTheme={theme} storageKey="vite-ui-theme">
            <Darkmodebutton theme={theme} handleDarkMode={handleDarkMode} />
            <div className="grid grid-cols-2 gap-4 p-4 text-left">
                {isLoading ? (
                    <div className="col-span-2 flex items-center justify-center h-screen">
                        <Progress value={progress} className="w-[60%]" />
                    </div>
                ) : (
                    <>
                        <div className="col-span-1">
                            <InputCard
                                userId={userId}
                                setUserId={setUserId}
                                projectDescription={projectDescription}
                                setProjectDescription={setProjectDescription}
                                modifyingPrompt={modifyingPrompt}
                                setModifyingPrompt={setModifyingPrompt}
                                totalWeeks={totalWeeks}
                                setTotalWeeks={setTotalWeeks}
                                evaluate={evaluate}
                                setEvaluate={setEvaluate}
                                model={model}
                                setModel={setModel}
                                handleFormSubmit={handleFormSubmit}
                            />
                        </div>
                        <div className="col-span-1">
                            <div className="grid gap-4">
                                <Data
                                    averageCosineSimilarity={averageCosineSimilarity}
                                    generationTime={generationTime}
                                    callbacks={callbacks}
                                />
                                <RawMilestones rawMilestones={rawMilestones} />
                            </div>
                        </div>
                        <div className="col-span-2">
                            <CarouselSpacing
                                milestones={milestones}
                                userId={userId}
                                projectId={projectDescription}
                            />
                        </div>
                    </>
                )}
            </div>
        </ThemeProvider>
    );
}

export default App;
