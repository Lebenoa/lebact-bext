chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
    console.log(message);
    if (message.type === "forward_event") {
        fetch("http://127.0.0.1:5578/set-presence", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(message.payload)
        }).then(() => {
            sendResponse({ status: "ok" });
        }).catch((err) => {
            console.error("Failed to send to local server", err);
            sendResponse({ status: "error", error: err.message });
        });

        // Keep async sendResponse alive
        return true;
    }
});
