let websocketConnection;
let updateInterval;
let isCleared;

const HOME_PAGE = "/";
const WATCH_PAGE = "/watch";
const RESULT_PAGE = "/results";
const UPDATE_DELAY = 2000;

websocketConnection = new WebSocket("ws://127.0.0.1:5579/ws");
websocketConnection.addEventListener("error", () => {
    websocketConnection = undefined;
    if (updateInterval) {
        clearInterval(updateInterval);
        updateInterval = undefined;
    }
})
websocketConnection.addEventListener("close", () => {
    websocketConnection = undefined;
    if (updateInterval) {
        clearInterval(updateInterval);
        updateInterval = undefined;
    }
})
websocketConnection.addEventListener("open", () => {
    updateInterval = setInterval(() => {
        const currentPage = window.location.pathname;
        if (currentPage != WATCH_PAGE) {
            if (!isCleared) {
                websocketConnection.send(JSON.stringify({ action: "CLEAR" }));
                isCleared = true;
            }
            return;
        }

        const info = getVideoInfo();
        const now = Date.now();
        const body =
            JSON.stringify({
                action: "SET",
                activity: {
                    name: "YouTube",
                    type: 3,
                    status_display_type: 2,
                    details: info.title,
                    details_url: info.url,
                    state: info.channel ? info.channel : "<BLANK>",
                    state_url: info.channel_url,
                    assets: {
                        large_image: info.thumbnail,
                        large_text: info.title,
                        large_url: info.url,
                        small_image: info.channel_thumbnail,
                        small_text: info.channel ? info.channel : "<BLANK>",
                        small_url: info.channel_url,
                    },
                    timestamps: {
                        start: Math.round(now - (info.current_time * 1000)),
                        end: info.isLive ? undefined : Math.round(now + ((info.duration - info.current_time) * 1000)),
                    }
                }
            });
        websocketConnection.send(body);
        isCleared = false;
    }, UPDATE_DELAY);
})


function getVideoId() {
    return new URLSearchParams(window.location.search).get("v");
}

function getThumbnail(videoId) {
    return `https://i3.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

function getIsLiveStreaming() {
    const teaserCarousel = document.querySelector("div#teaser-carousel div h2");
    if (!teaserCarousel) {
        return false;
    }

    const text = teaserCarousel.innerText.toLowerCase();
    if (text == "live chat") {
        return true;
    }

    return false;
}

function getVideoInfo() {
    const id = getVideoId();
    const video = document.querySelector("video");
    const title = document.querySelector("h1.title yt-formatted-string")?.innerText;
    const thumbnail = getThumbnail(id);

    const channelElem =
        document.querySelector('div#text-container.ytd-channel-name a[href]');
    const channel = channelElem?.innerText;
    const channel_url = channelElem?.href;
    const channel_img = document.querySelector("#owner yt-img-shadow#avatar img");
    const channel_thumbnail = channel_img?.src;

    const duration = video?.duration || 0;
    const current_time = video?.currentTime || 0;
    const isLive = getIsLiveStreaming();

    return {
        title,
        thumbnail,
        url: `https://youtu.be/${id}`,
        channel,
        channel_thumbnail,
        channel_url,
        duration,
        current_time,
        isLive,
    };
}
