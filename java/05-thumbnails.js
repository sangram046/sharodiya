/* =====================================================
   SHARODIYA 1 - THUMBNAIL HANDLER
===================================================== */

(function (app) {

    const FALLBACK_THUMBNAIL =
        "https://i.ytimg.com/vi/placeholder/hqdefault.jpg";

    function youtubeThumbnail(videoId) {
        if (!videoId) {
            return FALLBACK_THUMBNAIL;
        }

        return (
            "https://i.ytimg.com/vi/" +
            videoId +
            "/hqdefault.jpg"
        );
    }

    function mahalayaThumbnail() {
        const data =
            app.config?.playlists?.mahalayaSongs;

        if (data && data.thumbnail) {
            return data.thumbnail;
        }

        return FALLBACK_THUMBNAIL;
    }

    function setPlayerThumbnail(videoId) {
        const artwork =
            document.getElementById("playerArtwork");

        if (!artwork) {
            return;
        }

        const currentKey =
            app.player &&
            app.player.getCurrentPlaylistKey
                ? app.player.getCurrentPlaylistKey()
                : "";

        if (currentKey === "mahalayaSongs") {
            artwork.src = mahalayaThumbnail();
            return;
        }

        artwork.src = youtubeThumbnail(videoId);
    }

    function applyFallback(image) {
        if (!image) {
            return;
        }

        image.addEventListener(
            "error",
            () => {
                image.src = FALLBACK_THUMBNAIL;
            },
            { once: true }
        );
    }

    app.thumbnails = {
        youtubeThumbnail,
        mahalayaThumbnail,
        setPlayerThumbnail,
        applyFallback,
        fallback: FALLBACK_THUMBNAIL
    };

})(window.Sharodiya);
