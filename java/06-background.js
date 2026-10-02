/* =====================================================
   SHARODIYA 1 - TIME BASED BACKGROUND
===================================================== */

(function () {

    const background1 =
        document.querySelector(".background-layer-1");

    const background2 =
        document.querySelector(".background-layer-2");

    let activeBackground = 1;
    let currentImage = "";

    function getTimeBasedImage() {

        const now = new Date();

        const hour = now.getHours();
        const minute = now.getMinutes();
        const currentTime = hour * 60 + minute;

        
        return "../html/images/backgrounds/durga3.PNG";
    }

    function updateTimeBackground() {

        if (!background1 || !background2) {
            return;
        }

        const newImage = getTimeBasedImage();

        if (newImage === currentImage) {
            return;
        }

        currentImage = newImage;

        if (activeBackground === 1) {

            background2.style.backgroundImage =
                `url("${newImage}")`;

            background2.style.opacity = "1";
            background1.style.opacity = "0";

            activeBackground = 2;

        } else {

            background1.style.backgroundImage =
                `url("${newImage}")`;

            background1.style.opacity = "1";
            background2.style.opacity = "0";

            activeBackground = 1;
        }
    }

    updateTimeBackground();

    setInterval(
        updateTimeBackground,
        60 * 1000
    );

    window.Sharodiya.background = {
        getTimeBasedImage,
        updateTimeBackground
    };

})();
