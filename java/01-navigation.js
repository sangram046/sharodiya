/* =====================================================
   SHARODIYA 1 - NAVIGATION
   Mobile menu + scroll helpers
===================================================== */

(function (app) {

    const menuBtn = document.getElementById("menuBtn");
    const mobileMenu = document.getElementById("mobileMenu");

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener("click", () => {
            const isOpen = mobileMenu.style.display === "block";
            mobileMenu.style.display = isOpen ? "none" : "block";
        });
    }

    document.querySelectorAll(".mobile-menu a").forEach(link => {
        link.addEventListener("click", () => {
            if (mobileMenu) {
                mobileMenu.style.display = "none";
            }
        });
    });

    function scrollToSongs() {
        const songs = document.getElementById("songs");
        if (songs) {
            songs.scrollIntoView({ behavior: "smooth" });
        }
    }

    function startListening() {

        const player = app.player;

        if (player && player.isReady && player.isReady()) {

            const currentKey =
                player.getCurrentPlaylistKey
                    ? player.getCurrentPlaylistKey()
                    : "";

            const youtube =
                player.getPlayer
                    ? player.getPlayer()
                    : null;

            try {

                // If Durga Puja is already loaded, resume it rather than
                // rebuilding the playlist and resetting the current song.
                if (currentKey === "durga" && youtube) {
                    youtube.playVideo();
                } else if (player.loadPlaylist) {
                    player.loadPlaylist("durga");
                }

            } catch (error) {
                console.error(
                    "Could not start Durga Puja playlist:",
                    error
                );
            }

            scrollToSongs();
            return;
        }

        // The user click can happen before the YouTube API finishes loading.
        // Queue the action and run it as soon as the player becomes ready.
        window.__sharodiyaStartListeningPending = true;
        scrollToSongs();
    }

    function scrollToMahalaya() {
        const mahalaya = document.getElementById("mahalaya");
        if (mahalaya) {
            mahalaya.scrollIntoView({ behavior: "smooth" });
        }
    }

    // HTML uses inline onclick, so expose these globally.
    window.scrollToSongs = scrollToSongs;
    window.scrollToMahalaya = scrollToMahalaya;
    window.startListening = startListening;

    document.addEventListener(
        "sharodiya:youtube-ready",
        function () {
            if (!window.__sharodiyaStartListeningPending) {
                return;
            }

            window.__sharodiyaStartListeningPending = false;
            startListening();
        }
    );

    app.navigation = {
        scrollToSongs,
        scrollToMahalaya,
        startListening
    };

})(window.Sharodiya);
