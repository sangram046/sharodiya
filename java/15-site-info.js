/* =====================================================
   SHARODIYA - SITE INFO  (EDIT THIS FILE)

   Everything you want to change is here:
   logo, QR code popup, Instagram popup and the
   Dhak music link.

   IMAGE PATHS
   Put your pictures in the  html/images/  folder and
   write the path like  "images/yourfile.png".
   The simplest way: replace the placeholder files
   logo.png, qr.png, profile.jpg with your own pictures
   using the SAME file names.
===================================================== */

window.Sharodiya = window.Sharodiya || {};

window.Sharodiya.info = {

    /* ---------- LOGO (top-left circle, beside the clock) ---------- */

    logo: "images/logo.png",


    /* ---------- QR CODE CIRCLE (top-right) ----------
       Click the QR circle → popup with the QR photo
       and your message at the bottom. */

    message: {
        label: "SCAN QR",          // small title at the top of the popup

        qr: "images/qr.png",       // QR photo. "" = no picture

        // Message shown at the bottom of the popup
        text: "শুভ শারদীয়া! 'sharodiya' যদি আপনার পুজোর আনন্দটাকে একটু আরও সুন্দর করে তোলে, তাহলে আর দেরি কেন? এক কাপ চা হাতে নিন, ঢাকের তালে মন ভাসিয়ে দিন—আর জমে উঠুক আমাদের পুজোর আড্ডা। মায়ের আগমনী সুরে আপনার পূজা আনন্দময় হোক।", 


        // Small line under the message (your name). "" = hidden
        from: "— Sangram "
    },


    /* ---------- INSTAGRAM CIRCLE (top-right) ----------
       Click the Instagram circle → popup with profile
       photo, name, ID, message and the direct link. */

    instagram: {
        name: "Sangram",              // shown in bold
        id: "@sangram1246",       // Instagram ID. "" = hide the circle
        photo: "images/profile.jpg",    // profile photo (shown round)

        // Message shown below the profile photo. "" = hidden
        message: "আমার সাথে Instagram-এ যুক্ত থাকুন!",

        // Direct link to your profile (must start with https://).
        // Leave "" and it is made from the ID automatically.
        link: "https://www.instagram.com/sangram1246?stkn=MXA2amF2dGJ4YTFjbQ=="
    },


    /* ---------- DHAK MUSIC (floating DHAK button) ---------- */

    dhak: {
        // Paste the YouTube link OR the 11-character video ID
        video: "LGCSJTL_gu8",

        // 0 - 100 (separate from the main player's volume)
        volume: 80
    }
};
