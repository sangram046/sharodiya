/* =====================================================
   SHARODIYA 1 - PUJA RADIO PLAYLIST UI
===================================================== */

(function (app) {

    const playlistOpenBtn =
        document.getElementById("playlistOpenBtn");

    const playlistClose =
        document.getElementById("playlistClose");

    const playlistOverlay =
        document.getElementById("playlistOverlay");

    const songList =
        document.getElementById("songList");

    const playlistDescription =
        document.getElementById("playlistDescription");

    const playlistTabs =
        document.querySelectorAll(".playlist-tab");

    let activeKey = "durga";

    // Keep the last known YouTube playlist IDs so opening a tab never
    // forces the audio engine to reload/pause.
    const playlistCache = {};

    const TAB_KEYS = [
        "durga",

        "mahalayaSpecial",
        "mahalayaSongs"
    ];

    function getConfig(key) {
        return app.config.playlists[key] || null;
    }

    function getPlaylistData(key) {
        return app.playlists && app.playlists[key]
            ? app.playlists[key]
            : null;
    }

    function openPlaylist() {
        if (!playlistOverlay) return;

        playlistOverlay.classList.add("show");

        if (playlistOpenBtn) {
            playlistOpenBtn.classList.add("active");
        }

        document.body.style.overflow = "hidden";
    }

    function closePlaylist() {
        if (playlistOverlay) {
            playlistOverlay.classList.remove("show");
        }

        if (playlistOpenBtn) {
            playlistOpenBtn.classList.remove("active");
        }

        document.body.style.overflow = "";
    }

    function escapeHTML(value) {
        return String(value == null ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function formatTime(seconds) {

        if (
            seconds === undefined ||
            seconds === null ||
            isNaN(seconds)
        ) {
            return "--:--";
        }

        seconds = Math.max(0, Math.floor(seconds));

        const minutes = Math.floor(seconds / 60);
        const remaining = seconds % 60;

        return (
            minutes +
            ":" +
            String(remaining).padStart(2, "0")
        );
    }

    function showMessage(message) {
        if (!songList) return;

        songList.innerHTML =
            '<div class="playlist-loading">' +
            escapeHTML(message) +
            "</div>";
    }

    function highlightCurrentSong() {

        if (
            !app.player ||
            !app.player.getCurrentIndex
        ) {
            return;
        }

        const current =
            app.player.getCurrentIndex();

        // Only mark a song as active in the tab that is really playing
        const playingKey =
            app.player.getCurrentPlaylistKey
                ? app.player.getCurrentPlaylistKey()
                : activeKey;

        if (!songList) return;

        songList
            .querySelectorAll(".song-item")
            .forEach(function (item) {

                item.classList.toggle(
                    "active",
                    playingKey === activeKey &&
                    Number(
                        item.dataset.playlistIndex
                    ) === current
                );
            });
    }




    
    function renderMahalayaSpecial() {

        if (!songList) return;

        const data = getPlaylistData("mahalayaSpecial");

        if (
            !data ||
            !Array.isArray(data.songs) ||
            !data.songs.length
        ) {
            showMessage("Mahalaya Special data পাওয়া যায়নি।");
            return;
        }

        if (playlistDescription) {
            playlistDescription.textContent =
                data.description ||
                "বিশেষ মহালয়া অনুষ্ঠান ও নির্বাচিত অডিও।";
        }

        songList.innerHTML = "";

        data.songs.forEach(function (song, index) {

            const item = document.createElement("div");

            item.className = "song-item";
            item.dataset.playlistIndex = index;
            item.dataset.videoId = song.videoId;

            const image =
                song.thumbnail ||
                data.thumbnail ||
                (
                    "https://i.ytimg.com/vi/" +
                    song.videoId +
                    "/hqdefault.jpg"
                );

            item.innerHTML = `
                <div class="song-number">
                    ${String(index + 1).padStart(2, "0")}
                </div>

                <img
                    class="song-thumbnail"
                    src="${escapeHTML(image)}"
                    alt="Mahalaya Special"
                    loading="lazy"
                >

                <div class="song-info">
                    <div class="song-title">
                        ${escapeHTML(song.title || "Mahalaya Full")}
                    </div>

                    <div class="song-artist">
                        ${escapeHTML(
                            song.artist ||
                            app.config.defaultArtist
                        )}
                    </div>
                </div>

                <div class="song-duration">
                    FULL
                </div>
            `;

            item.addEventListener("click", function () {

                document
                    .querySelectorAll("#songList .song-item")
                    .forEach(function (el) {
                        el.classList.remove("active");
                    });

                item.classList.add("active");

                if (
                    app.player &&
                    app.player.playMahalayaSpecial
                ) {
                    app.player.playMahalayaSpecial();
                }

                closePlaylist();
            });

            songList.appendChild(item);
        });

        highlightCurrentSong();
    }

    function renderMahalayaPlaylist() {

        if (!songList) return;

        const data =
            getPlaylistData("mahalayaSongs");

        if (
            !data ||
            !Array.isArray(data.songs)
        ) {
            showMessage(
                "Mahalaya playlist data পাওয়া যায়নি।"
            );
            return;
        }

        if (playlistDescription) {
            playlistDescription.textContent =
                data.description ||
                "মহালয়ার গান";
        }

        songList.innerHTML = "";

        data.songs.forEach(function (song, index) {

            const nextSong =
                data.songs[index + 1];

            let duration = "--:--";

            if (nextSong) {
                duration =
                    formatTime(
                        nextSong.start -
                        song.start
                    );
            }

            const item =
                document.createElement("div");

            item.className = "song-item";
            item.dataset.playlistIndex = index;
            item.dataset.videoId = data.videoId;

            item.innerHTML = `

                <div class="song-number">
                    ${String(index + 1).padStart(2, "0")}
                </div>

                <img
                    class="song-thumbnail"
                    src="${escapeHTML(data.thumbnail)}"
                    alt="Mahalaya song"
                    loading="lazy"
                >

                <div class="song-info">

                    <div class="song-title">
                        ${escapeHTML(song.title)}
                    </div>

                    <div class="song-artist">
                        ${escapeHTML(
                            app.config.defaultArtist
                        )}
                    </div>

                </div>

                <div class="song-duration">
                    ${duration}
                </div>
            `;

            item.addEventListener(
                "click",
                function () {

                    document
                        .querySelectorAll(
                            "#songList .song-item"
                        )
                        .forEach(function (el) {
                            el.classList.remove("active");
                        });

                    item.classList.add("active");

                    if (
                        app.player &&
                        app.player.playMahalayaSong
                    ) {
                        app.player.playMahalayaSong(index);
                    }

                    closePlaylist();
                }
            );

            songList.appendChild(item);
        });

        highlightCurrentSong();
    }

    async function loadMetadata(videoId, item) {

        try {

            const response =
                await fetch(
                    "https://www.youtube.com/oembed?url=" +
                    encodeURIComponent(
                        "https://www.youtube.com/watch?v=" +
                        videoId
                    ) +
                    "&format=json"
                );

            if (!response.ok) {
                throw new Error(
                    "oEmbed request failed"
                );
            }

            const data =
                await response.json();

            const title =
                item.querySelector(".song-title");

            const artist =
                item.querySelector(".song-artist");

            if (title) {
                title.textContent =
                    data.title ||
                    "YouTube Song";
            }

            if (artist) {
                artist.textContent =
                    data.author_name ||
                    app.config.defaultArtist;
            }

        } catch (_) {}
    }

    function renderYouTubePlaylist(key) {

        if (!songList) return;

        const cfg = getConfig(key);

        if (!cfg || !cfg.id) {

            if (playlistDescription) {
                playlistDescription.textContent =
                    cfg
                        ? cfg.description
                        : "Playlist not configured.";
            }

            showMessage(
                "এই playlist-এর YouTube ID এখনও যোগ করা হয়নি।"
            );

            return;
        }

        if (
            !app.player ||
            !app.player.isReady ||
            !app.player.isReady()
        ) {
            showMessage(
                "YouTube playlist loading..."
            );
            return;
        }

        let list = playlistCache[key] || [];

        // The player playlist is the authoritative source when that
        // playlist is currently loaded. Cache it for future tab switches.
        if (
            app.player.getCurrentPlaylistKey &&
            app.player.getCurrentPlaylistKey() === key
        ) {
            list = app.player.getPlaylist() || [];
            if (list.length) {
                playlistCache[key] = list.slice();
            }
        }

        if (!list.length) {
            showMessage("Playlist loading...");
            return;
        }

        if (playlistDescription) {
            playlistDescription.textContent =
                cfg.description;
        }

        songList.innerHTML = "";

        list.forEach(function (videoId, index) {

            const item =
                document.createElement("div");

            item.className = "song-item";
            item.dataset.playlistIndex = index;
            item.dataset.videoId = videoId;

            const image =
                "https://i.ytimg.com/vi/" +
                videoId +
                "/hqdefault.jpg";

            item.innerHTML = `

                <div class="song-number">
                    ${String(index + 1).padStart(2, "0")}
                </div>

                <img
                    class="song-thumbnail"
                    src="${image}"
                    alt="Playlist song"
                    loading="lazy"
                >

                <div class="song-info">

                    <div class="song-title">
                        Loading song...
                    </div>

                    <div class="song-artist">
                        ${escapeHTML(
                            app.config.defaultArtist
                        )}
                    </div>

                </div>

                <div class="song-duration">
                    --:--
                </div>
            `;

            item.addEventListener(
                "click",
                function () {

                    document
                        .querySelectorAll(
                            "#songList .song-item"
                        )
                        .forEach(function (el) {
                            el.classList.remove("active");
                        });

                    item.classList.add("active");

                    if (
                        app.player &&
                        app.player.playPlaylistSong
                    ) {
                        app.player.playPlaylistSong(index, key);
                    }

                    closePlaylist();
                }
            );

            songList.appendChild(item);

            loadMetadata(videoId, item);
        });

        highlightCurrentSong();
    }

    function selectTab(key) {

        if (!TAB_KEYS.includes(key)) {
            key = "durga";
        }

        activeKey = key;

        playlistTabs.forEach(function (tab) {
            tab.classList.toggle(
                "active",
                tab.dataset.playlist === key
            );
        });

        const cfg = getConfig(key);

        if (playlistDescription && cfg) {
            playlistDescription.textContent =
                cfg.description;
        }

        if (key === "mahalayaSpecial") {

            renderMahalayaSpecial();
            return;
        }

        if (key === "mahalayaSongs") {

            // IMPORTANT: selecting a tab must not touch the YouTube player.
            // Mahalaya is a segmented view of the same video and therefore
            // only an explicit song click should change playback.
            renderMahalayaPlaylist();
            return;
        }

        if (!cfg || !cfg.id) {
            renderYouTubePlaylist(key);
            return;
        }

        if (
            app.player &&
            app.player.isReady &&
            app.player.isReady()
        ) {

            // IMPORTANT: opening the Durga tab is also UI-only. Never call
            // loadPlaylist() here, because that is what caused the audio
            // to stop/buffer and Durga music to start automatically.
            renderYouTubePlaylist(key);

        } else {

            showMessage(
                "YouTube player loading..."
            );
        }
    }

    if (playlistOpenBtn) {
        playlistOpenBtn.addEventListener(
            "click",
            openPlaylist
        );
    }

    if (playlistClose) {
        playlistClose.addEventListener(
            "click",
            closePlaylist
        );
    }

    if (playlistOverlay) {
        playlistOverlay.addEventListener(
            "click",
            function (event) {
                if (event.target === playlistOverlay) {
                    closePlaylist();
                }
            }
        );
    }

    document.addEventListener(
        "keydown",
        function (event) {
            if (event.key === "Escape") {
                closePlaylist();
            }
        }
    );

    playlistTabs.forEach(function (tab) {
        tab.addEventListener(
            "click",
            function () {
                selectTab(
                    tab.dataset.playlist
                );
            }
        );
    });

    document.addEventListener(
        "sharodiya:youtube-ready",
        function () {
            selectTab(activeKey);
        }
    );

    document.addEventListener(
        "sharodiya:playlist-loaded",
        function (event) {

            const key =
                event.detail &&
                event.detail.key;

            if (key) {
                const list =
                    app.player && app.player.getPlaylist
                        ? app.player.getPlaylist()
                        : [];

                if (list.length) {
                    playlistCache[key] = list.slice();
                }
            }

            if (key === activeKey) {
                setTimeout(
                    function () {
                        renderYouTubePlaylist(key);
                    },
                    100
                );
            }
        }
    );

    document.addEventListener(
        "sharodiya:custom-playlist-loaded",
        function (event) {

            const key =
                event.detail &&
                event.detail.key;

            if (
                key === "mahalayaSongs" &&
                activeKey === key
            ) {
                renderMahalayaPlaylist();
            }
        }
    );

    document.addEventListener(
        "sharodiya:song-changed",
        function () {
            highlightCurrentSong();
        }
    );

    document.addEventListener(
        "sharodiya:playlist-unconfigured",
        function (event) {

            if (
                event.detail &&
                event.detail.key === activeKey
            ) {
                renderYouTubePlaylist(
                    activeKey
                );
            }
        }
    );

    if (playlistTabs.length) {
        selectTab("durga");
    }

    app.playlistUI = {
        open: openPlaylist,
        close: closePlaylist,
        render: renderYouTubePlaylist,
        renderMahalaya: renderMahalayaPlaylist,
        renderMahalayaSpecial,
        selectTab
    };

})(window.Sharodiya);
