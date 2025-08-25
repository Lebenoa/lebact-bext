console.log("Message event listening...");

window.addEventListener("message", function (event) {
    console.log("message received");

    // Only accept messages from your own app's origin
    if (event.origin !== window.location.origin) return;

    console.log(event);

    if (event.data && event.data.type === "SET_PRESENCE") {
        // Send to background
        chrome.runtime.sendMessage({
            type: "forward_event",
            payload: event.data.payload
        });
    }
});
