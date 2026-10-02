/* =====================================================
   SHARODIYA — DHAK BUTTON
   Independent YouTube player for the Dhak sound.

   • Has its OWN hidden YouTube player, so it never
     touches the main music player.
   • Main player + Dhak can play at the same time.
   • Pause the main player and Dhak keeps playing.
   • Tap the Dhak button again to stop only the Dhak.
===================================================== */

(function () {

    "use strict";

    /* -------------------------------------------------
       SETTINGS

       DHAK_VIDEO : set in 15-site-info.js (dhak.video)
                    11-character video ID of the dhak sound
       DHAK_VOLUME: 0 - 100 (independent of the main player)
    ------------------------------------------------- */

    const DHAK_VIDEO = (window.Sharodiya.info && window.Sharodiya.info.dhak && window.Sharodiya.info.dhak.video) || "";
    const DHAK_VOLUME = (window.Sharodiya.info && window.Sharodiya.info.dhak && Number(window.Sharodiya.info.dhak.volume)) || 80;

    const button = document.getElementById("dhakBtn");
    const label = document.getElementById("dhakLabel");

    if (!button) return;

    const DEFAULT_LABEL = label ? label.textContent : "DHAK";


    /* -------------------------------------------------
       VIDEO ID FROM LINK OR ID
    ------------------------------------------------- */

    function parseVideoId(value) {

        const text = String(value || "").trim();

        if (/^[\w-]{11}$/.test(text)) {
            return text;
        }

        const match = text.match(
            /(?:v=|youtu\.be\/|embed\/|shorts\/|live\/)([\w-]{11})/
        );

        return match ? match[1] : "";
    }

    const videoId = parseVideoId(DHAK_VIDEO);

    let player = null;
    let ready = false;
    let wantPlay = false;
    let labelTimer = null;


    /* -------------------------------------------------
       BUTTON UI
    ------------------------------------------------- */

    function setPlayingUI(playing) {
        button.classList.toggle("playing", playing);
        button.setAttribute("aria-pressed", playing ? "true" : "false");
        button.title = playing ? "Stop Dhak" : "Play Dhak";
    }

    function flashLabel(text) {

        if (!label) return;

        label.textContent = text;

        clearTimeout(labelTimer);

        labelTimer = setTimeout(function () {
            label.textContent = DEFAULT_LABEL;
        }, 2200);
    }


    /* -------------------------------------------------
       HIDDEN DHAK PLAYER (separate from the main one)
    ------------------------------------------------- */

    function createPlayer() {

        const holder = document.createElement("div");
        holder.id = "dhakPlayerContainer";
        holder.style.cssText =
            "position:fixed;width:1px;height:1px;" +
            "left:-9999px;top:-9999px;opacity:0;" +
            "pointer-events:none;";

        const target = document.createElement("div");
        target.id = "dhakPlayer";

        holder.appendChild(target);
        document.body.appendChild(holder);

        player = new YT.Player("dhakPlayer", {

            width: "1",
            height: "1",
            videoId: videoId,

            playerVars: {
                autoplay: 0,
                controls: 0,
                playsinline: 1,
                rel: 0,
                modestbranding: 1,
                loop: 1,
                playlist: videoId
            },

            events: {
                onReady: onReady,
                onStateChange: onStateChange,
                onError: onError
            }
        });
    }

    function waitForYouTube(tries) {

        if (window.YT && typeof YT.Player === "function") {
            createPlayer();
            return;
        }

        if (tries > 240) return;

        setTimeout(function () {
            waitForYouTube(tries + 1);
        }, 250);
    }

    function onReady(event) {

        ready = true;
        player = event.target;

        try {
            player.setVolume(DHAK_VOLUME);
        } catch (_) {}

        // The button was tapped before the player finished loading
        if (wantPlay) {
            try {
                player.playVideo();
            } catch (_) {}
        }
    }

    function onStateChange(event) {

        if (!window.YT) return;

        switch (event.data) {

            case YT.PlayerState.PLAYING:
            case YT.PlayerState.BUFFERING:
                setPlayingUI(true);
                break;

            case YT.PlayerState.PAUSED:
            case YT.PlayerState.CUED:
                wantPlay = false;
                setPlayingUI(false);
                break;

            case YT.PlayerState.ENDED:
                // Dhak loops until the user stops it
                try {
                    player.seekTo(0, true);
                    player.playVideo();
                } catch (_) {}
                break;
        }
    }

    function onError(event) {

        console.error("Dhak player error:", event && event.data);

        wantPlay = false;
        setPlayingUI(false);
        flashLabel("UNAVAILABLE");
    }


    /* -------------------------------------------------
       PLAY / STOP
    ------------------------------------------------- */

    function play() {

        wantPlay = true;
        setPlayingUI(true);

        if (ready && player) {
            try {
                player.playVideo();
            } catch (_) {}
        }
    }

    function pause() {

        wantPlay = false;
        setPlayingUI(false);

        if (ready && player) {
            try {
                player.pauseVideo();
            } catch (_) {}
        }
    }

    function toggle() {

        if (!videoId) {
            console.warn(
                "Dhak: set dhak.video in 15-site-info.js"
            );
            flashLabel("SET VIDEO");
            return;
        }

        if (button.classList.contains("playing")) {
            pause();
        } else {
            play();
        }
    }

    button.addEventListener("click", toggle);


    /* -------------------------------------------------
       START
    ------------------------------------------------- */

    if (videoId) {
        waitForYouTube(0);
    }

    window.Sharodiya = window.Sharodiya || {};
    window.Sharodiya.dhak = { play, pause, toggle };

})();
