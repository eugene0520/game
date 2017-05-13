var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var KeysDown = {};
var bullet_list = [];
var monster_list = [];
var score = 0;
var pause = 0;
var hero = {  
	hp:100,
	speed:3,
	x:canvas.width / 2,
	y:canvas.height / 2,
	width:32,
	height:32,
 	draw : function () {
 		ctx.drawImage(heroImage,this.x,this.y);
 	},
 	attack : function () {
 		var bullet = {
			x:0,
			y:0,
			width:23,
			height:23,
			attack:5,
			dx:8,
			dy:0,
			from:"hero",
			draw : function () {
				ctx.drawImage(bulletImage,this.x,this.y);
	 		},
			move : function () {
				this.x+=this.dx;
				this.y+=this.dy;
			}

		};
		bullet.x = hero.x + hero.width;
		bullet.y = hero.y;
		bullet_list.push(bullet);
 	}
};
var addmonster = function () {
	var monster = {
  		img : monsterImage,
  		x:canvas.width / 2,
  		y:canvas.height / 2,
  		width : 38,
  		height : 46,
  		direction : Math.floor((Math.random() * (3 + 3)) - 3 ) ,
  		dx : Math.floor((Math.random() * 6) + 3) ,
  		dy : 0,
  		draw : function () {
  			ctx.drawImage(monsterImage,this.x,this.y);
  		},
  		move : function () {
  			this.x-=this.dx;
  			this.y-=this.direction;
  		},

	};
	monster.x=canvas.width;
	monster.y=Math.floor(Math.random()*(canvas.height - monster.height));
	monster_list.push(monster);
}

var dopause = function () {
  if(pause == 0){
  	pause=1;
  }else if(pause == 1){
  	pause=0;
  }
}

var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;
	hero.hp = 100;
	score = 0;
	monster_list = [];
	bullet_list = [];
};

var draw = function () {
	ctx.fillStyle = ctx.createPattern(bgImage,"repeat");
	ctx.fillRect (0, 0, canvas.width, canvas.height);
	hero.draw();
	for(var i = 0; i<bullet_list.length;i++){
		bullet_list[i].draw();
	};
  	for(var i = 0;i<monster_list.length;i++){
  		monster_list[i].draw(); 		
 	};
 	ctx.font = "24px Arial";
	ctx.fillStyle = "white"
	ctx.fillText("score:"+score, 10, 20);
	ctx.fillText("hp:"+hero.hp,10,44);            
};
var update = function () {
	if(hero.x<0){
		hero.x = canvas.width - hero.width;
	}
	if(hero.x+hero.width>canvas.width){
		hero.x=0;
	}
	if(hero.y<0){
		hero.y = canvas.height - hero.height;
	}
	if(hero.y+hero.height>canvas.height){
		hero.y=0;
	}
	for(var i = 0;i<bullet_list.length;i++){
		bullet_list[i].move();
		if (bullet_list[i].x+bullet_list[i].width>canvas.width) {
			bullet_list.splice(i,1);
			i--
		}
	}
	for(var i = 0;i<monster_list.length;i++){
		monster_list[i].move();
		if(monster_list[i].x+monster_list[i].width<0){
			monster_list.splice(i,1)
			i--;
		}
	}
	bulletCollision(bullet_list,monster_list,hero);
	monsterCollision(monster_list,hero);
};
var lastadd = Date.now();
var main = function () {
	if(hero.hp>0){
		if(pause == 0){
			keydown();
			if(Date.now()-lastadd>200){
				addmonster();
				lastadd = Date.now();
			}
			update();
		}
		draw();
	}else{
		ctx.font = "50px Arial";
		ctx.fillStyle = "white"
		ctx.fillText("Game over", 135, 200);
		ctx.fillText("your score is",80, 250);
		ctx.fillText( score , 380, 250)	;
	}
	requestAnimationFrame(main);
};


var lastattack = Date.now();
var keydown = function(){
	if(38 in KeysDown) {
		hero.y -= hero.speed ;
	}
	if(40 in KeysDown) {
		hero.y += hero.speed ;
	}
	if(37 in KeysDown) {
		hero.x -= hero.speed ;
	}
	if(39 in KeysDown) {
		hero.x += hero.speed ;
	}
	if(65 in KeysDown) {
		if(Date.now()-lastattack>400){
			hero.attack();
			lastattack = Date.now();	
		}
	}
}
var monsterCollision = function(monsters, hero) {
    for(var j=0;j<monsters.length;j++){
        if(!( monsters[j].x+monsters[j].width<= hero.x || monsters[j].x > hero.x+hero.width ||
            monsters[j].y+monsters[j].height <= hero.y || monsters[j].y > hero.y+hero.height)){
            monsters.splice(j, 1);
            j--;
            hero.hp-=10;
        }
    }
}
var bulletCollision = function(bullets, monsters, hero){
    for(var i=0;i<bullets.length;i++){
        if(bullets[i].from=="hero"){
            for(var j=0;j<monsters.length;j++){
                if(!( monsters[j].x+monsters[j].width<= bullets[i].x || monsters[j].x > bullets[i].x+bullets[i].width ||
                monsters[j].y+monsters[j].height <= bullets[i].y || monsters[j].y > bullets[i].y+bullets[i].height)){
                    bullets.splice(i, 1);
                    monsters.splice(j, 1);
                    i--;
                    j--;
                    score+=10;
                    break;
                }
            }
        }
        else if(bullets[i].from=="monster"){
            if(!( bullets[i].x+bullets[i].width<= hero.x || bullets[i].x > hero.x+hero.width ||
            bullets[i].y+bullets[i].height <= hero.y || bullets[i].y > hero.y+hero.height)){
                bullets.splice(i, 1);
                j--;
                hero.hp-=10;
            }
        }
    }
}
var bgImage = new Image();
bgImage.src = "img/background.png";
var heroImage = new Image();
heroImage.src = "img/hero.png";
var bulletImage = new Image();
bulletImage.src = "img/b1.png";
var monsterImage = new Image();
monsterImage.src = "img/monster.png";
main();

addEventListener("keydown", function (e) {
    KeysDown[e.keyCode] = true;
}, false);
addEventListener("keyup", function (e) {
    delete KeysDown[e.keyCode];
}, false);