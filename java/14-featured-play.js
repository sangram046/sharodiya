/* =====================================================
   SHARODIYA - MAHALAYA BANNER "PLAY NOW" BUTTON

   Click  → plays "Mahalaya Full" from the
            MAHALAYA SPECIAL playlist.
   Click again while it plays → pause.
   Click while paused → resume.
===================================================== */

(function (app) {

    "use strict";

    const button = document.querySelector(".play-featured");

    if (!button) return;

    const PLAY_LABEL = "▶ Play Now";
    const PAUSE_LABEL = "❚❚ Pause";
    const LOADING_LABEL = "Loading...";

    // The visitor clicked before the YouTube player finished loading
    let pending = false;


    function player() {
        return app.player || null;
    }

    function youtube() {
        const p = player();
        return p && p.getPlayer ? p.getPlayer() : null;
    }

    function specialIsActive() {
        const p = player();

        return !!(
            p &&
            p.getCurrentPlaylistKey &&
            p.getCurrentPlaylistKey() === "mahalayaSpecial"
        );
    }

    function specialVideoId() {
        const data = app.playlists && app.playlists.mahalayaSpecial;
        const song = data && data.songs && data.songs[0];

        return song ? song.videoId : "";
    }

    function isPlaying() {

        const yt = youtube();

        if (!yt || !window.YT || !specialIsActive()) {
            return false;
        }

        try {
            const state = yt.getPlayerState();

            return (
                state === YT.PlayerState.PLAYING ||
                state === YT.PlayerState.BUFFERING
            );
        } catch (_) {
            return false;
        }
    }

    function render() {

        const playing = isPlaying();

        button.textContent =
            pending
                ? LOADING_LABEL
                : (playing ? PAUSE_LABEL : PLAY_LABEL);

        button.classList.toggle("is-playing", playing);
        button.setAttribute("aria-pressed", playing ? "true" : "false");
    }


    function handleClick() {

        const p = player();

        if (!p || !p.isReady || !p.isReady()) {
            pending = true;
            render();
            return;
        }

        pending = false;

        const yt = youtube();

        if (specialIsActive() && yt) {

            if (isPlaying()) {

                try { yt.pauseVideo(); } catch (_) {}

            } else {

                // Resume if Mahalaya Full is still the loaded video,
                // otherwise load it again.
                let current = null;

                try {
                    current = p.getCurrentVideoData
                        ? p.getCurrentVideoData()
                        : null;
                } catch (_) {}

                if (current && current.video_id === specialVideoId()) {
                    try { yt.playVideo(); } catch (_) {}
                } else {
                    p.playMahalayaSpecial();
                }
            }

        } else {
            p.playMahalayaSpecial();
        }

        render();
    }

    button.addEventListener("click", handleClick);


    // Keep the label in sync with the real player
    document.addEventListener("sharodiya:player-state", render);
    document.addEventListener("sharodiya:song-changed", render);

    // A click that happened before the player was ready
    document.addEventListener("sharodiya:youtube-ready", function () {

        if (pending) {
            handleClick();
        } else {
            render();
        }
    });

    render();

})(window.Sharodiya);
