'use client';
import type { FC } from 'react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { getAIRecommendations } from '@/app/actions';
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

const glassmorphismClass = "bg-white/5 border border-white/10 backdrop-blur-md";

const AIRecommender: FC = () => {
    const [prompt, setPrompt] = useState('');
    const [recommendations, setRecommendations] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast()


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setLoading(true);
        setRecommendations([]);

        const result = await getAIRecommendations({ prompt });
        setLoading(false);

        if (result.success && result.data?.recommendations) {
            setRecommendations(result.data.recommendations);
        } else {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: result.error || 'There was a problem with your request.',
            })
        }
    };

    return (
        <Card className={`${glassmorphismClass} flex flex-col h-full`}>
            <CardHeader>
                <CardTitle>AI Style Assistant</CardTitle>
                <CardDescription>Describe a style, and get recommendations.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col gap-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Textarea
                        placeholder="e.g., 'A futuristic cyberpunk jacket with neon accents'"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows={3}
                    />
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Generate Ideas
                    </Button>
                </form>
                {loading && (
                    <div className="flex justify-center items-center py-4">
                         <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
                    </div>
                )}
                {recommendations.length > 0 && (
                    <ScrollArea className="flex-grow mt-4 h-48">
                        <div className="space-y-2">
                            <h3 className="font-semibold">Recommendations:</h3>
                            <ul className="list-disc list-inside space-y-2 text-sm">
                                {recommendations.map((rec, index) => (
                                    <li key={index} className="p-2 rounded-md bg-white/5">{rec}</li>
                                ))}
                            </ul>
                        </div>
                    </ScrollArea>
                )}
            </CardContent>
            <CardFooter>
                 <p className="text-xs text-muted-foreground">Powered by Genkit AI.</p>
            </CardFooter>
        </Card>
    );
};

export default AIRecommender;
