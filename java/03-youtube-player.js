/* =====================================================
   SHARODIYA 1 - YOUTUBE / MEDIA ENGINE
===================================================== */

(function (app) {

    let youtubePlayer = null;
    let youtubeReady = false;

    let currentPlaylistIndex = 0;
    let currentPlaylistKey = "durga";
    let currentPlaylistId = "";

    // Preserve playback position separately for each playlist.
    const playlistStates = {};

    let shuffleEnabled = false;
    let repeatEnabled = false;

    let playerStartRequested = false;
    let segmentMonitor = null;

    const playerTitle = document.getElementById("playerTitle");
    const playerArtist = document.getElementById("playerArtist");
    const playerArtwork = document.getElementById("playerArtwork");
    const mainPlay = document.getElementById("mainPlay");
    const previousBtn = document.getElementById("previousBtn");
    const nextBtn = document.getElementById("nextBtn");
    const shuffleBtn = document.getElementById("shuffleBtn");
    const repeatBtn = document.getElementById("repeatBtn");

    function playlistConfig(key) {
        return app.config.playlists[key] || null;
    }

    function playlistData(key) {
        return app.playlists && app.playlists[key]
            ? app.playlists[key]
            : null;
    }

    function isMahalayaPlaylist() {
        const data = playlistData(currentPlaylistKey);
        return !!(data && data.type === "custom-segments");
    }

    function isMahalayaSpecialPlaylist() {
        return currentPlaylistKey === "mahalayaSpecial";
    }

    // Video that holds all the Mahalaya songs (set in 07-playlist-data.js)
    function mahalayaVideoId() {
        const data = playlistData("mahalayaSongs");
        return (data && data.videoId) || "LOlyrK53QM4";
    }

    function resetProgress() {
        if (app.progress && app.progress.reset) {
            app.progress.reset();
        }
    }

    // Count of errors in a row, so a playlist full of unavailable videos
    // cannot skip forever.
    let errorStreak = 0;

    function getMahalayaSongs() {
        const data = playlistData("mahalayaSongs");
        return data && Array.isArray(data.songs)
            ? data.songs
            : [];
    }

    function getCurrentMahalayaSong() {
        return getMahalayaSongs()[currentPlaylistIndex] || null;
    }

    function getMahalayaSongEnd(index) {
        const songs = getMahalayaSongs();
        const current = songs[index];

        if (!current) {
            return null;
        }

        const next = songs[index + 1];

        if (next) {
            return next.start;
        }

        if (youtubePlayer) {
            try {
                const duration = youtubePlayer.getDuration();
                if (duration && duration > current.start) {
                    return duration;
                }
            } catch (_) {}
        }

        return null;
    }

    function saveCurrentPlaylistState() {

        if (!youtubePlayer) {
            return;
        }

        if (!currentPlaylistKey || currentPlaylistKey === "mahalayaSpecial") {
            return;
        }

        try {
            const state = youtubePlayer.getPlayerState();
            const data = getVideoData();
            const index = youtubePlayer.getPlaylistIndex();
            const time = youtubePlayer.getCurrentTime();

            playlistStates[currentPlaylistKey] = {
                index: typeof index === "number" && index >= 0
                    ? index
                    : currentPlaylistIndex,
                videoId: data && data.video_id ? data.video_id : "",
                startSeconds: Number.isFinite(time) ? time : 0,
                wasPlaying: state === (window.YT && YT.PlayerState.PLAYING)
            };
        } catch (_) {}
    }

    function getSavedPlaylistState(key) {
        const state = playlistStates[key];

        if (!state) {
            return {
                index: 0,
                startSeconds: 0,
                videoId: "",
                wasPlaying: true
            };
        }

        return {
            index: Math.max(0, Number(state.index) || 0),
            startSeconds: Math.max(0, Number(state.startSeconds) || 0),
            videoId: state.videoId || "",
            wasPlaying: state.wasPlaying !== false
        };
    }

    function setPlayerText(title, artist) {
        if (playerTitle) {
            playerTitle.textContent =
                title || "Sharodiya Playlist";
        }

        if (playerArtist) {
            playerArtist.textContent =
                artist || app.config.defaultArtist;
        }
    }

    function updateArtwork(index) {

        if (!playerArtwork) {
            return;
        }

        if (isMahalayaPlaylist()) {
            const data = playlistData("mahalayaSongs");

            if (data && data.thumbnail) {
                playerArtwork.src = data.thumbnail;
                return;
            }
        }

        if (isMahalayaSpecialPlaylist()) {
            const special = playlistData("mahalayaSpecial");
            const specialSong =
                special && special.songs && special.songs[0];

            const image =
                (special && special.thumbnail) ||
                (specialSong && specialSong.thumbnail) ||
                (
                    specialSong && specialSong.videoId
                        ? "https://i.ytimg.com/vi/" +
                          specialSong.videoId +
                          "/hqdefault.jpg"
                        : ""
                );

            if (image) {
                playerArtwork.src = image;
                return;
            }
        }

        if (!youtubePlayer) {
            return;
        }

        let list = [];

        try {
            list = youtubePlayer.getPlaylist() || [];
        } catch (_) {
            return;
        }

        const id = list[index];

        if (!id) {
            return;
        }

        playerArtwork.src =
            "https://i.ytimg.com/vi/" +
            id +
            "/hqdefault.jpg";

        playerArtwork.onerror = function () {
            if (app.thumbnails && app.thumbnails.fallback) {
                playerArtwork.src = app.thumbnails.fallback;
            }
        };
    }

    function getVideoData() {
        if (!youtubePlayer) {
            return null;
        }

        try {
            return youtubePlayer.getVideoData() || null;
        } catch (_) {
            return null;
        }
    }

    function updateCurrentSongInfo(retries) {

        if (!youtubePlayer) {
            return;
        }

        retries =
            typeof retries === "number"
                ? retries
                : 0;

        if (isMahalayaPlaylist()) {

            const song = getCurrentMahalayaSong();

            if (song) {

                updateArtwork(currentPlaylistIndex);

                setPlayerText(
                    song.title,
                    app.config.defaultArtist
                );

                document.dispatchEvent(
                    new CustomEvent(
                        "sharodiya:song-changed",
                        {
                            detail: {
                                index: currentPlaylistIndex,
                                title: song.title,
                                artist: app.config.defaultArtist,
                                videoId: mahalayaVideoId()
                            }
                        }
                    )
                );
            }

            return;
        }

        if (isMahalayaSpecialPlaylist()) {

            const special = playlistData("mahalayaSpecial");
            const specialSong =
                special && special.songs && special.songs[0];

            if (specialSong) {

                currentPlaylistIndex = 0;

                updateArtwork(0);

                setPlayerText(
                    specialSong.title || "Mahalaya Full",
                    specialSong.artist || app.config.defaultArtist
                );

                document.dispatchEvent(
                    new CustomEvent(
                        "sharodiya:song-changed",
                        {
                            detail: {
                                index: 0,
                                title: specialSong.title || "",
                                artist: specialSong.artist || "",
                                videoId: specialSong.videoId || ""
                            }
                        }
                    )
                );
            }

            return;
        }

        try {
            const index = youtubePlayer.getPlaylistIndex();

            if (typeof index === "number" && index >= 0) {
                currentPlaylistIndex = index;
            }
        } catch (_) {}

        updateArtwork(currentPlaylistIndex);

        const data = getVideoData();

        if (data && (data.title || data.author)) {

            setPlayerText(
                data.title || "Sharodiya Playlist",
                data.author || app.config.defaultArtist
            );

            document.dispatchEvent(
                new CustomEvent(
                    "sharodiya:song-changed",
                    {
                        detail: {
                            index: currentPlaylistIndex,
                            title: data.title || "",
                            artist: data.author || "",
                            videoId: data.video_id || ""
                        }
                    }
                )
            );

            return;
        }

        if (retries < 15) {
            setTimeout(
                () => updateCurrentSongInfo(retries + 1),
                250
            );
        }
    }

    function updatePlayerButton() {

        if (!mainPlay || !youtubePlayer || !window.YT) {
            return;
        }

        let state;

        try {
            state = youtubePlayer.getPlayerState();
        } catch (_) {
            return;
        }

        const playing =
            state === YT.PlayerState.PLAYING;

        mainPlay.textContent =
            playing ? "❚❚" : "▶";

        mainPlay.setAttribute(
            "aria-label",
            playing ? "Pause" : "Play"
        );
    }

    function playMahalayaSong(index) {

        if (!youtubePlayer || !youtubeReady) {
            return;
        }

        const songs = getMahalayaSongs();

        if (
            !songs.length ||
            index < 0 ||
            index >= songs.length
        ) {
            return;
        }

        // Clicking a song in the Mahalaya Songs tab is an explicit choice,
        // so this becomes the active playlist (segment timer, progress bar
        // and auto-next all depend on this).
        if (currentPlaylistKey !== "mahalayaSongs") {
            saveCurrentPlaylistState();
            currentPlaylistKey = "mahalayaSongs";
            currentPlaylistId = "";
        }

        currentPlaylistIndex = index;
        errorStreak = 0;
        resetProgress();

        const song = songs[index];

        updateArtwork(index);

        setPlayerText(
            song.title,
            app.config.defaultArtist
        );

        try {
            youtubePlayer.loadVideoById({
                videoId: mahalayaVideoId(),
                startSeconds: song.start
            });
        } catch (error) {
            console.error(
                "Could not play Mahalaya song:",
                error
            );
        }

        document.dispatchEvent(
            new CustomEvent(
                "sharodiya:song-changed",
                {
                    detail: {
                        index,
                        title: song.title,
                        artist: app.config.defaultArtist,
                        videoId: mahalayaVideoId()
                    }
                }
            )
        );
    }

    function playMahalayaSpecial() {

        if (!youtubePlayer || !youtubeReady) {
            return;
        }

        const data = playlistData("mahalayaSpecial");
        const song = data && data.songs && data.songs[0];

        if (!song || !song.videoId) {
            return;
        }

        // Remember where the previous playlist stopped before leaving it.
        if (currentPlaylistKey !== "mahalayaSpecial") {
            saveCurrentPlaylistState();
        }

        currentPlaylistKey = "mahalayaSpecial";
        currentPlaylistId = "";
        currentPlaylistIndex = 0;
        errorStreak = 0;
        resetProgress();

        setPlayerText(
            song.title || "Mahalaya Full",
            song.artist || app.config.defaultArtist
        );

        updateArtwork(0);

        try {
            youtubePlayer.loadVideoById(song.videoId);
        } catch (error) {
            console.error(
                "Could not play Mahalaya Special:",
                error
            );
        }

        document.dispatchEvent(
            new CustomEvent(
                "sharodiya:song-changed",
                {
                    detail: {
                        index: 0,
                        title: song.title || "Mahalaya Full",
                        artist: song.artist || "",
                        videoId: song.videoId
                    }
                }
            )
        );
    }

    function playPlaylistSong(index, requestedPlaylistKey) {

        if (!youtubePlayer || !youtubeReady) {
            return;
        }

        // A tab switch is UI-only. The actual player playlist changes only
        // when the user explicitly clicks a song in that tab.
        if (requestedPlaylistKey && requestedPlaylistKey !== currentPlaylistKey) {

            const cfg = playlistConfig(requestedPlaylistKey);

            if (!cfg || !cfg.id) {
                return;
            }

            saveCurrentPlaylistState();

            currentPlaylistKey = requestedPlaylistKey;
            currentPlaylistId = cfg.id;
            currentPlaylistIndex = index;
            errorStreak = 0;
            resetProgress();

            setPlayerText(
                "Loading...",
                app.config.defaultArtist
            );

            updateArtwork(index);

            try {
                youtubePlayer.loadPlaylist({
                    list: cfg.id,
                    listType: "playlist",
                    index: index
                });

                // The click is a direct user gesture, so explicitly resume
                // playback after loading the requested playlist.
                setTimeout(function () {
                    try {
                        youtubePlayer.playVideo();
                    } catch (_) {}
                }, 100);
            } catch (error) {
                console.error(
                    "Could not switch to playlist song:",
                    error
                );
            }

            return;
        }

        if (isMahalayaPlaylist()) {
            playMahalayaSong(index);
            return;
        }

        const list = getPlaylist();

        if (
            !list.length ||
            index < 0 ||
            index >= list.length
        ) {
            return;
        }

        currentPlaylistIndex = index;
        updateArtwork(index);

        setPlayerText(
            "Loading...",
            app.config.defaultArtist
        );

        try {
            youtubePlayer.playVideoAt(index);
        } catch (error) {
            console.error(
                "Could not play playlist song:",
                error
            );
        }
    }

    function getPlaylist() {
        if (!youtubePlayer) {
            return [];
        }

        try {
            return youtubePlayer.getPlaylist() || [];
        } catch (_) {
            return [];
        }
    }

    function loadPlaylist(key) {

        if (!key) {
            return false;
        }

        // Save the exact Durga/Mahalaya playlist position before switching away.
        if (currentPlaylistKey && currentPlaylistKey !== key) {
            saveCurrentPlaylistState();
        }

        if (key === "mahalayaSongs") {

            currentPlaylistKey = key;
            currentPlaylistId = "";

            const data = playlistData(key);
            const first = data?.songs?.[0];

            // Do not force the segmented playlist back to song 1 when returning to it.
            const saved = playlistStates[key];
            currentPlaylistIndex = saved
                ? Math.max(0, Number(saved.index) || 0)
                : 0;

            setPlayerText(
                first?.title || "মহালয়ার গান",
                app.config.defaultArtist
            );

            updateArtwork(currentPlaylistIndex);

            document.dispatchEvent(
                new CustomEvent(
                    "sharodiya:custom-playlist-loaded",
                    { detail: { key } }
                )
            );

            return true;
        }

        const cfg = playlistConfig(key);

        if (!cfg || !cfg.id) {

            currentPlaylistKey = key;
            currentPlaylistId = "";

            document.dispatchEvent(
                new CustomEvent(
                    "sharodiya:playlist-unconfigured",
                    { detail: { key } }
                )
            );

            return false;
        }

        if (!youtubePlayer || !youtubeReady) {
            return false;
        }

        currentPlaylistKey = key;
        currentPlaylistId = cfg.id;

        const saved = getSavedPlaylistState(key);
        currentPlaylistIndex = saved.index;

        setPlayerText(
            "Loading playlist...",
            app.config.defaultArtist
        );

        try {
            const options = {
                list: cfg.id,
                listType: "playlist",
                index: saved.index
            };

            // YouTube supports startSeconds with loadPlaylist, so restore the
            // exact position instead of starting the playlist from zero.
            if (saved.startSeconds > 0) {
                options.startSeconds = saved.startSeconds;
            }

            youtubePlayer.loadPlaylist(options);

            return true;

        } catch (error) {

            console.error(
                "Could not load playlist:",
                error
            );

            return false;
        }
    }

    function startSegmentMonitor() {

        stopSegmentMonitor();

        if (!isMahalayaPlaylist()) {
            return;
        }

        segmentMonitor = setInterval(() => {

            if (
                !youtubePlayer ||
                !youtubeReady ||
                !isMahalayaPlaylist()
            ) {
                return;
            }

            let currentTime;

            try {
                currentTime =
                    youtubePlayer.getCurrentTime();
            } catch (_) {
                return;
            }

            const end =
                getMahalayaSongEnd(
                    currentPlaylistIndex
                );

            if (end === null) {
                return;
            }

            if (currentTime >= end - 0.15) {

                stopSegmentMonitor();

                if (repeatEnabled) {

                    const song =
                        getCurrentMahalayaSong();

                    if (song) {
                        try {
                            youtubePlayer.loadVideoById({
                                videoId: mahalayaVideoId(),
                                startSeconds: song.start
                            });
                        } catch (_) {}
                    }

                    return;
                }

                playNextMahalayaSong();
            }

        }, 250);
    }

    function stopSegmentMonitor() {

        if (segmentMonitor) {
            clearInterval(segmentMonitor);
            segmentMonitor = null;
        }
    }

    function playNextMahalayaSong() {

        const songs = getMahalayaSongs();

        if (!songs.length) {
            return;
        }

        let nextIndex;

        if (shuffleEnabled) {

            if (songs.length === 1) {
                nextIndex = 0;
            } else {
                do {
                    nextIndex =
                        Math.floor(
                            Math.random() *
                            songs.length
                        );
                } while (
                    nextIndex ===
                    currentPlaylistIndex
                );
            }

        } else {
            nextIndex =
                currentPlaylistIndex + 1;
        }

        if (nextIndex >= songs.length) {
            stopSegmentMonitor();
            updatePlayerButton();
            return;
        }

        playMahalayaSong(nextIndex);
    }

    function playPreviousMahalayaSong() {

        const songs = getMahalayaSongs();

        if (!songs.length) {
            return;
        }

        let previousIndex =
            currentPlaylistIndex - 1;

        if (previousIndex < 0) {
            previousIndex = 0;
        }

        playMahalayaSong(previousIndex);
    }

    function createYouTubePlayer() {

        if (playerStartRequested) {
            return;
        }

        if (!window.YT || !YT.Player) {
            return;
        }

        if (!document.getElementById("youtubePlayer")) {
            return;
        }

        playerStartRequested = true;

        youtubePlayer =
            new YT.Player(
                "youtubePlayer",
                {
                    width: "1",
                    height: "1",

                    playerVars: {
                        autoplay: 0,
                        controls: 0,
                        playsinline: 1,
                        rel: 0,
                        modestbranding: 1
                    },

                    events: {
                        onReady: onYouTubeReady,
                        onStateChange: handleYouTubeState,
                        onError: handleYouTubeError
                    }
                }
            );
    }

    function onYouTubeReady(event) {

        youtubeReady = true;
        youtubePlayer = event.target;

        currentPlaylistKey = "durga";

        const cfg = playlistConfig("durga");

        currentPlaylistId =
            cfg ? cfg.id : "";

        // cuePlaylist() fills the playlist without starting playback.
        // loadPlaylist() tries to autoplay, which browsers block before
        // the visitor has clicked anything, leaving the list empty.
        if (currentPlaylistId) {
            try {
                youtubePlayer.cuePlaylist({
                    list: currentPlaylistId,
                    listType: "playlist",
                    index: 0
                });
            } catch (error) {
                console.error(error);
            }
        }

        setPlayerText(
            "Select a song",
            app.config.defaultArtist
        );

        updatePlayerButton();

        document.dispatchEvent(
            new CustomEvent(
                "sharodiya:youtube-ready",
                {
                    detail: {
                        key: currentPlaylistKey,
                        playlistId: currentPlaylistId
                    }
                }
            )
        );
    }

    function handleYouTubeState(event) {

        if (!window.YT) {
            return;
        }

        // Lets other modules (for example the Play Now button) follow
        // the real player state.
        document.dispatchEvent(
            new CustomEvent(
                "sharodiya:player-state",
                {
                    detail: {
                        state: event.data,
                        key: currentPlaylistKey
                    }
                }
            )
        );

        switch (event.data) {

            case YT.PlayerState.PLAYING:

                errorStreak = 0;

                saveCurrentPlaylistState();
                updatePlayerButton();

                if (
                    app.progress &&
                    app.progress.start
                ) {
                    app.progress.start();
                }

                updateCurrentSongInfo(0);
                startSegmentMonitor();

                break;

            case YT.PlayerState.PAUSED:

                saveCurrentPlaylistState();
                updatePlayerButton();

                if (
                    app.progress &&
                    app.progress.stop
                ) {
                    app.progress.stop();
                }

                // Keep the bar on the exact paused position
                if (app.progress && app.progress.update) {
                    app.progress.update();
                }

                stopSegmentMonitor();

                break;

            case YT.PlayerState.ENDED:

                if (
                    app.progress &&
                    app.progress.stop
                ) {
                    app.progress.stop();
                }

                stopSegmentMonitor();

                if (isMahalayaPlaylist()) {

                    if (repeatEnabled) {
                        playMahalayaSong(
                            currentPlaylistIndex
                        );
                    } else {
                        playNextMahalayaSong();
                    }

                    break;
                }

                if (repeatEnabled) {

                    try {
                        youtubePlayer.seekTo(0, true);
                        youtubePlayer.playVideo();
                    } catch (_) {}

                } else {
                    updatePlayerButton();
                }

                break;

            case YT.PlayerState.BUFFERING:
                updatePlayerButton();

                // Keep the progress bar moving while seeking/loading
                if (app.progress && app.progress.start) {
                    app.progress.start();
                }

                break;

            case YT.PlayerState.CUED:

                updatePlayerButton();
                updateCurrentSongInfo(0);

                if (!isMahalayaSpecialPlaylist()) {
                    document.dispatchEvent(
                        new CustomEvent(
                            "sharodiya:playlist-loaded",
                            {
                                detail: {
                                    key: currentPlaylistKey,
                                    playlistId: currentPlaylistId
                                }
                            }
                        )
                    );
                }

                break;
        }
    }

    function handleYouTubeError(event) {

        const code = event && event.data;

        console.error("YouTube Player Error:", code);

        if (app.progress && app.progress.stop) {
            app.progress.stop();
        }

        stopSegmentMonitor();

        const isYouTubePlaylist =
            !isMahalayaPlaylist() &&
            !isMahalayaSpecialPlaylist();

        const list = isYouTubePlaylist ? getPlaylist() : [];

        // A playlist that cannot be loaded at all
        if (isYouTubePlaylist && !list.length) {
            setPlayerText(
                "Playlist could not be loaded",
                "Check the playlist ID in 00-config.js"
            );
            updatePlayerButton();
            return;
        }

        const reasons = {
            2: "Invalid video ID",
            5: "Player error, please try again",
            100: "Video not found or private",
            101: "Owner disabled embedding for this video",
            150: "Owner disabled embedding for this video"
        };

        const reason = reasons[code] || "This audio could not be played";

        // One unavailable song in a playlist: skip to the next one
        if (isYouTubePlaylist && list.length > 1 && errorStreak < 5) {

            errorStreak++;

            setPlayerText(
                "Skipping unavailable song...",
                reason
            );

            setTimeout(function () {
                try {
                    youtubePlayer.nextVideo();
                } catch (_) {}
            }, 800);

            return;
        }

        setPlayerText(reason, app.config.defaultArtist);
        updatePlayerButton();
    }

    window.__sharodiyaStartYouTube =
        createYouTubePlayer;

    if (mainPlay) {

        mainPlay.addEventListener(
            "click",
            function () {

                if (!youtubePlayer || !youtubeReady) {
                    return;
                }

                try {

                    const state =
                        youtubePlayer.getPlayerState();

                    if (
                        state ===
                        YT.PlayerState.PLAYING
                    ) {
                        youtubePlayer.pauseVideo();
                    } else {

                        if (isMahalayaSpecialPlaylist()) {

                            const data = playlistData("mahalayaSpecial");
                            const song = data && data.songs && data.songs[0];

                            if (song && song.videoId) {
                                const currentVideo = getVideoData();

                                if (!currentVideo || currentVideo.video_id !== song.videoId) {
                                    playMahalayaSpecial();
                                } else {
                                    youtubePlayer.playVideo();
                                }
                            }

                        } else if (isMahalayaPlaylist()) {

                            const song =
                                getCurrentMahalayaSong();

                            if (song) {

                                const currentVideo =
                                    getVideoData();

                                if (
                                    !currentVideo ||
                                    currentVideo.video_id !==
                                        mahalayaVideoId()
                                ) {
                                    playMahalayaSong(
                                        currentPlaylistIndex
                                    );
                                } else {
                                    youtubePlayer.playVideo();
                                }
                            }

                        } else {
                            youtubePlayer.playVideo();
                        }
                    }

                } catch (_) {}
            }
        );
    }

    if (nextBtn) {

        nextBtn.addEventListener(
            "click",
            function () {

                if (!youtubePlayer || !youtubeReady) {
                    return;
                }

                if (isMahalayaSpecialPlaylist()) {
                    return;
                }

                if (isMahalayaPlaylist()) {
                    playNextMahalayaSong();
                    return;
                }

                try {
                    saveCurrentPlaylistState();
                    youtubePlayer.nextVideo();
                } catch (_) {}
            }
        );
    }

    if (previousBtn) {

        previousBtn.addEventListener(
            "click",
            function () {

                if (!youtubePlayer || !youtubeReady) {
                    return;
                }

                if (isMahalayaSpecialPlaylist()) {
                    return;
                }

                if (isMahalayaPlaylist()) {

                    try {

                        const song =
                            getCurrentMahalayaSong();

                        const currentTime =
                            youtubePlayer.getCurrentTime();

                        if (
                            song &&
                            currentTime >
                                song.start + 3
                        ) {
                            youtubePlayer.seekTo(
                                song.start,
                                true
                            );
                            return;
                        }

                        playPreviousMahalayaSong();

                    } catch (_) {}

                    return;
                }

                try {

                    saveCurrentPlaylistState();

                    if (
                        youtubePlayer.getCurrentTime() >
                        3
                    ) {
                        youtubePlayer.seekTo(0, true);
                    } else {
                        youtubePlayer.previousVideo();
                    }

                } catch (_) {}
            }
        );
    }

    if (shuffleBtn) {

        shuffleBtn.addEventListener(
            "click",
            function () {

                shuffleEnabled =
                    !shuffleEnabled;

                if (
                    youtubePlayer &&
                    !isMahalayaPlaylist()
                ) {
                    try {
                        youtubePlayer.setShuffle(
                            shuffleEnabled
                        );
                    } catch (_) {}
                }

                shuffleBtn.classList.toggle(
                    "active",
                    shuffleEnabled
                );
            }
        );
    }

    if (repeatBtn) {

        repeatBtn.addEventListener(
            "click",
            function () {

                repeatEnabled =
                    !repeatEnabled;

                repeatBtn.classList.toggle(
                    "active",
                    repeatEnabled
                );
            }
        );
    }

    // Playlist item clicks are handled by 08-playlist-ui.js.
    // Keeping a second document-level click handler here caused Mahalaya
    // segments to be loaded twice on some tab transitions.

    app.player = {

        getPlayer: () => youtubePlayer,

        isReady: () => youtubeReady,

        getPlaylist,

        getCurrentIndex:
            () => currentPlaylistIndex,

        getCurrentPlaylistKey:
            () => currentPlaylistKey,

        getCurrentVideoData:
            getVideoData,

        playPlaylistSong,

        playMahalayaSong,

        playMahalayaSpecial,

        loadPlaylist,

        updateArtwork,

        updateCurrentSongInfo,

        updatePlayerButton,

        isMahalaya:
            isMahalayaPlaylist,

        getCurrentMahalayaSong,

        getMahalayaSongEnd,

        getMahalayaSongs,

        saveCurrentPlaylistState
    };

})(window.Sharodiya);
