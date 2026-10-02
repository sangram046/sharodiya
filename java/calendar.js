/* =====================================================
   SHARODIYA
   IOS STYLE BENGALI CALENDAR
   WEST BENGAL / KOLKATA
   BISUDDHA SIDDHANTA

   FEATURES
   -----------------------------------------------------
   ✓ Automatic English date
   ✓ Automatic English month/year
   ✓ Automatic Bengali date
   ✓ Automatic Bengali month
   ✓ Automatic Bengali year
   ✓ Automatic Bengali weekday
   ✓ Automatic Bengali Tithi
   ✓ Automatic Bengali Paksha
   ✓ Automatic monthly English calendar
   ✓ Today highlight
   ✓ Previous / Next month
   ✓ Bengali digits
   ✓ Kolkata / West Bengal
===================================================== */

(function () {

    "use strict";


    /* =====================================================
       CONFIGURATION
    ===================================================== */

    const LOCATION = {
        city: "kolkata"
    };


    /* =====================================================
       BENGALI MONTHS
    ===================================================== */

    const BENGALI_MONTHS = [
        "বৈশাখ",
        "জ্যৈষ্ঠ",
        "আষাঢ়",
        "শ্রাবণ",
        "ভাদ্র",
        "আশ্বিন",
        "কার্তিক",
        "অগ্রহায়ণ",
        "পৌষ",
        "মাঘ",
        "ফাল্গুন",
        "চৈত্র"
    ];


    /* =====================================================
       ENGLISH MONTHS
    ===================================================== */

    const ENGLISH_MONTHS = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];


    /* =====================================================
       BENGALI WEEKDAYS
    ===================================================== */

    const BENGALI_WEEKDAYS = [
        "রবিবার",
        "সোমবার",
        "মঙ্গলবার",
        "বুধবার",
        "বৃহস্পতিবার",
        "শুক্রবার",
        "শনিবার"
    ];


    /* =====================================================
       BENGALI DIGITS
    ===================================================== */

    function toBengaliNumber(value) {

        const english =
            "0123456789";

        const bengali =
            "০১২৩৪৫৬৭৮৯";

        return String(value)
            .split("")
            .map(character => {

                const index =
                    english.indexOf(character);

                return index >= 0
                    ? bengali[index]
                    : character;

            })
            .join("");
    }


    /* =====================================================
       BENGALI CALENDAR DATA

       WEST BENGAL
       BISUDDHA SIDDHANTA

       1433 BENGALI YEAR
       2026 - 2027
    ===================================================== */

    /*
       Each entry represents the FIRST DAY of a
       Bengali month.

       Example:

       2026-09-19 = ১ আশ্বিন ১৪৩৩

       Therefore:

       2026-09-27 = ৯ আশ্বিন ১৪৩৩
    */

    const BENGALI_MONTH_STARTS = [

        /* 1433 — Kolkata / West Bengal — Bisuddha Siddhanta */

        { date: "2026-04-15", monthIndex: 0, year: 1433 }, // 1 Boishakh
        { date: "2026-05-16", monthIndex: 1, year: 1433 }, // 1 Joishtho
        { date: "2026-06-16", monthIndex: 2, year: 1433 }, // 1 Asharh
        { date: "2026-07-18", monthIndex: 3, year: 1433 }, // 1 Shrabon
        { date: "2026-08-19", monthIndex: 4, year: 1433 }, // 1 Bhadro
        { date: "2026-09-19", monthIndex: 5, year: 1433 }, // 1 Ashwin
        { date: "2026-10-19", monthIndex: 6, year: 1433 }, // 1 Kartik
        { date: "2026-11-18", monthIndex: 7, year: 1433 }, // 1 Agrahayan
        { date: "2026-12-17", monthIndex: 8, year: 1433 }, // 1 Poush
        { date: "2027-01-16", monthIndex: 9, year: 1433 }, // 1 Magh
        { date: "2027-02-14", monthIndex: 10, year: 1433 }, // 1 Falgun
        { date: "2027-03-15", monthIndex: 11, year: 1433 }, // 1 Chaitra

        /* Next Bengali year */

        { date: "2027-04-14", monthIndex: 0, year: 1434 } // 1 Boishakh

    ];


    /* =====================================================
       DATE KEY
    ===================================================== */

    function getDateKey(date) {

        const year =
            date.getFullYear();

        const month =
            String(
                date.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                date.getDate()
            ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }


    /* =====================================================
       CREATE LOCAL DATE
    ===================================================== */

    function createLocalDate(dateString) {

        const parts =
            dateString.split("-");

        return new Date(
            Number(parts[0]),
            Number(parts[1]) - 1,
            Number(parts[2])
        );
    }


    /* =====================================================
       DATE DIFFERENCE
    ===================================================== */

    function getDaysDifference(
        startDate,
        endDate
    ) {

        const start =
            new Date(
                startDate.getFullYear(),
                startDate.getMonth(),
                startDate.getDate()
            );

        const end =
            new Date(
                endDate.getFullYear(),
                endDate.getMonth(),
                endDate.getDate()
            );

        const milliseconds =
            end.getTime() -
            start.getTime();

        return Math.round(
            milliseconds /
            (
                1000 *
                60 *
                60 *
                24
            )
        );
    }


    /* =====================================================
       GET BENGALI DATE
    ===================================================== */

    function getBengaliDate(date) {

        const currentKey =
            getDateKey(date);

        let selectedMonth =
            null;


        /*
           Find the latest Bengali month
           start which is <= current date.
        */

        for (
            let i = 0;
            i < BENGALI_MONTH_STARTS.length;
            i++
        ) {

            const item =
                BENGALI_MONTH_STARTS[i];

            if (
                item.date <= currentKey
            ) {

                selectedMonth =
                    item;

            } else {

                break;
            }
        }


        /*
           If no matching date is found,
           use a safe fallback.
        */

        if (!selectedMonth) {

            return {
                day: date.getDate(),
                month: BENGALI_MONTHS[0],
                monthIndex: 0,
                year: date.getFullYear() - 593
            };
        }


        const startDate =
            createLocalDate(
                selectedMonth.date
            );


        const difference =
            getDaysDifference(
                startDate,
                date
            );


        const bengaliDay =
            difference + 1;


        return {

            day:
                bengaliDay,

            month:
                BENGALI_MONTHS[
                    selectedMonth.monthIndex
                ],

            monthIndex:
                selectedMonth.monthIndex,

            year:
                selectedMonth.year
        };
    }


    /* =====================================================
       UPDATE TODAY INFORMATION
    ===================================================== */

    function updateToday(date) {

        const weekday =
            document.getElementById(
                "calendarWeekday"
            );

        const englishDay =
            document.getElementById(
                "englishDay"
            );

        const englishMonth =
            document.getElementById(
                "englishMonth"
            );

        const englishYear =
            document.getElementById(
                "englishYear"
            );

        const banglaFullDate =
            document.getElementById(
                "banglaFullDate"
            );

        const banglaMonth =
            document.getElementById(
                "calendarBanglaMonth"
            );


        /*
           Bengali date
        */

        const bengali =
            getBengaliDate(
                date
            );


        /*
           Bengali weekday
        */

        if (weekday) {

            weekday.textContent =
                BENGALI_WEEKDAYS[
                    date.getDay()
                ];
        }


        /*
           English day
        */

        if (englishDay) {

            englishDay.textContent =
                date.getDate();
        }


        /*
           English month
        */

        if (englishMonth) {

            englishMonth.textContent =
                ENGLISH_MONTHS[
                    date.getMonth()
                ];
        }


        /*
           English year
        */

        if (englishYear) {

            englishYear.textContent =
                date.getFullYear();
        }


        /*
           Bengali full date
        */

        if (banglaFullDate) {

            banglaFullDate.textContent =

                toBengaliNumber(
                    bengali.day
                ) +

                " " +

                bengali.month +

                " " +

                toBengaliNumber(
                    bengali.year
                );
        }


        /*
           Bengali month
        */

        if (banglaMonth) {

            banglaMonth.textContent =
                bengali.month;
        }
    }


    /* =====================================================
       BENGALI DATE FOR A GREGORIAN DAY
    ===================================================== */

    function getBengaliDateLabel(date) {

        const bengali =
            getBengaliDate(date);

        /*
           Calendar cells show only the Bengali day number.
           The Bengali month name is shown dynamically in
           the calendar header instead.
        */

        return toBengaliNumber(
            bengali.day
        );
    }


    /* =====================================================
       BENGALI MONTHS FOR CURRENT ENGLISH MONTH
    ===================================================== */

    function getBengaliMonthsForEnglishMonth(
        year,
        month
    ) {

        const daysInMonth =
            new Date(
                year,
                month + 1,
                0
            ).getDate();

        const seen =
            new Map();


        for (
            let day = 1;
            day <= daysInMonth;
            day++
        ) {

            const bengali =
                getBengaliDate(
                    new Date(
                        year,
                        month,
                        day
                    )
                );

            if (
                !seen.has(
                    bengali.month
                )
            ) {

                seen.set(
                    bengali.month,
                    bengali.year
                );
            }
        }


        return Array.from(
            seen.entries()
        ).map(
            ([monthName, bengaliYear]) => ({
                monthName,
                bengaliYear
            })
        );
    }


    /* =====================================================
       RENDER BENGALI MONTH HEADER
    ===================================================== */

    function renderBengaliMonthHeader(
        year,
        month
    ) {

        const element =
            document.getElementById(
                "calendarBanglaMonth"
            );

        if (!element) {
            return;
        }


        const months =
            getBengaliMonthsForEnglishMonth(
                year,
                month
            );

        if (!months.length) {

            element.textContent = "";

            return;
        }


        const monthNames =
            months.map(
                item => item.monthName
            );


        const years = [
            ...new Set(
                months.map(
                    item => item.bengaliYear
                )
            )
        ];


        element.textContent =
            monthNames.join(" • ") +
            " " +
            (
                years.length === 1

                    ? toBengaliNumber(
                        years[0]
                    )

                    : years
                        .map(
                            toBengaliNumber
                        )
                        .join("–")
            );
    }


    /* =====================================================
       RENDER ENGLISH MONTH CALENDAR
    ===================================================== */

    function renderCalendar(
        year,
        month
    ) {

        const grid =
            document.getElementById(
                "calendarGrid"
            );

        const monthTitle =
            document.getElementById(
                "calendarMonth"
            );

        const monthYear =
            document.getElementById(
                "calendarMonthYear"
            );


        if (!grid) {
            return;
        }


        /*
           Clear old calendar
        */

        grid.innerHTML = "";


        /*
           Month title
        */

        if (monthTitle) {

            monthTitle.textContent =
                ENGLISH_MONTHS[
                    month
                ];
        }


        /*
           Year
        */

        if (monthYear) {

            monthYear.textContent =
                year;
        }


        /*
           Bengali month
        */

        renderBengaliMonthHeader(
            year,
            month
        );


        /*
           First weekday of month
        */

        const firstDay =
            new Date(
                year,
                month,
                1
            ).getDay();


        /*
           Number of days
        */

        const daysInMonth =
            new Date(
                year,
                month + 1,
                0
            ).getDate();


        /*
           Current date
        */

        const today =
            new Date();


        /*
           Empty cells
        */

        for (
            let i = 0;
            i < firstDay;
            i++
        ) {

            const empty =
                document.createElement(
                    "span"
                );

            empty.className =
                "calendar-day empty";

            grid.appendChild(
                empty
            );
        }


        /*
           Calendar dates
        */

        for (
            let day = 1;
            day <= daysInMonth;
            day++
        ) {

            const cell =
                document.createElement(
                    "span"
                );

            cell.className =
                "calendar-day";


            /*
               English number
            */

            const englishNumber =
                document.createElement(
                    "span"
                );

            englishNumber.className =
                "calendar-day-number";

            englishNumber.textContent =
                day;


            /*
               Bengali number
            */

            const bengaliNumber =
                document.createElement(
                    "small"
                );

            bengaliNumber.className =
                "calendar-day-bengali";


            const cellDate =
                new Date(
                    year,
                    month,
                    day
                );


            bengaliNumber.textContent =
                getBengaliDateLabel(
                    cellDate
                );


            /*
               Full Bengali date
            */

            const fullBengaliDate =
                getBengaliDate(
                    cellDate
                );


            cell.title =
                `${day} ${ENGLISH_MONTHS[month]} ${year} — ` +
                `${toBengaliNumber(fullBengaliDate.day)} ` +
                `${fullBengaliDate.month} ` +
                `${toBengaliNumber(fullBengaliDate.year)}`;


            cell.setAttribute(
                "aria-label",
                cell.title
            );


            cell.appendChild(
                englishNumber
            );

            cell.appendChild(
                bengaliNumber
            );


            /*
               Today
            */

            if (

                day ===
                today.getDate()

                &&

                month ===
                today.getMonth()

                &&

                year ===
                today.getFullYear()

            ) {

                cell.classList.add(
                    "today"
                );
            }


            /*
               Weekend
            */

            const weekday =
                new Date(
                    year,
                    month,
                    day
                ).getDay();


            if (
                weekday === 0 ||
                weekday === 6
            ) {

                cell.classList.add(
                    "weekend"
                );
            }


            grid.appendChild(
                cell
            );
        }
    }


    /* =====================================================
       PREVIOUS MONTH
    ===================================================== */

    function previousMonth() {

        calendarViewMonth--;


        if (
            calendarViewMonth < 0
        ) {

            calendarViewMonth = 11;

            calendarViewYear--;
        }


        renderCalendar(
            calendarViewYear,
            calendarViewMonth
        );
    }


    /* =====================================================
       NEXT MONTH
    ===================================================== */

    function nextMonth() {

        calendarViewMonth++;


        if (
            calendarViewMonth > 11
        ) {

            calendarViewMonth = 0;

            calendarViewYear++;
        }


        renderCalendar(
            calendarViewYear,
            calendarViewMonth
        );
    }


    /* =====================================================
       TITHI / PAKSHA
    ===================================================== */

    async function updateTithi(
        date
    ) {

        const tithiElement =
            document.getElementById(
                "tithiName"
            );

        const pakshaElement =
            document.getElementById(
                "tithiPaksha"
            );


        if (
            !tithiElement ||
            !pakshaElement
        ) {

            return;
        }


        /* =================================================
           CREATE DATE
        ================================================= */

        const yyyy =
            date.getFullYear();

        const mm =
            String(
                date.getMonth() + 1
            ).padStart(
                2,
                "0"
            );

        const dd =
            String(
                date.getDate()
            ).padStart(
                2,
                "0"
            );


        const dateString =
            `${yyyy}-${mm}-${dd}`;


        try {

            /* =================================================
               PANCHANG API
            ================================================= */

            const api =
                "https://nityapanchangam.com/api/panchangam.php" +
                `?date=${dateString}` +
                `&city=${LOCATION.city}`;


            const response =
                await fetch(
                    api
                );


            if (
                !response.ok
            ) {

                throw new Error(
                    "Panchang request failed"
                );
            }


            const data =
                await response.json();


            /* =================================================
               GET RAW TITHI
            ================================================= */

            const rawTithi =
                data?.tithi?.name ||
                data?.tithi?.tithi ||
                data?.tithi?.title ||
                data?.tithi ||
                "";


            /*
               Convert everything to string safely.
            */

            const rawTithiString =
                String(
                    rawTithi
                ).trim();


            /*
               Example API values:

               Chaturthi (Krishna)
               Purnima
               Ekadashi (Shukla)
            */

            const parts =
                rawTithiString.split(
                    " ("
                );


            const tithiEnglish =
                (
                    parts[0] ||
                    ""
                ).trim();


            const pakshaEnglish =
                (
                    parts[1] ||
                    ""
                )
                .replace(
                    ")",
                    ""
                )
                .trim();


            /* =================================================
               BENGALI TITHI NAMES
            ================================================= */

            const TITHI_MAP = {

                "Pratipada":
                    "প্রতিপদ",

                "Pratipad":
                    "প্রতিপদ",

                "Dwitiya":
                    "দ্বিতীয়া",

                "Dvitiya":
                    "দ্বিতীয়া",

                "Tritiya":
                    "তৃতীয়া",

                "Chaturthi":
                    "চতুর্থী",

                "Panchami":
                    "পঞ্চমী",

                "Shashthi":
                    "ষষ্ঠী",

                "Shashti":
                    "ষষ্ঠী",

                "Saptami":
                    "সপ্তমী",

                "Ashtami":
                    "অষ্টমী",

                "Navami":
                    "নবমী",

                "Dashami":
                    "দশমী",

                "Ekadashi":
                    "একাদশী",

                "Dwadashi":
                    "দ্বাদশী",

                "Dvadasi":
                    "দ্বাদশী",

                "Trayodashi":
                    "ত্রয়োদশী",

                "Trayodasi":
                    "ত্রয়োদশী",

                "Chaturdashi":
                    "চতুর্দশী",

                "Purnima":
                    "পূর্ণিমা",

                "Purnima Tithi":
                    "পূর্ণিমা",

                "Amavasya":
                    "অমাবস্যা",

                "Amavasya Tithi":
                    "অমাবস্যা"
            };


            /* =================================================
               BENGALI PAKSHA
            ================================================= */

            const PAKSHA_MAP = {

                "Shukla":
                    "শুক্ল পক্ষ",

                "Shukla Paksha":
                    "শুক্ল পক্ষ",

                "Krishna":
                    "কৃষ্ণ পক্ষ",

                "Krishna Paksha":
                    "কৃষ্ণ পক্ষ"
            };


            /* =================================================
               NORMALIZE API TEXT
            ================================================= */

            const normalizedTithi =
                tithiEnglish
                    .replace(
                        /\s+/g,
                        " "
                    )
                    .trim();


            const normalizedPaksha =
                pakshaEnglish
                    .replace(
                        /\s+/g,
                        " "
                    )
                    .trim();


            /* =================================================
               FIND BENGALI TITHI
            ================================================= */

            let bengaliTithi =
                TITHI_MAP[
                    normalizedTithi
                ];


            /*
               If exact match fails,
               try partial match.
            */

            if (
                !bengaliTithi
            ) {

                const matchingTithi =
                    Object.keys(
                        TITHI_MAP
                    ).find(
                        key =>
                            normalizedTithi
                                .toLowerCase()
                                .includes(
                                    key.toLowerCase()
                                )
                    );


                if (
                    matchingTithi
                ) {

                    bengaliTithi =
                        TITHI_MAP[
                            matchingTithi
                        ];
                }
            }


            /* =================================================
               FIND BENGALI PAKSHA
            ================================================= */

            let bengaliPaksha =
                PAKSHA_MAP[
                    normalizedPaksha
                ];


            /*
               If exact match fails,
               try partial match.
            */

            if (
                !bengaliPaksha
            ) {

                const matchingPaksha =
                    Object.keys(
                        PAKSHA_MAP
                    ).find(
                        key =>
                            normalizedPaksha
                                .toLowerCase()
                                .includes(
                                    key.toLowerCase()
                                )
                    );


                if (
                    matchingPaksha
                ) {

                    bengaliPaksha =
                        PAKSHA_MAP[
                            matchingPaksha
                        ];
                }
            }


            /* =================================================
               SET BENGALI TITHI
            ================================================= */

            tithiElement.textContent =
                bengaliTithi ||
                "তিথি পাওয়া যায়নি";


            /* =================================================
               SET BENGALI PAKSHA
            ================================================= */

            pakshaElement.textContent =
                bengaliPaksha ||
                "পক্ষ পাওয়া যায়নি";


            /* =================================================
               SHARE PANCHANG DATA
               WITH STATUS CAPSULES
            ================================================= */

            const panchangDetail = {

                date:
                    new Date(
                        date.getTime()
                    ),

                tithiEnglish:
                    tithiEnglish,

                pakshaEnglish:
                    pakshaEnglish,

                tithiBengali:
                    bengaliTithi ||
                    "তিথি পাওয়া যায়নি",

                pakshaBengali:
                    bengaliPaksha ||
                    "পক্ষ পাওয়া যায়নি"
            };


            window.Sharodiya =
                window.Sharodiya ||
                {};


            window.Sharodiya.calendarPanchang =
                panchangDetail;


            document.dispatchEvent(
                new CustomEvent(
                    "sharodiya:calendar-panchang",
                    {
                        detail:
                            panchangDetail
                    }
                )
            );

        }

        catch (
            error
        ) {

            console.warn(
                "Tithi unavailable:",
                error
            );


            tithiElement.textContent =
                "তিথি পাওয়া যায়নি";


            pakshaElement.textContent =
                "—";
        }
    }


    /* =====================================================
       CALENDAR VIEW
    ===================================================== */

    let calendarViewDate =
        new Date();


    let calendarViewYear =
        calendarViewDate.getFullYear();


    let calendarViewMonth =
        calendarViewDate.getMonth();


    /* =====================================================
       MAIN UPDATE
    ===================================================== */

    async function updateCalendar() {

        const now =
            new Date();


        /*
           Update today's
           English + Bengali information
        */

        updateToday(
            now
        );


        /*
           Always show current
           English month initially.
        */

        renderCalendar(
            calendarViewYear,
            calendarViewMonth
        );


        /*
           Tithi
        */

        await updateTithi(
            now
        );
    }


    /* =====================================================
       INITIALIZATION
    ===================================================== */

    function initCalendar() {


        /*
           Initial calendar
        */

        updateCalendar();


        /*
           Previous button
        */

        const previousButton =
            document.getElementById(
                "calendarPrev"
            );


        if (
            previousButton
        ) {

            previousButton.addEventListener(
                "click",
                previousMonth
            );
        }


        /*
           Next button
        */

        const nextButton =
            document.getElementById(
                "calendarNext"
            );


        if (
            nextButton
        ) {

            nextButton.addEventListener(
                "click",
                nextMonth
            );
        }


        /*
           Refresh every minute
        */

        setInterval(
            updateCalendar,
            60 * 1000
        );
    }


    /* =====================================================
       START
    ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initCalendar
        );

    } else {

        initCalendar();
    }


})();