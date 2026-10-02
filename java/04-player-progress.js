/* =====================================================
   SHARODIYA 1 - PLAYER PROGRESS / SEEK
===================================================== */

(function (app) {

    let progressInterval = null;

    const progress =
        document.getElementById("progress");

    const progressBar =
        document.getElementById("progressBar");

    const currentTimeElement =
        document.getElementById("currentTime");

    const durationElement =
        document.getElementById("duration");

    function formatTime(seconds) {
        if (
            seconds === undefined ||
            seconds === null ||
            isNaN(seconds)
        ) {
            return "0:00";
        }

        seconds = Math.max(0, Math.floor(seconds));

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        return (
            minutes +
            ":" +
            String(remainingSeconds).padStart(2, "0")
        );
    }

    function updateProgress() {

        const player =
            app.player?.getPlayer();

        if (!player || !app.player.isReady()) {
            return;
        }

        let current;
        let duration;

        if (
            app.player.isMahalaya &&
            app.player.isMahalaya()
        ) {

            const song =
                app.player.getCurrentMahalayaSong();

            if (!song) {
                return;
            }

            try {

                const absoluteCurrent =
                    player.getCurrentTime();

                const segmentEnd =
                    app.player.getMahalayaSongEnd(
                        app.player.getCurrentIndex()
                    );

                if (
                    segmentEnd === null ||
                    segmentEnd <= song.start
                ) {
                    return;
                }

                current =
                    Math.max(
                        0,
                        absoluteCurrent - song.start
                    );

                duration =
                    segmentEnd - song.start;

                current =
                    Math.min(current, duration);

            } catch (_) {
                return;
            }

        } else {

            try {
                current = player.getCurrentTime();
                duration = player.getDuration();
            } catch (_) {
                return;
            }
        }

        if (!duration || duration <= 0) {
            return;
        }

        const percentage =
            (current / duration) * 100;

        if (progress) {
            progress.style.width =
                Math.max(0, Math.min(100, percentage)) + "%";
        }

        if (currentTimeElement) {
            currentTimeElement.textContent =
                formatTime(current);
        }

        if (durationElement) {
            durationElement.textContent =
                formatTime(duration);
        }
    }

    function start() {
        stop();
        updateProgress();
        progressInterval =
            setInterval(updateProgress, 250);
    }

    function stop() {
        if (progressInterval) {
            clearInterval(progressInterval);
            progressInterval = null;
        }
    }

    function reset() {
        if (currentTimeElement) {
            currentTimeElement.textContent = "0:00";
        }

        if (durationElement) {
            durationElement.textContent = "0:00";
        }

        if (progress) {
            progress.style.width = "0%";
        }
    }

    if (progressBar) {

        progressBar.addEventListener(
            "click",
            function (event) {

                const player =
                    app.player?.getPlayer();

                if (!player || !app.player.isReady()) {
                    return;
                }

                const rect =
                    progressBar.getBoundingClientRect();

                if (!rect.width) {
                    return;
                }

                const clickPosition =
                    event.clientX - rect.left;

                const percentage =
                    Math.max(
                        0,
                        Math.min(
                            1,
                            clickPosition / rect.width
                        )
                    );

                if (
                    app.player.isMahalaya &&
                    app.player.isMahalaya()
                ) {

                    const song =
                        app.player.getCurrentMahalayaSong();

                    if (!song) {
                        return;
                    }

                    const end =
                        app.player.getMahalayaSongEnd(
                            app.player.getCurrentIndex()
                        );

                    if (end === null) {
                        return;
                    }

                    const duration =
                        end - song.start;

                    const target =
                        song.start +
                        duration * percentage;

                    try {
                        player.seekTo(target, true);
                    } catch (_) {}

                    updateProgress();
                    return;
                }

                let duration;

                try {
                    duration = player.getDuration();
                } catch (_) {
                    return;
                }

                if (!duration || duration <= 0) {
                    return;
                }

                try {
                    player.seekTo(
                        duration * percentage,
                        true
                    );
                } catch (_) {}
            }
        );
    }

    app.progress = {
        start,
        stop,
        reset,
        update: updateProgress,
        formatTime
    };

})(window.Sharodiya);
