	


	nodes = [];
	highlight = {x: -1, y:-1};
	topMonsters = {};	
	bottomMonsters = {};	
	mode = {action: "selection", turn:"bottom"};
	turnCount = 1;
	newMonsters = []
	turnInfo = {
		top: {
			"maximum energy" : 1,
			"energy" : 1
			
		},
		bottom: {
			"maximum energy" : 1,
			"energy" : 1
			
		}

	}
	
	sounds = {

	}

	fps = 60;
	lastTime = (new Date()).getTime();
	currentTime = 0;

	var c = document.getElementById("gameCanvas");

	c.width = c.clientWidth;
	c.height = c.clientHeight;
	var ctx = c.getContext("2d");
	dpi = window.devicePixelRatio;
//ctx.scale(-2,-2);
	



	function fixDpi() {


		let style_height = +getComputedStyle(c).getPropertyValue("height").slice(0, -2);
		//get CSS width
		let style_width = +getComputedStyle(c).getPropertyValue("width").slice(0, -2);
		//scale the canvas
		c.setAttribute('height', style_height * dpi);
		c.setAttribute('width', style_width * dpi);


	if (window.devicePixelRatio > 1) {
	    var canvasWidth = c.width;
	    var canvasHeight = c.height;

	  //  c.width = canvasWidth * window.devicePixelRatio;
	   // c.height = canvasHeight * window.devicePixelRatio;
	   // c.style.width = canvasWidth;
	   // c.style.height = canvasHeight;

	    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
	}

	}

//	c.oncontextmenu = (e) => e.preventDefault();
	c.addEventListener("mousemove", mouseMove, false);
	c.addEventListener("mouseup", mouseUp, false);
	window.addEventListener('keydown',keyDown,false);



	function keyDown(e) {
		e.preventDefault();
	    if(e.keyCode==32){
	    	endTurn();
	    }
	}


	function getSelectedNode(){
	//	console.log(highlight.x);
		id = nodes[highlight.y][highlight.x].id;
		if(nodes[highlight.y][highlight.x].name == "nothing") return {monster: new Nothing(), children:[],x:-1, y:-1,team:"none"};
		return findYourMonsterNode(id);
	}

	function getSelectedMonster(){
	//	console.log(highlight.x);
		return nodes[highlight.y][highlight.x];
	}

	function refresh(){

		links = [];
		createEmptyNodes();


		forNodesIn(topMonsters,(node)=>node.monster.abilities.forEach(abilityClass => {
			if(abilityClass.isPassive)new abilityClass(node.monster.id).effect();
		}));

		forNodesIn(bottomMonsters,(node)=>node.monster.abilities.forEach(abilityClass => {
			if(abilityClass.isPassive)new abilityClass(node.monster.id).effect();
		}));

		createNodesFromMonsters(topMonsters,"top");
	   	createNodesFromMonsters(bottomMonsters,"bottom");

	   	updateTurnInfo();
		paint();
	}

	function setTurn(turn){
		mode.turn = turn;
		select( getTeamMonsters());
		$("#TurnTitle").text(`${turn.charAt(0). toUpperCase() + turn.slice(1)}'s Turn`);
	}

	function playSound(file){
		if(!sounds[file].hasOwnProperty(file))sounds[file] = new Audio("/"+file+'.mp3');
		sounds[file].play();
	}
//ttaMncmar14$

	function forNodesIn(monster, callback){
		callback(monster);
		if(monster.children!=[]){
			for(i in monster.children){
				forNodesIn(monster.children[i],callback);
			}
		}
	}

	function findMonsterById(monster,id,path,items){
		//console.log(monster.monster.id)
		if(items==undefined)items = [];
		items = items.slice();
		items.push(monster);
		if(monster.monster.id==id){
			if(path==true)return items;
			return monster;
		}
		if(monster.children!=[]){
			for(i in monster.children){
				m = findMonsterById(monster.children[i],id,path,items);

				if(m!=undefined)return m;
			}
			
		}
	
	}

	function updateTurnInfo(){
		$("#TurnInfo").html("");
		for (i in turnInfo[mode.turn]){
			$("#TurnInfo").append(`<li style>${i} : ${turnInfo[mode.turn][i]}</li>`);
		}
	}

	function selectNode(action, message, select, callback){
	//	alert("action "+action);
		mode.action = action;
		mode.canSelect = select;
		mode.callback = callback;
		$("#actionText").text(message);
	}


	function select(node){
	
		if(node.monster.name == "nothing") return;

		if(node.team!=mode.turn){
			alert("You can't do that!");
			return;
		}

		selectedMonsterId = node.monster.id;
		monster = node.monster;

		$("#display").show();
		$("#title").html(`${monster.name}`);

		
		$("#evolutions").html("")
		if(monster.evolutions.length==0)$("#evolutions").html("<i>no evolutions</i>");
		for(i in monster.evolutions){
			$("#actionText").text("Select an Action");
			evolution = monster.evolutions[i];
			

			cost = evolution.cost;


			$("#evolutions").append(`<li onClick='evolve("${monster.id}", new ${evolution}())'>(${cost}) ${evolution.name}</li>`);
		}

		$("#abilities").html("");
		if(monster.abilities.length==0)$("#abilities").html("<i>no abilities</i>");
		for(i in monster.abilities){
			ability = monster.abilities[i];
			$("#abilities").append(`<li onClick='new ${ability.name}("${monster.id}").invoke()'>${ability.name}</li>`);
		}


		$("#effects").html("");
		if(monster.effects.length==0)$("#effects").html("<i>no effects</i>");
		for(i in monster.effects){
			effect = monster.effects[i];
			$("#effects").append(`<li onClick='describeEffect("${effect}")'>${effect}</li>`);
		}
	}


	function mouseUp(e){
		//console.log("up");
		if(mode.action == "selection"){
			select(getSelectedNode());
			playSound("click");
		}else {
			
			node = getSelectedNode();
			
			if(mode.canSelect(node)){
				//console.log(node);
				mode.callback(node);
			//	console.log(node)
				playSound("click");
				
			}else{
				alert("You can't do that!");
			}
		}
	}

	function beginSelection(){
		mode.action =  "selection";
		$("#actionText").text("Select an Action");
	}

	function mouseMove(e){

//		console.log(e.button);
		e.preventDefault();

    	var x = Math.floor((e.offsetX-20)/90);
    	var y = Math.floor((e.offsetY-20)/90);


        highlight = {x:x, y:y};


        //console.log(x+","+y);

	}

	function otherTeam(){
		return (mode.turn=="top") ? "bottom" : "top";
	}

	function getTeamMonsters(){
		return (mode.turn=="top") ? topMonsters : bottomMonsters;
	}


	function endTurn(){

		turnCount+=1;

		mode.action= "selection";
		

		for(i in newMonsters){
			newMonsters[i].removeEffect("Fatigue");
		}
	
		newMonsters = [];
		
		if(mode.turn == switchTurn){
			turnInfo.top["maximum energy"] += 1;
			turnInfo.top["energy"] = turnInfo.top["maximum energy"];
			turnInfo.bottom["maximum energy"] += 1;
			turnInfo.bottom["energy"] = turnInfo.bottom["maximum energy"];
			
		}

		if(turnCount==2){ 
			turnInfo[otherTeam()]["energy"]+=1;
			
		}

		forNodesIn(getTeamMonsters(),(node)=>node.monster.abilities.forEach(abilityClass => {
			if(abilityClass.isPassive){
				ability = new abilityClass(node.monster.id);
				ability.endTurnEffect();
			}
		}));
	


		setTurn(otherTeam());
		

		refresh();
		usedAbilities = [];
		
	}	


	function randInt(min, max) { // min and max included 
  		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	function findYourMonsterNode(id,path){

		a = findMonsterById(topMonsters,id,path)
		if(a == undefined){
			b = findMonsterById(bottomMonsters,id,path);
		  	if(b == undefined) return {monster: new Nothing(), children:[],x:-1, y:-1,team:"none"};
		  	return b;
		}else{
		
			return a;
		}
	}


	function evolve(monsterId, to){
	
		parent = findYourMonsterNode(monsterId);

		if(to.constructor.cost > turnInfo[mode.turn]["energy"]){
			alert("You don't have enough energy to do that!");
			return;
		}

		if(parent.children.length == 3){
			alert("Nodes can't have more than 3 children!");
			return;
		}

		selectNode("evolve",`Select ${to.name} Location`, node => node.monster.name == "nothing", (selection) => {

			parent.children.push({monster:to, x: highlight.x, y: highlight.y, children:[], team:mode.turn});
			newMonsters.push(to);

			turnInfo[mode.turn]["energy"] -= to.constructor.cost;


			refresh();
			to.onEvolved();
			//beginSelection();
			//select(findYourMonsterNode(to.id));
		});
		//`Select ${to.name} Location`

		//alert(to);
	}


	function createNodesFromMonsters(node, team){
	
		node.team = team;
		nodes[node.y][node.x] = node.monster;
		if(node.children!=[]){
			for(i in node.children){
				child = node.children[i];
				if(child.monster.health > 0) {
					links.push({n1:node, n2:child, team:team});
					createNodesFromMonsters(child,team);
				}else{
					node.children[i].monster.death();
					node.children.splice(i,1);
					refresh();
					break;
				}
			}
		}
		
	}

	function isTouching(r1,r2){
		return (r2.x < r1.x + r1.w && r2.x + r2.w > r1.x && r2.y < r1.y + r1.h && r2.y + r2.h > r1.y);
	}



