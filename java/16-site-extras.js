/* =====================================================
   SHARODIYA - LOGO, QR POPUP, INSTAGRAM POPUP
   Reads everything from 15-site-info.js
===================================================== */

(function (app) {

    "use strict";

    const info = app.info || {};

    function byId(id) {
        return document.getElementById(id);
    }

    /* -------------------------------------------------
       LOGO
    ------------------------------------------------- */

    (function setupLogo() {

        const box = byId("siteLogo");
        const img = byId("siteLogoImg");

        if (!box || !img) return;

        if (!info.logo) {
            box.hidden = true;
            return;
        }

        img.addEventListener("error", function () {
            box.hidden = true;
        }, { once: true });

        img.src = info.logo;

    })();


    /* -------------------------------------------------
       POPUP HELPER (open / close / Esc / click outside)
    ------------------------------------------------- */

    let openPopup = null;

    function focusables(root) {
        return Array.prototype.slice.call(
            root.querySelectorAll("a[href], button:not([disabled])")
        );
    }

    function closePopup() {

        if (!openPopup) return;

        const { overlay, trigger } = openPopup;

        overlay.classList.remove("show");
        overlay.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";

        openPopup = null;

        if (trigger) {
            trigger.setAttribute("aria-expanded", "false");
            trigger.focus();
        }
    }

    function showPopup(overlay, trigger) {

        // Only one popup at a time
        if (openPopup) {
            closePopup();
        }

        overlay.classList.add("show");
        overlay.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

        trigger.setAttribute("aria-expanded", "true");

        openPopup = { overlay, trigger };

        const close = overlay.querySelector("[data-close]");

        if (close) close.focus();
    }

    function connectPopup(trigger, overlay) {

        trigger.addEventListener("click", function () {
            showPopup(overlay, trigger);
        });

        // × button and a click outside the box
        overlay.addEventListener("click", function (event) {
            if (
                event.target === overlay ||
                event.target.closest("[data-close]")
            ) {
                closePopup();
            }
        });
    }

    document.addEventListener("keydown", function (event) {

        if (!openPopup) return;

        if (event.key === "Escape") {
            closePopup();
            return;
        }

        // Keep Tab inside the popup
        if (event.key === "Tab") {

            const items = focusables(openPopup.overlay);

            if (!items.length) return;

            const first = items[0];
            const last = items[items.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    });


    /* -------------------------------------------------
       QR CODE  (circle button + popup)
    ------------------------------------------------- */

    (function setupQr() {

        const button = byId("qrBtn");
        const overlay = byId("qrOverlay");
        const cfg = info.message;

        if (!button || !overlay || !cfg) return;

        if (!cfg.qr && !cfg.text) return;

        byId("qrTitle").textContent = cfg.label || "SCAN QR";
        byId("qrMessage").textContent = cfg.text || "";
        byId("qrFrom").textContent = cfg.from || "";

        const image = byId("qrImage");

        if (cfg.qr) {
            image.addEventListener("error", function () {
                image.hidden = true;
            }, { once: true });

            image.src = cfg.qr;
        } else {
            image.hidden = true;
        }

        button.hidden = false;

        connectPopup(button, overlay);

    })();


    /* -------------------------------------------------
       INSTAGRAM  (circle button + popup)
    ------------------------------------------------- */

    (function setupInstagram() {

        const button = byId("instaBtn");
        const overlay = byId("instaOverlay");
        const cfg = info.instagram;

        if (!button || !overlay || !cfg || !cfg.id) return;

        const id = String(cfg.id).trim();
        const handle = id.startsWith("@") ? id : "@" + id;
        const name = cfg.name || handle;

        byId("instaName").textContent = name;
        byId("instaId").textContent = handle;
        byId("instaMessage").textContent = cfg.message || "";
        byId("instaInitial").textContent =
            name.replace("@", "").charAt(0).toUpperCase();

        // Direct link: only accept a real https:// link,
        // otherwise build it from the Instagram ID.
        let link = String(cfg.link || "").trim();

        if (!/^https?:\/\//i.test(link)) {
            link =
                "https://www.instagram.com/" +
                encodeURIComponent(handle.replace("@", "")) +
                "/";
        }

        byId("instaLink").href = link;

        // Profile photo (falls back to the first letter)
        const photo = byId("instaPhoto");

        photo.hidden = true;

        if (cfg.photo) {
            photo.addEventListener("load", function () {
                photo.hidden = false;
            }, { once: true });

            photo.src = cfg.photo;
        }

        button.hidden = false;

        connectPopup(button, overlay);

    })();

})(window.Sharodiya);
