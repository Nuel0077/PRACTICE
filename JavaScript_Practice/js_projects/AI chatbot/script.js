/*
========================================================
NECRIS AI CONFIGURATION
========================================================

For a real AI, set AI_ENDPOINT to your own backend URL.

Example:
const AI_ENDPOINT = "http://127.0.0.1:8000/api/chat/";

Your backend should accept:
{
    "message": "Explain Python",
    "history": [
        {"role": "user", "content": "Hello"},
        {"role": "assistant", "content": "Hi!"}
    ]
}

And return:
{
    "reply": "Python is a programming language..."
}

Leave the endpoint empty to use the built-in demo replies.

Never put a private AI API key in this file.
*/

const AI_ENDPOINT = "";


/* Elements */

const chatLauncher = document.getElementById("chatLauncher");
const chatWindow = document.getElementById("chatWindow");

const minimizeButton = document.getElementById("minimizeButton");
const historyButton = document.getElementById("historyButton");

const historyPanel = document.getElementById("historyPanel");
const historyList = document.getElementById("historyList");

const messages = document.getElementById("messages");
const welcome = document.getElementById("welcome");

const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");

const newChatButton = document.getElementById("newChatButton");
const historyNewChat = document.getElementById("historyNewChat");

const uploadButton = document.getElementById("uploadButton");
const imageInput = document.getElementById("imageInput");
const imagePreview = document.getElementById("imagePreview");

const emojiButton = document.getElementById("emojiButton");
const emojiPicker = document.getElementById("emojiPicker");


/* Application state */

let conversations = [];
let currentChatId = null;
let selectedImages = [];
let busy = false;


/* Persistent history */

function loadConversations() {
    try {
        conversations = JSON.parse(
            localStorage.getItem("necris_conversations") || "[]"
        );
    } catch {
        conversations = [];
    }

    if (!Array.isArray(conversations)) {
        conversations = [];
    }
}

function saveConversations() {
    try {
        localStorage.setItem(
            "necris_conversations",
            JSON.stringify(conversations)
        );
    } catch (error) {
        console.warn("Could not save chat history:", error);
    }
}

function createConversation() {
    const chat = {
        id: Date.now().toString() + Math.random().toString(36).slice(2, 7),
        title: "New conversation",
        messages: [],
        updatedAt: Date.now()
    };

    conversations.unshift(chat);

    currentChatId = chat.id;

    saveConversations();

    renderMessages();
    renderHistory();

    historyPanel.classList.remove("active");
    messageInput.focus();
}

function getCurrentChat() {
    return conversations.find(
        chat => chat.id === currentChatId
    );
}


/* Open and close */

function openChat() {
    chatWindow.classList.add("active");
    chatLauncher.querySelector(".launcher-chat").style.display = "none";
    chatLauncher.querySelector(".launcher-close").style.display = "block";

    messageInput.focus();
}

function closeChat() {
    chatWindow.classList.remove("active");

    chatLauncher.querySelector(".launcher-chat").style.display = "block";
    chatLauncher.querySelector(".launcher-close").style.display = "none";

    emojiPicker.hidden = true;
    historyPanel.classList.remove("active");
}

chatLauncher.addEventListener("click", () => {
    if (chatWindow.classList.contains("active")) {
        closeChat();
    } else {
        openChat();
    }
});

minimizeButton.addEventListener("click", closeChat);


/* History */

historyButton.addEventListener("click", () => {
    historyPanel.classList.toggle("active");
    renderHistory();
});

newChatButton.addEventListener("click", createConversation);
historyNewChat.addEventListener("click", createConversation);

function renderHistory() {
    historyList.replaceChildren();

    if (conversations.length === 0) {
        const empty = document.createElement("p");

        empty.textContent = "Your conversations will appear here.";

        empty.style.padding = "15px";
        empty.style.color = "#888";
        empty.style.fontSize = "13px";

        historyList.appendChild(empty);

        return;
    }

    conversations
        .slice()
        .sort((a, b) => b.updatedAt - a.updatedAt)
        .forEach(chat => {

            const item = document.createElement("div");
            item.className = "history-item";

            if (chat.id === currentChatId) {
                item.classList.add("selected");
            }

            const title = document.createElement("div");
            title.className = "history-title";
            title.textContent = chat.title;

            title.addEventListener("click", () => {
                currentChatId = chat.id;

                historyPanel.classList.remove("active");

                renderMessages();
                renderHistory();
            });

            const remove = document.createElement("button");
            remove.className = "delete-chat";
            remove.textContent = "🗑";
            remove.title = "Delete conversation";
            remove.setAttribute("aria-label", "Delete conversation");

            remove.addEventListener("click", event => {
                event.stopPropagation();

                const confirmed = confirm(
                    "Delete this conversation permanently?"
                );

                if (!confirmed) return;

                conversations = conversations.filter(
                    conversation => conversation.id !== chat.id
                );

                if (currentChatId === chat.id) {
                    currentChatId = null;

                    if (conversations.length > 0) {
                        currentChatId = conversations[0].id;
                    }
                }

                saveConversations();

                if (!currentChatId) {
                    createConversation();
                } else {
                    renderMessages();
                    renderHistory();
                }
            });

            item.append(title, remove);
            historyList.appendChild(item);
        });
}


/* Render conversation */

function renderMessages() {
    messages.replaceChildren();

    const chat = getCurrentChat();

    if (!chat || chat.messages.length === 0) {
        const intro = document.createElement("div");

        intro.className = "welcome";

        const icon = document.createElement("div");
        icon.className = "welcome-icon";
        icon.textContent = "✦";

        const heading = document.createElement("h2");
        heading.textContent = "How can I help you?";

        const description = document.createElement("p");

        description.textContent =
            "Ask questions, explore ideas, learn programming, or get help understanding a topic.";

        intro.append(icon, heading, description);

        messages.appendChild(intro);

        return;
    }

    chat.messages.forEach(message => {
        renderMessage(message);
    });

    scrollToBottom();
}

function renderMessage(message) {
    const row = document.createElement("div");

    row.className = "message-row";

    if (message.role === "user") {
        row.classList.add("user-row");
    }

    const avatar = document.createElement("div");
    avatar.className = "message-avatar";

    avatar.textContent = message.role === "user" ? "U" : "✦";

    const content = document.createElement("div");
    content.className = "message-content";

    if (message.role === "assistant") {
        renderAssistantText(content, message.content);
    } else {
        const text = document.createElement("div");
        text.textContent = message.content || "";

        content.appendChild(text);
    }

    if (message.images) {
        message.images.forEach(src => {
            const image = document.createElement("img");

            image.src = src;
            image.alt = "Uploaded image";

            content.appendChild(image);
        });
    }

    row.append(avatar, content);

    messages.appendChild(row);
}

function renderAssistantText(container, text) {
    /*
      Text is inserted safely using textContent.
      This simple formatter also displays code blocks.
    */

    const parts = text.split(/```/);

    parts.forEach((part, index) => {
        if (index % 2 === 1) {
            const pre = document.createElement("pre");
            const code = document.createElement("code");

            code.textContent = part.replace(/^[a-zA-Z0-9+#.-]+\n/, "");

            pre.appendChild(code);
            container.appendChild(pre);
        } else {
            const paragraph = document.createElement("div");

            paragraph.style.whiteSpace = "pre-wrap";
            paragraph.textContent = part;

            container.appendChild(paragraph);
        }
    });
}

function scrollToBottom() {
    messages.scrollTop = messages.scrollHeight;
}


/* Image uploads */

uploadButton.addEventListener("click", () => {
    imageInput.click();
});

imageInput.addEventListener("change", event => {
    const files = Array.from(event.target.files || []);

    files.forEach(file => {
        if (!file.type.startsWith("image/")) return;

        if (selectedImages.length >= 5) return;

        const reader = new FileReader();

        reader.onload = () => {
            selectedImages.push({
                name: file.name,
                data: reader.result
            });

            renderImagePreview();
        };

        reader.readAsDataURL(file);
    });

    imageInput.value = "";
});

function renderImagePreview() {
    imagePreview.replaceChildren();

    selectedImages.forEach((image, index) => {
        const item = document.createElement("div");
        item.className = "preview-item";

        const img = document.createElement("img");
        img.src = image.data;
        img.alt = image.name;

        const remove = document.createElement("button");
        remove.textContent = "×";
        remove.setAttribute("aria-label", "Remove image");

        remove.addEventListener("click", () => {
            selectedImages.splice(index, 1);
            renderImagePreview();
        });

        item.append(img, remove);
        imagePreview.appendChild(item);
    });
}


/* Emoji picker */

emojiButton.addEventListener("click", () => {
    emojiPicker.hidden = !emojiPicker.hidden;
});

emojiPicker.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", () => {

        const start = messageInput.selectionStart;
        const end = messageInput.selectionEnd;

        messageInput.setRangeText(
            button.textContent,
            start,
            end,
            "end"
        );

        messageInput.focus();

        emojiPicker.hidden = true;
    });
});


/* Input resizing */

messageInput.addEventListener("input", () => {
    messageInput.style.height = "auto";

    messageInput.style.height =
        Math.min(messageInput.scrollHeight, 100) + "px";
});

messageInput.addEventListener("keydown", event => {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
});


/* Demo response system */

function demoResponse(question, history) {
    const q = question.toLowerCase().trim();

    if (/^(hi|hello|hey|good morning|good afternoon)\b/.test(q)) {
        return "Hey there! 👋 Welcome to Necris AI. What would you like to learn or work on today?";
    }

    if (/\b(your name|who are you|what are you)\b/.test(q)) {
        return "I'm Necris AI ✨, a chatbot interface built with HTML, CSS, and JavaScript. Connect me to a real AI model to enable intelligent answers across different topics.";
    }

    if (/\b(html|css|javascript|python|django|programming|code|coding)\b/.test(q)) {
        return "Let's work on that! 💻\n\nFor example, here's a simple Python program:\n\n```python\nname = input(\"What is your name? \")\nprint(f\"Hello, {name}!\")\n```\n\nThis program asks for your name and prints a greeting.\n\nThis is a sample response. A real AI connection is needed to generate code tailored to your specific request.";
    }

    if (/\b(explain|meaning|define|what is|what are)\b/.test(q)) {
        return "I'd be happy to help you understand that! 📚\n\nThis demo can recognize some common question patterns, but it does not have the knowledge or reasoning abilities of a real AI model. Connect an AI API to get accurate explanations tailored to your question.";
    }

    if (/\b(thank you|thanks)\b/.test(q)) {
        return "You're welcome! 😊 Feel free to ask me another question.";
    }

    if (/\b(image|picture|photo)\b/.test(q)) {
        return "You can attach pictures using the + button. 🖼️ The image will appear in your message history. To understand or describe an uploaded image, connect a vision-capable AI model.";
    }

    if (history.length > 1) {
        return "I can see that this conversation contains earlier messages. In demo mode, however, I cannot intelligently reason about the full conversation. A real AI model connected to this chat can use the conversation history to give more relevant follow-up answers.";
    }

    return "Thanks for your question! 😊\n\nNecris AI's chat interface is working, but this is currently demo mode. To answer your specific question accurately, explain complex topics, write custom code, and understand follow-up messages, connect a real AI model through a secure backend.";
}


/* Real AI connection */

async function getAIResponse(question, chat) {

    /*
      If a backend endpoint is configured, send the question
      and conversation history to that backend.
    */

    if (AI_ENDPOINT.trim()) {

        const response = await fetch(AI_ENDPOINT, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: question,

                history: chat.messages.map(message => ({
                    role: message.role,
                    content: message.content
                }))
            })
        });

        if (!response.ok) {
            throw new Error("The AI server returned an error.");
        }

        const data = await response.json();

        if (typeof data.reply !== "string") {
            throw new Error("The AI server returned an invalid response.");
        }

        return data.reply;
    }

    /*
      No backend configured: return sample responses.
    */

    await new Promise(resolve => setTimeout(resolve, 900));

    return demoResponse(question, chat.messages);
}


/* Send message */

async function sendMessage() {

    if (busy) return;

    const question = messageInput.value.trim();

    if (!question && selectedImages.length === 0) return;

    if (!currentChatId || !getCurrentChat()) {
        createConversation();
    }

    const chat = getCurrentChat();

    const imageData = selectedImages.map(image => image.data);

    const userMessage = {
        role: "user",
        content: question,
        images: imageData
    };

    chat.messages.push(userMessage);

    if (chat.messages.filter(message => message.role === "user").length === 1) {
        chat.title = question
            ? question.slice(0, 38)
            : "Image conversation";
    }

    chat.updatedAt = Date.now();

    saveConversations();

    messageInput.value = "";
    messageInput.style.height = "auto";

    selectedImages = [];
    renderImagePreview();

    emojiPicker.hidden = true;
    historyPanel.classList.remove("active");

    renderMessages();
    renderHistory();

    busy = true;
    sendButton.disabled = true;

    const typingRow = document.createElement("div");
    typingRow.className = "message-row";

    const avatar = document.createElement("div");
    avatar.className = "message-avatar";
    avatar.textContent = "✦";

    const bubble = document.createElement("div");
    bubble.className = "message-content";

    const typing = document.createElement("div");
    typing.className = "typing";

    for (let i = 0; i < 3; i++) {
        typing.appendChild(document.createElement("span"));
    }

    bubble.appendChild(typing);
    typingRow.append(avatar, bubble);

    messages.appendChild(typingRow);

    scrollToBottom();

    try {

        const answer = await getAIResponse(question, chat);

        typingRow.remove();

        const assistantMessage = {
            role: "assistant",
            content: answer
        };

        chat.messages.push(assistantMessage);
        chat.updatedAt = Date.now();

        saveConversations();

        /*
          Display the answer progressively to simulate
          a streaming ChatGPT-style response.
        */

        const row = document.createElement("div");
        row.className = "message-row";

        const assistantAvatar = document.createElement("div");
        assistantAvatar.className = "message-avatar";
        assistantAvatar.textContent = "✦";

        const content = document.createElement("div");
        content.className = "message-content";

        row.append(assistantAvatar, content);
        messages.appendChild(row);

        const characters = Array.from(answer);
        let index = 0;
        let displayedText = "";

        await new Promise(resolve => {

            function typeNext() {

                const nextCharacters = characters.slice(index, index + 4);

                displayedText += nextCharacters.join("");
                index += nextCharacters.length;

                renderAssistantText(content, displayedText);

                scrollToBottom();

                if (index < characters.length) {
                    setTimeout(typeNext, 12);
                } else {
                    resolve();
                }
            }

            typeNext();
        });

        renderHistory();

    } catch (error) {

        typingRow.remove();

        const errorMessage = {
            role: "assistant",
            content: "I couldn't connect to the AI service. Please check your backend connection and try again."
        };

        chat.messages.push(errorMessage);

        saveConversations();

        renderMessages();

        console.error(error);

    } finally {

        busy = false;
        sendButton.disabled = false;

        messageInput.focus();
    }
}

sendButton.addEventListener("click", sendMessage);


/* Close emoji menu when clicking elsewhere */

document.addEventListener("click", event => {

    if (
        !emojiPicker.contains(event.target) &&
        event.target !== emojiButton
    ) {
        emojiPicker.hidden = true;
    }

});


/* Escape closes chat */

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        closeChat();

    }

});


/* Initialize */

loadConversations();

if (conversations.length > 0) {
    currentChatId = conversations[0].id;
} else {
    createConversation();
}

renderMessages();
renderHistory();