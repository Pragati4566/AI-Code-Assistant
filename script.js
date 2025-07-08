import { GoogleGenerativeAI } from "https://cdn.jsdelivr.net/npm/@google/generative-ai/+esm";

async function processCode(action) {
    let codeSnippet = document.getElementById("codeInput").value;
    let outputDiv = document.getElementById("output");
    
    if (!codeSnippet.trim()) {
        outputDiv.innerHTML = "<p style='color:red;'>Please enter some code.</p>";
        return;
    }

    outputDiv.innerHTML = "<p style='color:yellow;'>Processing...</p>";

    const apiKey = "AIzaSyDXzvf0Eixox10RsjAJs_UXpKLXNvCsAG8"; // Replace with your Gemini API key
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-pro-exp-02-05" });
    const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
    };
    
    try {
        const chatSession = model.startChat({
            generationConfig,
            history: [],
        });

        let prompt;
        if (action === "generate_code") {
            prompt = `You are an AI-powered coding assistant. Generate a well-structured and efficient code snippet based on the following user request:\n\n${codeSnippet}\n\nGuidelines:\n- Ensure the code is optimized, follows best practices, and includes necessary comments.\n- Provide explanations if needed, but keep them concise.`;
        } else {
            prompt = `You are an AI-powered coding assistant.\n\nTask:\nThe user has provided the following code snippet:\n\n\`\`\`${codeSnippet}\`\`\`\n\nThe user has requested assistance with **${action.replace('_', ' ')}**.\n\nGuidelines:\n- If the action is test case generation, provide structured unit tests (e.g., JUnit for Java, pytest for Python).\n- If debugging, analyze for errors and suggest fixes.\n- Ensure clear, structured, actionable responses.\n- Avoid unnecessary explanations; focus on precise outputs.\n\nNow, generate the required output:`;
        }

        const result = await chatSession.sendMessage(prompt);
        outputDiv.innerHTML = `<pre>${result.response.text()}</pre>`;
    } catch (error) {
        outputDiv.innerHTML = "<p style='color:red;'>Error processing request. Check API key or network.</p>";
    }
}

// Attach function to the global scope
window.processCode = processCode;
