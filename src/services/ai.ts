export interface ChatMessage {
    role: 'user' | 'model';
    parts: { text: string }[];
}

export async function generateResponse(apiKey: string, history: ChatMessage[]) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: history,
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 800,
            }
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to generate response');
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}
