var game = new Phaser.Game(800,800,Phaser.AUTO);
var height = 800;
var width = 800;
var buttonDispX = 50;


date = new Date();



var tickCounter = 0 ;

var timeTickText = "00:00:00";

var petText = "...";

var time;


//---------------------------STATES---------------------------------------
var main = {
	preload: function(){
		
		
	},
	create: function(){
		//round pixels, so that pixel sprites remain sharp
		//this fixed a problem with the button sprite sheet
		game.renderer.renderSession.roundPixels = true;
		//Allows game to run in background
		game.stage.disableVisibilityChange = true;
		
		drawMainBody();
		//draw pet sprite
		petSprite = game.add.sprite(this.game.world.centerX,this.game.world.centerY,"petSheet");
		//change its "center point";
		petSprite.anchor.setTo(0.5);
		
		//adds a custom animation with name,frames wanted in sprite sheet, the fps, and if it wants to be looped.
		petSprite.animations.add("neutral",[0,1],2,true);
		petSprite.animations.add("sad",[2,3],2,true);
		petSprite.animations.add("dead",[4,5],2,true);
		petSprite.animations.add("happy",[6,7],2,true);
		petSprite.animations.add("angry",[8,9],2,true);
		counter = game.add.bitmapText(75, game.world.centerY-200,"pixel","tickCounter",32);
		timeTick = game.add.bitmapText(75, game.world.centerY-250,"pixel",timeTickText,28);
		petTextBox = game.add.bitmapText(75, game.world.centerY+150,"pixel",pet.name+":",12);
		petTextOut = game.add.bitmapText(75, game.world.centerY+200,"pixel","petText",18);
		petSprite.play("neutral");
		//add Sprites for ailments - conditions that can afflict the pet.
		sickSprite = game.add.sprite(petSprite.x+50,petSprite.y-50,"ailmentSheet");
		sickSprite.animations.add("sick",[2,3],2,true);
		sickSprite.anchor.setTo(0.5);
		sickSprite.scale.setTo(0.45);
		sickSprite.play("sick");
		
		//"poop" sprite. Can potentially create a "poop" object so that code is a bit more tidy, but since only 3 sprites are needed, code can be left as is.
			
		poopSprite0 = game.add.sprite(width*(3/4),height*((2+2)/7),"ailmentSheet");
		poopSprite0.scale.setTo(0.5);
		poopSprite0.anchor.setTo(0.5);
		poopSprite0.animations.add("poop",[0,1],2,true);
		poopSprite0.play("poop");
		
		poopSprite1 = game.add.sprite(width*(3/4),height*((2+1)/7),"ailmentSheet");
		poopSprite1.scale.setTo(0.5);
		poopSprite1.anchor.setTo(0.5);
		poopSprite1.animations.add("poop",[0,1],2,true);
		poopSprite1.play("poop");
		
		poopSprite2 = game.add.sprite(width*(3/4),height*((2+0)/7),"ailmentSheet");
		poopSprite2.scale.setTo(0.5);
		poopSprite2.anchor.setTo(0.5);
		poopSprite2.animations.add("poop",[0,1],2,true);
		poopSprite2.play("poop");
		
		poopArray=[poopSprite0,poopSprite1,poopSprite2];
	},
	
	update: function(){
		tickCheck();
		ailmentCheck();
		
		//play sprite animation according to mood
		petSprite.play(pet.mood);
        
        if(globalVal.counterEnabled){
            counter.text = tickCounter;
        }
        else{
            counter.text = "";
        }
	timeTick.text = (new Date()).toLocaleTimeString();
	petTextOut.text = petText;
		
		
		//now calculate pet mood
		if (pet.mood == "dead"){
			return;
		}
		if((pet.hunger>50)&&(pet.happiness>=60)){
			pet.mood = "happy";
		}
		else if((pet.hunger>=30)&&(pet.happiness<30)){
			pet.mood = "angry";
		}
		else if((pet.hunger<=0)&&(!globalVal.godMode)){
			pet.mood = "dead";
		}
		else if((pet.hunger<30)||(pet.sick)){
			pet.mood = "sad";
		}
		else{
			pet.mood = "neutral";
		}
		
		
	}
}

//State loads all most game assests. While this technically isnt needed as all states can preload
//the files are small enough that this preload will be very quick, and will prevent the game from
//flickering when states change.
var preload = {
	preload: function(){
		//loads an image can can be refenced as background
		this.load.image("background","assets/art/background.png");
		this.load.image("mainBackground","assets/art/mainBackground.png");
		//loads a sprite sheet and breaks the sheet up into 10, 128 x 128 sprites.
		this.load.spritesheet("petSheet","assets/art/pet/petSheet.png",128,128,10);
		this.load.spritesheet("foodSheet","assets/art/items/foodSheet.png",128,128,9);
		this.load.spritesheet("playSheet","assets/art/items/playSheet.png",128,128,12);
		this.load.spritesheet("saveSheet","assets/art/items/saveSheet.png",128,128,3);
		this.load.spritesheet("ailmentSheet","assets/art/pet/ailmentSheet.png",128,128,9);
		//loads button sprite sheet.
		this.load.spritesheet("buttonSheet","assets/art/buttonSheet.png",64,64,15);

		//loads a bitmapFont, which requires both a png as well as an XML file.
		this.load.bitmapFont("pixel","assets/font/pixelFont.png","assets/font/pixelFont.xml");
		
	},
	create: function(){
		loadStorage();
        //resetStorage();
		game.state.start("main");
	}
}
//-200+(32*4)
//var healthBarEmpty;

var stats = {
	preload: function(){	
	},
	create: function(){
		drawGameBody();
		pet.happiness = Math.min(Math.max(pet.happiness,0),100);
		pet.hunger = Math.min(Math.max(pet.hunger,0),100);
		text = game.add.bitmapText(75, game.world.centerY-200,"pixel","ERROR",32);

		
		
	},
	update: function(){
		tickCheck();
		text.text = "Name: " + pet.name + "\nAge:  "+ pet.age + "\nHunger: "+ pet.hunger+"\nHappiness: "+pet.happiness+ "\nMoney: $"+globalVal.money;
	}
}


var fastForward = {
	preload: function(){
	},
	create: function(){
		drawGameBody();
		tick();
		game.state.start("main");
	},
	update: function(){
	}
}

var toilet = {
	preload: function(){
	},
	create: function(){
		drawGameBody();
		pet.poop = 0;
		game.state.start("main");
	},
	update: function(){
	}
}

var medicine = {
	preload: function(){
	},
	create: function(){
		drawGameBody();
		pet.sick = false;
		game.state.start("main");
	},
	update: function(){	
	}
}

//---------------------------SUBSTATE FUNCTIONS---------------------------------------

//time per tick, in minutes
var TIME_PER_TICK = 0.5;
var timeBegin = 0;

//This function checks if the "real world clock" has advanced enough to increment the game a tick.
//The tick will alter the properties of the pet. 
function tickCheck(){
	var timeNow = (new Date()).getTime();
	//console.log("timeNow: "+timeNow);
	if (timeBegin == 0){
		timeBegin = (new Date()).getTime();
		//console.log("timeBegin: "+timeBegin);
	}
	if ((timeNow-timeBegin)>(TIME_PER_TICK*60*1000)){
		timeBegin = (new Date()).getTime();
		//console.log("timeBegin: "+timeBegin);
		tick();
	}
		 
}

function printText(contents){
	var text = game.add.bitmapText(75, game.world.centerY-200,"pixel",contents,32);
	//text.anchor.set(0.5);
}

function tick(){
	console.log(globalVal.ezMoney);
	if(globalVal.ezMoney){
		globalVal.money += 10;
	}
	tickCounter++;
	console.log("tick");
	petText = "...";
	pet.hunger = pet.hunger-3;
	pet.happiness = pet.happiness-2;
	
	//further decrease stats if pet is sick
	if(pet.sick){
		pet.hunger = pet.hunger-5;
		pet.happiness = pet.happiness-2;
	}

	//
	pet.happiness = Math.min(Math.max(pet.happiness,0),100);
	pet.hunger = Math.min(Math.max(pet.hunger,0),100);

	//if happiness is below 25, Glaze is bored and/or sad
	if(pet.happiness<25){
		petText = "I'm bored master, can we play?";
	}
	
	if(pet.hunger<25){
		petText = "I'm hungry master, can you feed me plz?";
	}
	
	//pet has a chance of pooping every tick
	if(globalVal.noToilet){
		//do nothing
	}
	else if(pet.hunger>90){
		if (Math.random()>0.70){
			//Actual pet bowel movements
			if (Math.random()>0.50){
				pet.poop++;
				if (Math.random()>0.50){
					petText = "~ah... that one felt good coming out";
				}
				else{
					petText = "*farts* I shitted a big turd master";
				}
			}
			//Playful fart relieving
			else if (Math.random()>0.50){
				if (Math.random()>0.50){
					petText = "*farts* ~tehe I farted next to you master";
				}
				else if (Math.random()>0.50){
					petText = "*farts a bassy wet one* ~ah, smell it master!";
				}
				else{
					petText = "*farts* ~tehe it really smells doesn't it master"
				}
			}
		} 
	}
	else if(pet.hunger<=85){
		//Actual pet bowel movements
		if (Math.random()>0.80){
			pet.poop++;
			if (Math.random()>0.50){
				petText = "hnngh ~ah... I shitted master";
			}
			else{
				petText = "*farts* I took a shit master";
			}
		}
	}
	pet.poop = Math.min(Math.max(pet.poop,0),3);
	//amount of poop alters probability of sickness
	if(Math.random()<(0.1*pet.poop)){
		//pet.sick = true;
	}
	
	if (pet.mood != "dead"){
		pet.age++;
	}
	console.log("Poop: "+pet.poop);
}

//turn ailment sprites "on" or "off" depending on the pets properties
function ailmentCheck(){
	for (var i=0; i<3; i++){
		//console.log(poopArray[i]);
		if (i<pet.poop){
			poopArray[i].alpha=1;
		}
		else{
			poopArray[i].alpha=0;
		}
	}
	if (pet.sick){
		sickSprite.alpha = 1;
	}
	else{
		sickSprite.alpha = 0;
	}
}

game.state.add("preload",preload);
game.state.add("main",main);
game.state.add("stats",stats);
game.state.add("fastForward",fastForward);
game.state.add("food",food);
game.state.add("toilet",toilet);
game.state.add("medicine",medicine);
game.state.add("play",play);
game.state.add("shop",shop);
game.state.add("shopItem",shopItem);
game.state.add("shopFood",shopFood);
game.state.add("save",save);
game.state.add("settings",settings);
game.state.start("preload");
