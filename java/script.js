/* =====================================================
   SHARODIYA 1 - MAIN JAVASCRIPT LOADER
   HTML loads ONLY this file.
   ===================================================== */

window.Sharodiya = window.Sharodiya || {};

window.__sharodiyaYTReady = false;

window.onYouTubeIframeAPIReady = function () {

    window.__sharodiyaYTReady = true;

    if (typeof window.__sharodiyaStartYouTube === "function") {
        window.__sharodiyaStartYouTube();
    }

};

const SHARODIYA_MODULES = [

    "00-config.js",
    "01-navigation.js",
    "02-search-filter.js",
    "03-youtube-player.js",
    "04-player-progress.js",
    "05-thumbnails.js",
    "06-background.js",
    "07-playlist-data.js",
    "08-playlist-ui.js",

    // STATUS BAR
    "09-status-clock.js",
    "10-status-countdown.js",
    "11-status-online.js",

    // MAHALAYA BANNER PLAY NOW BUTTON
    "14-featured-play.js",

    // LOGO, MESSAGE CARD, INSTAGRAM CARD, DHAK BUTTON
    "15-site-info.js",
    "16-site-extras.js",
    "17-dhak.js"

];

function loadSharodiyaModule(fileName) {

    return new Promise((resolve, reject) => {

        const script = document.createElement("script");

        script.src = "../java/" + fileName + "?v=20261001b";

        script.onload = resolve;

        script.onerror = () => {

            reject(
                new Error(
                    "Failed to load JavaScript module: " +
                    fileName
                )
            );

        };

        document.head.appendChild(script);

    });

}

async function loadSharodiyaScripts() {

    try {

        for (const moduleFile of SHARODIYA_MODULES) {

            await loadSharodiyaModule(moduleFile);

        }

        /*
         * If the YouTube API was already ready before
         * the modules finished loading, start it now.
         */

        if (

            (
                window.__sharodiyaYTReady ||

                (
                    window.YT &&
                    typeof window.YT.Player === "function"
                )

            ) &&

            typeof window.__sharodiyaStartYouTube === "function"

        ) {

            window.__sharodiyaStartYouTube();

        }

        console.log(
            "SHARODIYA 1 JavaScript modules loaded successfully."
        );

    } catch (error) {

        console.error(
            "SHARODIYA 1 JavaScript loading error:",
            error
        );

    }

}

loadSharodiyaScripts();