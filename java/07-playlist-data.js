/* =====================================================
   SHARODIYA 1 - PLAYLIST DATA
===================================================== */

(function (app) {

    app.playlists = {

        durga: {
            description: "দুর্গাপূজার জন্য নির্বাচিত গান।"
        },

        

            mahalayaSpecial: {
            description: "বিশেষ মহালয়া অনুষ্ঠান।",

            // Custom thumbnail (leave "" to use the YouTube thumbnail)
            thumbnail: "",

            songs: [
                {
                    videoId: "a_KgtBWbKmM",
                    title: "Mahalaya Full",
                    artist: "Birendra Krishna Bhadra",
                    type: "full",
                    
                }
            ]
        },

        mahalayaSongs: {

           

            type: "custom-segments",

            videoId: "LOlyrK53QM4",

            thumbnail: "../html/images/backgrounds/b.png",

            songs: [
                { title: "Ya Chandi", start: 6 },
                { title: "Simhastha Sashisekhara", start: 103 },
                { title: "Bajlo Tomar Aalor Benu With Narration", start: 159 },
                { title: "Jago Durga Dashapraharanadharinee", start: 421 },
                { title: "Ogo Amar Agamani-alo", start: 528 },
                { title: "Tabo Achintya Rupa-charita-mahima", start: 727 },
                { title: "Aham Rudrebhirvasubhischara", start: 966 },
                { title: "Akhila-bimane Taba Jaya-gane", start: 1207 },
                { title: "Jayanati Mangala Kali", start: 1451 },
                { title: "Subhra Sankha-rabe", start: 1483 },
                { title: "Jatajutasamayuktamardhendukrita-sekharam", start: 1653 },
                { title: "Namo Chandi, Namo Chandi", start: 1920 },
                { title: "Ma Go Tabu Beene Sangeeta", start: 2105 },
                { title: "Bimane Bimane", start: 2318 },
                { title: "Jaya Jaya Japyajaye", start: 2499 },
                { title: "He Chinmoyi", start: 2651 },
                { title: "Amala-kirane Tribhubana-manoharini", start: 2827 },
                { title: "Jayanti Mangala Kali - Pankaj Kumar Mullick", start: 3072 },
                { title: "Santi Dile Bhari", start: 3491 }
            ]
        }
    };

})(window.Sharodiya);
