/* =====================================================
   SHARODIYA — TODAY'S PUJA / GREETING CAPSULE
   Follows the website's own calendar (calendar.js):
   it reads today's Tithi + Paksha from
   window.Sharodiya.calendarPanchang, so the capsule
   always agrees with the Tithi shown in the calendar.

   Puja season, Shukla paksha  → আজ মহাষষ্ঠী ... বিজয়া দশমী
   Puja season, Amavasya       → আজ মহালয়া
   Any other day               → শুভ সকাল / দুপুর / ...
===================================================== */

(function () {

    "use strict";

    /* -------------------------------------------------
       PUJA SEASON WINDOW (YYYY-MM-DD)

       Shashthi-Dashami tithis come every month, so the
       capsule only looks at them inside this window.
       Update the two dates every year:
       Mahalaya (Amavasya) → last puja-season day.
    ------------------------------------------------- */

    const SEASON = {
        from: "2026-10-10",
        to:   "2026-10-25"
    };

    /* -------------------------------------------------
       TITHI (English name from calendar.js) → CAPSULE TEXT
    ------------------------------------------------- */

    const PUJA_TITHI = {
        Shashthi: "আজ মহাষষ্ঠী",
        Saptami:  "আজ মহাসপ্তমী",
        Ashtami:  "আজ মহাষ্টমী",
        Navami:   "আজ মহানবমী",
        Dashami:  "আজ বিজয়া দশমী"
    };

    const MAHALAYA_TEXT = "আজ মহালয়া";

    /* -------------------------------------------------
       BACKUP LIST

       Used only when the calendar's Tithi could not be
       loaded (offline, API down). Edit if needed.
    ------------------------------------------------- */

    const BACKUP_DAYS = [
        { date: "2026-10-10", text: "আজ মহালয়া" },
        { date: "2026-10-16", text: "আজ মহাষষ্ঠী" },
        { date: "2026-10-17", text: "আজ মহাসপ্তমী" },
        { date: "2026-10-18", text: "আজ মহাসপ্তমী" },
        { date: "2026-10-19", text: "আজ মহাষ্টমী" },
        { date: "2026-10-20", text: "আজ মহানবমী" },
        { date: "2026-10-21", text: "আজ বিজয়া দশমী" }
    ];

    const textEl = document.getElementById("statusPujaText");
    const iconEl = document.getElementById("statusPujaIcon");
    const capsule = document.getElementById("statusPuja");

    if (!textEl) return;


    /* -------------------------------------------------
       HELPERS
    ------------------------------------------------- */

    // Same local-date logic as calendar.js
    function dateKey(date) {
        return (
            date.getFullYear() + "-" +
            String(date.getMonth() + 1).padStart(2, "0") + "-" +
            String(date.getDate()).padStart(2, "0")
        );
    }

    function getHour() {
        return Number(
            new Intl.DateTimeFormat("en-GB", {
                timeZone: "Asia/Kolkata",
                hour: "2-digit",
                hourCycle: "h23"
            }).format(new Date())
        );
    }

    function getGreeting(hour) {

        if (hour >= 4 && hour < 12) {
            return { icon: "☀️", text: "শুভ সকাল" };
        }

        if (hour >= 12 && hour < 16) {
            return { icon: "🌤️", text: "শুভ দুপুর" };
        }

        if (hour >= 16 && hour < 18) {
            return { icon: "🌇", text: "শুভ বিকেল" };
        }

        if (hour >= 18 && hour < 21) {
            return { icon: "🪔", text: "শুভ সন্ধ্যা" };
        }

        return { icon: "🌙", text: "শুভ রাত্রি" };
    }


    /* -------------------------------------------------
       TODAY'S PUJA NAME (from the calendar's Tithi)
       returns null when today is not a puja day
    ------------------------------------------------- */

    function getPujaText() {

        const todayKey = dateKey(new Date());

        if (todayKey < SEASON.from || todayKey > SEASON.to) {
            return null;
        }

        const panchang =
            window.Sharodiya &&
            window.Sharodiya.calendarPanchang;

        // Calendar Tithi is loaded for today → follow it
        if (
            panchang &&
            panchang.date &&
            dateKey(panchang.date) === todayKey &&
            panchang.tithiEnglish
        ) {

            if (panchang.tithiEnglish === "Amavasya") {
                return MAHALAYA_TEXT;
            }

            if (panchang.pakshaEnglish === "Shukla") {
                return PUJA_TITHI[panchang.tithiEnglish] || null;
            }

            return null;
        }

        // Calendar Tithi not available → backup list
        const backup =
            BACKUP_DAYS.find(day => day.date === todayKey);

        return backup ? backup.text : null;
    }


    /* -------------------------------------------------
       UPDATE CAPSULE
    ------------------------------------------------- */

    function update() {

        const puja = getPujaText();

        let icon;
        let text;

        if (puja) {
            icon = "🪔";
            text = puja;
        } else {
            const greeting = getGreeting(getHour());
            icon = greeting.icon;
            text = greeting.text;
        }

        if (textEl.textContent !== text) {
            textEl.textContent = text;
        }

        if (iconEl && iconEl.textContent !== icon) {
            iconEl.textContent = icon;
        }

        if (capsule) {
            capsule.classList.toggle("is-puja-day", Boolean(puja));
        }
    }


    function start() {

        update();

        // Runs again as soon as the calendar finishes loading Tithi
        document.addEventListener(
            "sharodiya:calendar-panchang",
            update
        );

        setInterval(update, 60000);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start);
    } else {
        start();
    }

    window.Sharodiya = window.Sharodiya || {};
    window.Sharodiya.pujaCapsule = { update };

})();