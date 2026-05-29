const canvas = document.getElementById("game");

const ctx = canvas.getContext("2d");


canvas.width = window.innerWidth;

canvas.height = window.innerHeight;


// HERO & STAGE
const hero = localStorage.getItem("hero");

const stage = localStorage.getItem("stage");

document.getElementById("heroName").innerText = hero;



// PLAYER
const player = {

    x:150,

    y:400,

    width:140,

    height:180,

    img:new Image(),

    speed:5,

    velocityY:0,

    gravity:0.7,

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

    y:400,

    width:60,

    height:120,

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


rightBtn.onpointerdown = ()=>{

    keys["d"] = true;

};

rightBtn.onpointerup = ()=>{

    keys["d"] = false;

};


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
    if(player.y >= 400){

        player.y = 400;

        player.velocityY = 0;

        player.onGround = true;

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

}


// DRAW CHARACTER
function drawCharacter(character){

    if(character.img.complete){

        ctx.drawImage(

            character.img,
            character.x,
            character.y,
            character.width,
            character.height
        );
    }

}


// WINNER
function checkWinner(){

    if(player.hp <= 0 && !gameOver){

        gameOver = true;

        winnerText = "Kalah";

        setTimeout(()=>{

            location.reload();

        },2000);

    }

    if(enemy.hp <= 0 && !gameOver){

        gameOver = true;

        winnerText = "Menang";

        setTimeout(()=>{

            location.reload();

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

        ctx.drawImage(

            bg,
            0,
            o,
            canvas.width,
            canvas.height
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

    ctx.font = "bold 80px Arial";

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

document.body.addEventListener("touchstart", async ()=>{

    if(document.documentElement.requestFullscreen){

         await

        document.documentElement.requestFullscreen();

        screen.orientation.lock("landscape");
    }
});

gameLoop();