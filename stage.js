function selectStage(stage){

    // simpan stage yang dipilih
    localStorage.setItem("stage", stage);

    // pindah ke battle
    window.location.href = "battle.html";

}


// tombol back
const backBtn = document.getElementById("backBtn");

backBtn.onclick = function(){

    window.location.href = "index.html";

};