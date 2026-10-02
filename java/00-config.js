/* =====================================================
   SHARODIYA 1 - CONFIGURATION
===================================================== */

window.Sharodiya = window.Sharodiya || {};

window.Sharodiya.config = {

    playlists: {

        durga: {
            id: "PLVmI3X0zofqg",
            name: "দুর্গাপূজার গান",
            description: "দুর্গাপূজার জন্য নির্বাচিত গান।"
        },



        mahalayaSpecial: {
            id: "",
            name: "মহালয়া Special",
            description: "বিশেষ মহালয়া অনুষ্ঠান ও নির্বাচিত অডিও।"
        },

        mahalayaSongs: {
            id: "",
            name: "মহালয়ার গান",
            
        }
    },

    defaultArtist: "Sharodiya Music",

    get playlistId() {
        return this.playlists.durga.id;
    }
};

console.log("Sharodiya playlist configuration loaded.");
