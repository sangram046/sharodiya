/* =====================================================
   SHARODIYA — STATUS CLOCK
   Real-time 12-hour IST clock
===================================================== */

(function () {

    "use strict";

    function updateStatusClock() {

        const clock =
            document.getElementById(
                "statusClockTime"
            );

        if (!clock) return;

        const now = new Date();

        let hours = now.getHours();

        const minutes =
            String(
                now.getMinutes()
            ).padStart(2, "0");

        const suffix =
            hours >= 12
                ? "PM"
                : "AM";

        hours =
            hours % 12 || 12;

        clock.textContent =
            `${hours}:${minutes} ${suffix}`;
    }

    function startClock() {

        updateStatusClock();

        setInterval(
            updateStatusClock,
            1000
        );
    }

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            startClock
        );

    } else {

        startClock();

    }

})();