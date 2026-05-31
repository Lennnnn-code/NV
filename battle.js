const canvas = document.getElementById("game");

const ctx = canvas.getContext("2d");

ctx.imageSmoothingEnabled = true;

let groundY = 0;

let cameraX = 0;

function resizeCanvas(){
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
groundY = canvas.height - 200;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);



// HERO & STAGE
const hero = localStorage.getItem("hero");

const stage = localStorage.getItem("stage");

document.getElementById("heroName").innerText = hero;



// PLAYER
const player = {

    x:150,

    y:groundY,

    width:80,

    height:80,

    img:new Image(),

    speed:5,

    velocityY:0,

    gravity:0.5,

    jumpPower:-15,

    onGround:false,

    hp:100,

    direction:1,

    attacking:false

};

if(hero === "Miya"){
    player.img.src = "img/miya.png";
}

if(hero === "Nana"){
    player.img.src = "img/nana.png";
}

if(hero === "Badang"){
    player.img.src = "img/badang.png";
}

if(hero === "Ling"){
    player.img.src = "img/ling.png";
}

if(hero === "Angela"){
    player.img.src = "img/angela.png";
}

// ENEMY
const enemy = {

    x:800,

    y:groundY,

    width:80,

    height:80,

    img:new Image(),

    speed:2,

    hp:100,

    direction:-1,

    attacking:false

};

enemy.img.src = "img/buff.png";

let gameOver = false;
let winnerText = "";
// KEYBOARD
const keys = {};

window.focus();

document.addEventListener("keydown",(e)=>{

    keys[e.key] = true;

});

document.addEventListener("keyup",(e)=>{

    keys[e.key] = false;

});

function loadImage(img,src){
    return new Promise ((resolve,reject)=>{
        img.onload = ()=> resolve(img);
        img.onerror = ()=> reject("Gagal load: " + src);
        img.src = src;
    });
}


// MOBILE BUTTON
const leftBtn = document.getElementById("leftBtn");

const rightBtn = document.getElementById("rightBtn");

const jumpBtn = document.getElementById("jumpBtn");

const attackBtn = document.getElementById("attackBtn");

const backBtn = document.getElementById("backBtn");


// BACK BUTTON
backBtn.onclick = function(){

    window.location.href = "stage.html";

};


// MOBILE CONTROL
leftBtn.onpointerdown = ()=>{

    keys["a"] = true;

};

leftBtn.onpointerup = ()=>{

    keys["a"] = false;

};

leftBtn.onpointerleave = ()=>{

    keys ["a"] = false;

}

leftBtn.onpointercancel = ()=>{

    keys ["a"] = false;

}


rightBtn.onpointerdown = ()=>{

    keys["d"] = true;

};

rightBtn.onpointerup = ()=>{

    keys["d"] = false;

};

rightBtn.onpointerleave = ()=>{

    keys ["d"] = false;

}

rightBtn.onpointercancel = ()=>{

    keys ["d"]= false;

}


jumpBtn.onpointerdown = ()=>{

    if(player.onGround){

        player.velocityY = player.jumpPower;

        player.onGround = false;

    }

};


attackBtn.onpointerdown = ()=>{

    player.attacking = true;

    setTimeout(()=>{

        player.attacking = false;

    },200);

};

// MOVE PLAYER
function movePlayer(){

    if(keys["a"]){

        player.x -= player.speed;

        player.direction = -1;

    }

    if(keys["d"]){

        player.x += player.speed;

        player.direction = 1;

    }


    // GRAVITY
    player.velocityY += player.gravity;

    player.y += player.velocityY;


    // FLOOR
    if(player.y >= groundY){

        player.y = groundY;

        player.velocityY = 0;

        player.onGround = true;

    }

    cameraX = player.x - canvas.width / 4;

    if(cameraX < 0){
        cameraX = 0;
    }

    const maxCameraX = 1000;

    if(cameraX > maxCameraX){
        cameraX = maxCameraX;
    }

}


// ENEMY AI
function enemyAI(){

    if(enemy.x > player.x + 80){

        enemy.x -= enemy.speed;

        enemy.direction = -1;

    }

    if(enemy.x < player.x - 80){

        enemy.x += enemy.speed;

        enemy.direction = 1;

    }


    // ATTACK
    if(Math.abs(enemy.x - player.x) < 100){

        enemy.attacking = true;

    }else{

        enemy.attacking = false;

    }

}


// DAMAGE
function checkAttack(){


    // PLAYER HIT
    if(player.attacking){

        if(Math.abs(player.x - enemy.x) < 100){

            enemy.hp -= 1;

        }

    }


    // ENEMY HIT
    if(enemy.attacking){

        if(Math.abs(enemy.x - player.x) < 100){

            player.hp -= 0.3;

        }

    }


    // HP UPDATE
    document.getElementById("playerHp").style.width =
    player.hp + "%";


    document.getElementById("enemyHp").style.width =
    enemy.hp + "%";

    player.hp = Math.max(0, Math.min(100,player.hp));

    enemy.hp = Math.max(0, Math.min(100,enemy.hp));

}


// DRAW CHARACTER
function drawCharacter(character){

    if(!character.img.complete) return;

    ctx.drawImage(
        character.img,
        character.x - cameraX,
        character.y,
        character.width,
        character.height
    );
}

// WINNER
function checkWinner(){

    if(player.hp <= 0 && !gameOver){

        gameOver = true;

        winnerText = "Kalah";

        setTimeout(()=>{

            location.href = location.href + "?t=" + Date.now();

        },2000);

    }

    if(enemy.hp <= 0 && !gameOver){

        gameOver = true;

        winnerText = "Menang";

        setTimeout(()=>{

            location.href = location.href + "?t=" + Date.now();

        },2000);
    }

}

const bg = new Image();


if(stage === "Forest"){

    bg.src = "img/forest.jpg";

}

if(stage === "Castle"){

    bg.src = "img/castle.jpg";

}

if(stage === "Dungeon"){

    bg.src = "img/dungeon.jpg";

}

if(stage === "Night"){

    bg.src = "img/night.jpg";

}


function drawBackground(){

    if(bg.complete){

        let scale = Math.max(

            canvas.width / bg.width,

            canvas.height / bg.height

        );

        let width = bg.width * scale;

        let height = bg.height * scale;

        let x = (canvas.width - width) / 2 - cameraX * 0.3;

        let y = (canvas.height - height) / 2;

        ctx.drawImage(

            bg,
            x,
            y,
            width,
            height

        );

    }

}


// GAME LOOP
function gameLoop(){

    ctx.clearRect(

        0,

        0,

        canvas.width,

        canvas.height

    );


    drawBackground();

    if(!gameOver){

    movePlayer();

    enemyAI();

    checkAttack();

    }

    checkWinner();


    drawCharacter(player);

    drawCharacter(enemy);

    if(gameOver){

    ctx.save();

    ctx.fillStyle = "white";

    ctx.font = "bold 45px Arial";

    ctx.textAlign = "center";

    ctx.strokeStyle = "black";

    ctx.lineWidth = 8;

    ctx.strokeText(

        winnerText,

        canvas.width / 2,

        canvas.height / 2

    );

    ctx.fillText(

        winnerText,

        canvas.width / 2,

        canvas.height / 2

    );

    ctx.restore();

}


    requestAnimationFrame(gameLoop);

}

function loadImage(img,src){
    return new Promise((resolve,reject)=>{
        img.onload = ()=> resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

Promise.all([
    loadImage(player.img,player.img.src),
    loadImage(enemy.img,enemy.img.src),
    loadImage(bg,bg.src)
]).then(()=>{
    gameLoop();
})
.catch((err)=>{
    console.error("Load error:", err);
    gameLoop();
});