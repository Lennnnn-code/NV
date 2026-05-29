function selectHero(heroName){

    // simpan hero yang dipilih
    localStorage.setItem("hero", heroName);

    // pindah ke stage
    window.location.href = "stage.html";

}