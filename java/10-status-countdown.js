/* =====================================================
   SHARODIYA — DEVI PAKSHA COUNTDOWN
===================================================== */

(function () {

    "use strict";

    const DEVI_PAKSHA_DATE =
        new Date(
            2026,
            9,
            10
        );

    function updateCountdown() {

        const element =
            document.getElementById(
                "statusCountdownText"
            );

        if (!element) return;

        const now =
            new Date();

        const today =
            new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate()
            );

        const difference =
            DEVI_PAKSHA_DATE -
            today;

        const days =
            Math.round(
                difference /
                86400000
            );

        if (days > 1) {

            element.textContent =
                `${days} days until Devi Paksha`;

        }

        else if (days === 1) {

            element.textContent =
                "1 day until Devi Paksha";

        }

        else if (days === 0) {

            element.textContent =
                "Devi Paksha begins today";

        }

        else {

            element.textContent =
                "Devi Paksha has begun";

        }
    }

    function startCountdown() {

        updateCountdown();

        setInterval(
            updateCountdown,
            60000
        );
    }

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            startCountdown
        );

    } else {

        startCountdown();

    }

})();