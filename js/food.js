function foodItem(name,spriteIndex,cost,desc,hungRestore){
	this.mainText = name;
	this.descText = desc;
	this.spriteIndex = spriteIndex;
	this.cost = cost;
	this.hungRestore = hungRestore;
	this.select = function(mode) {
		console.log(mode);
		switch(mode){
			//purchasing from the store puts a foodItem instance into an inventory
			case "buy": 
				if (this.cost>globalVal.money){
					addTempText("INSUFFICIENT FUNDS",1);
					console.log("INSUFFICIENT FUNDS");
					return;
				}
				globalVal.money = globalVal.money-this.cost;
				console.log("push");
				invFoodArray.push(this);
				addTempText("Purchased!",1);
				//game.state.start("main");
			break;
			//Consumes an item
			case "use":
				if(pet.hunger>90){
					petText = "Too full from that human you fed me";
					game.state.start("main");
				}
				else{
					pet.hunger = pet.hunger+this.hungRestore;
					invFoodArray.splice(invFoodArray.indexOf(this), 1 );
					game.state.start("main");
				}
			break;
		}
		
	}
}
//
invFoodArray = [
	//Items to be added
	new foodItem("Young Human Boy",7,0,"Vore?",100),
	/* Upcoming Item Catalog
	new foodItem("Living Cow",1,20,"Cow go moo!\nCosts $20",110),
	new foodItem("???",2,0,"TBD",0),
	new foodItem("Living Sea Bass (Fish)",3,20,"Vore whole fish?",20),
	new foodItem("Adult Human Girl",4,0,"Vore? Moar Girl Meat",20),
	new foodItem("Adult Human Boy",5,0,"Vore? Moar Boi Meat!",150),
	new foodItem("Young Human Girl",6,0,"Vore?",100),
	new foodItem("Young Human Boy",7,0,"Vore?",100),
	new foodItem("Chicken",8,20,"Live chicken\nCosts $20",60)
	*/
];



var food = {
	preload: function(){
		
	},
	create: function(){
		//if (!invFoodArray){}
		drawGameBody();
		drawGameUI(invFoodArray,"foodSheet");
		costText.alpha = 0;
		button12.mode="use";
		
		if(!invFoodArray.length){
		button12.alpha = 0;
		button11.alpha = 0;
		button10.alpha = 0;
		sprite.alpha = 0;
		}
		/*
		//draw food sprite
		foodSprite = game.add.sprite(this.game.world.centerX,this.game.world.centerY,"foodSheet");
		//change its "center point";
		foodSprite.frame = 0;
		foodSprite.anchor.setTo(0.5);
		mainText = game.add.bitmapText(game.world.centerX, height*(1/4),"pixel","ERROR",32);
		mainText.anchor.setTo(0.5);
		foodText = game.add.bitmapText(game.world.centerX, height*(4/6),"pixel","ERROR",22);
		foodText.anchor.setTo(0.5);
		foodText.align = "center";
		*/
	},
	update: function(){
		if (!invFoodArray.length){

		}
		else{
			displaySlide(invFoodArray);
		}
		tickCheck();	
	}
}