/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");
const latestQuestion = document.getElementById("latestQuestion");
const SYSTEM_PROMPT = `
You are the official L'Oréal Beauty Advisor.

Only answer questions about:
- L'Oréal skincare
- L'Oréal makeup
- L'Oréal haircare
- Beauty routines
- Product recommendations
- Ingredients
- Cosmetics

If a user asks about anything unrelated, politely explain that you can only answer questions about L'Oréal products, beauty, skincare, makeup, haircare, and routines.
`;
const messages = [
    {
        role: "system",
        content: SYSTEM_PROMPT
    }
];

// Initial assistant message
chatWindow.innerHTML = `
    <div class="message assistant">
        <div class="bubble">
            👋 Hello! I'm the L'Oréal Beauty Advisor.
            Ask me about skincare, makeup, haircare, or beauty routines!
        </div>
    </div>
`;

messages.push({
    role: "assistant",
    content: "Hello! I'm the L'Oréal Beauty Advisor. Ask me about skincare, makeup, haircare, or beauty routines!"
});

/* Handle form submit */
chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const question = userInput.value.trim();
    latestQuestion.innerHTML = `
    <strong>You asked:</strong><br>
    ${question}`;
    if (!question) return;

    // Show user message
    chatWindow.innerHTML += `
        <div class="message user">
            <div class="bubble">${question}</div>
        </div>
    `;

    userInput.value = "";
    chatWindow.scrollTop = chatWindow.scrollHeight;
    try {
        messages.push({
        role: "user",
        content: question
    });

    const response = await fetch(
        "https://variables-and-secrets.leonawaples.workers.dev/",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                messages: messages
            })
        }
    );
        const data = await response.json();
        const aiReply = data.choices[0].message.content;
        messages.push({
        role: "assistant",
        content: aiReply
        });
        chatWindow.innerHTML += `
            <div class="message assistant">
                <div class="bubble">${aiReply}</div>
            </div>
        `;
        chatWindow.scrollTop = chatWindow.scrollHeight;
    } catch (error) {
        chatWindow.innerHTML += `
            <div class="message assistant">
                <div class="bubble">
                    Something went wrong. Please try again.
                </div>
            </div>
        `;
        console.error(error);
    }
});
