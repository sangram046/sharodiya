/* =====================================================
   SHARODIYA 1 - SEARCH & CATEGORY FILTER
===================================================== */

(function (app) {

    const categoryButtons = document.querySelectorAll(".category");
    const songCards = document.querySelectorAll(".song-card");
    const searchInput = document.getElementById("searchInput");
    const clearSearch = document.getElementById("clearSearch");
    const noResults = document.getElementById("noResults");

    function showNoResults(count) {
        if (noResults) {
            noResults.style.display = count === 0 ? "block" : "none";
        }
    }

    function filterByCategory(category) {
        let visibleSongs = 0;

        songCards.forEach(card => {
            const cardCategory = card.dataset.category;

            if (category === "all" || cardCategory === category) {
                card.style.display = "";
                visibleSongs++;
            } else {
                card.style.display = "none";
            }
        });

        showNoResults(visibleSongs);
    }

    categoryButtons.forEach(button => {
        button.addEventListener("click", () => {

            categoryButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");
            filterByCategory(button.dataset.category);
        });
    });

    function searchSongs() {
        const searchText = searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";

        let visibleSongs = 0;

        songCards.forEach(card => {

            const title = (
                card.dataset.title ||
                card.querySelector("h3")?.textContent ||
                ""
            ).toLowerCase();

            const category = (
                card.dataset.category || ""
            ).toLowerCase();

            if (
                title.includes(searchText) ||
                category.includes(searchText)
            ) {
                card.style.display = "";
                visibleSongs++;
            } else {
                card.style.display = "none";
            }
        });

        showNoResults(visibleSongs);
    }

    if (searchInput) {
        searchInput.addEventListener("input", searchSongs);
    }

    if (clearSearch) {
        clearSearch.addEventListener("click", () => {

            if (searchInput) {
                searchInput.value = "";
            }

            songCards.forEach(card => {
                card.style.display = "";
            });

            showNoResults(songCards.length);
        });
    }

    app.search = {
        filterByCategory,
        searchSongs
    };

})(window.Sharodiya);
