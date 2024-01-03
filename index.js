const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea"); 
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage = null; 
const API_KEY = "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"; 
const inputInitHeight = chatInput.scrollHeight;


const sciastraQuestions = [
    "what is sciastra?",
    "tell me more about the sciastra platform.",
    "what industries benefit the most from Sciastra?",
    "is Sciastra compatible with other software?",
    "are there any upcoming features in Sciastra?",
    "how does Sciastra ensure data security?",
    "does Sciastra provide customer support?",
];


const getSciastraResponse = (question) => {
    const lowerCaseQuestion = question.toLowerCase();

    if (lowerCaseQuestion.includes("what is sciastra?")) {
        return "SciAstra is an online platform offering preparatory courses and resources for students aiming to crack entrance exams for top Indian science institutes like IISER, NISER, ISI, CMI, CEBS, and IACS. They focus on all four subjects - Physics, Chemistry, Mathematics, and Biology - to help students excel in these competitive exams.";
    }

    if (lowerCaseQuestion.includes("tell me more about the sciastra platform.")) {
        return "SciAstra offers various features to support your preparation journey:\n\n Online Courses: Structured online courses with video lectures, study materials, and practice questions for each subject.\n Free Study Material: Downloadable resources like previous years' question papers, exam analysis, and tips for exam preparation.\n Blogs: Informative articles and guides on different aspects of science education, career options, and entrance exam strategies.\n Team of Mentors: Experienced mentors and educators to provide guidance and support to students.\n Community Forum: Interact with other students and mentors on the platform to share doubts and experiences.";
    }

    if (lowerCaseQuestion.includes("what industries benefit the most from sciastra?")) {
        return "SciAstra primarily caters to individuals seeking admission to prestigious science institutes in India. These institutes focus on research and training in various scientific fields, including:\n\n Space Research  \n Biotechnology \n Material Science \n Environmental Science \n Mathematics and Computer Science \n Physics and Chemistry \n\nStudents entering these fields will find SciAstra's resources valuable for their academic foundation and future career prospects.";
    }

    if (lowerCaseQuestion.includes("is sciastra compatible with other software?")) {
        return "SciAstra's online platform primarily runs on its own website and learning management system. However, you can access their courses and resources on various devices and operating systems. They might recommend specific software or tools for certain learning materials, but overall, integration with other software should not be a major concern.";
    }

    if (lowerCaseQuestion.includes("are there any upcoming features in sciastra?")) {
        return "SciAstra continuously upgrades its platform and resources. While they might not publicly disclose upcoming features, their website features a 'News & Updates' section where they announce recent additions and improvements. You can also contact their support team for inquiries about future plans.";
    }

    if (lowerCaseQuestion.includes("does sciastra provide customer support?")) {
        return "Yes, SciAstra has a dedicated customer support team available to answer your questions and address any concerns. You can reach them through email, phone calls, or their online chat portal on their website.";
    }

    if (lowerCaseQuestion.includes("how does sciastra ensure data security?")) {
        return "SciAstra claims to follow industry-standard security practices to protect your data. They use secure servers and encryption protocols to store and transmit personal information. You can find their Privacy Policy on their website for more details.";
    }


    return "I'm sorry, I don't have information on that specific question about SciAstra.";
};



const createChatLi = (message, className) => {

    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
};
const generateResponse = (chatElement) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = chatElement.querySelector("p");
    const userMessageLower = userMessage.toLowerCase();

    for (const question of sciastraQuestions) {
        if (userMessageLower.includes(question.toLowerCase())) {
            messageElement.textContent = getSciastraResponse(question);
            return;
        }
    }

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: userMessage }],
        })
    };

    fetch(API_URL, requestOptions)
        .then(res => res.json())
        .then(data => {
            messageElement.textContent = data.choices[0].message.content;
        })
        .catch(() => {
            messageElement.classList.add("error");
            messageElement.textContent = "Oops! Something went wrong. Please try again.";
        })
        .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
};



const handleChat = () => {
    userMessage = chatInput.value.trim(); 
    if(!userMessage) return;

    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);
    
    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}

chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});


if (sendChatBtn) {
    sendChatBtn.addEventListener("click", handleChat);
}

if (closeBtn) {
    closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
}

if (chatbotToggler) {
    chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
}