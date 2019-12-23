usedAbilities = [];


class Ability{

	constructor(id){
		this.node = findYourMonsterNode(id);
		this.monster = this.node.monster;
	}


	static get isPassive(){
		return false;
    }

    static get isFatigueImmune(){
		return false;
    }



	invoke(){
		if(!this.constructor.isPassive){
			//check if 
			if(!usedAbilities.includes(JSON.stringify([this.constructor.name,this.monster.id]))){
				if(!this.monster.hasEffect("Fatigue") || this.constructor.isFatigueImmune){
					usedAbilities.push(JSON.stringify([this.constructor.name,this.monster.id]));
					this.effect();
				}else{
					alert ("Monsters cannot use abilities when they are Fatigued!");
				}
			}else{
				alert (this.constructor.name+" cannot be used more than once per turn!");
			}
		}else{
			alert(this.constructor.name+" is a passive ability!");
		}
	}



	effect(){

	}


	uneffect(){
	}

	endTurnEffect(){
	}

}

class Fortify extends Ability{


	constructor(id){
		super(id);
	}


	effect(){
		this.lowerNodes = findYourMonsterNode(this.monster.id,true);

		this.lowerNodes.forEach((node)=>{
			if(node.monster.id != this.monster.id)node.monster.addEffect("Fortified");
		});
	}

	uneffect(){

		this.lowerNodes = findYourMonsterNode(this.monster.id,true);

		this.lowerNodes.forEach((node)=>{
		//	console.log(node);
			if(node.monster.id != this.monster.id)node.monster.removeEffect("Fortified");
		});
	}

	static get isPassive(){
		return true;
    }

}


class Scavenge extends Ability{

	constructor(id){
		super(id);
	}

	
	static get isPassive(){
		return true;
    }


	effect(){
		if(!this.monster.hasEffect("Fatigue") ){
			if(!usedAbilities.includes(JSON.stringify([this.constructor.name,this.monster.id]))){
				usedAbilities.push(JSON.stringify([this.constructor.name,this.monster.id]));

				turnInfo[this.node.team]["energy"] += 1;
				console.log("used");
			}
		}
	}

}


class Attack extends Ability{

	constructor(id){
		super(id);
	}

	effect(){

		if(this.monster.attack > 0){
			selectNode("attack","Select a target", (node) => (node.team == otherTeam() && !node.monster.hasEffect("Fortified")), (selection) => { 

				this. x = selection.monster.damage(this.monster.attack);
				this.monster.attack -= this.x;
				refresh();
				beginSelection();
			});
		}else{
			alert("This monster has no attack!");
		} 
		
	}

	

}


class DoubleAttack extends Ability{

	constructor(id){
		super(id);
	}

	effect(){

		if(this.monster.attack > 0){
			selectNode("attack","Select a target", (node) => (node.team == otherTeam() && !node.monster.hasEffect("Fortified")), (selection) => { 

				this. x = selection.monster.damage(this.monster.attack);

				refresh();
				beginSelection();
			});
		}else{
			alert("This monster has no attack!");
		} 
		
	}

	 static get isFatigueImmune(){
		return true;
    }

}



class Rabbies extends Ability{

	constructor(id){
		super(id);
	}

	effect(){
		this.monster.removeEffect("Fatigued");	
	}
	

	static get isPassive(){
		return true;
    }

}



class AttackSteal extends Ability{

	constructor(id){
		super(id);
	}

	effect(){

		selectNode("AttackSteal","Select an enemy to steal from", (node) => (node.team == otherTeam() && node.monster.health > 0), (selection1) => { 
			selectNode("AttackSteal","Select an ally to boost", (node) => (node.team == mode.turn), (selection2) => { 
				selection1.monster.attack -= 1;
				selection2.monster.attack += 1;
				refresh();
				beginSelection();
			});
		});
		
	}

	 static get isFatigueImmune(){
		return true;
    }

}

class InstaDeath extends Ability{

	constructor(id){
		super(id);
	}

	endTurnEffect(){
		this.monster.health = 0 ;
		refresh();
	}


	static get isPassive(){
		return true;
    }

}


class Boost extends Ability{

	constructor(id){
		super(id);
	}

	effect(){
		alert("Boost can only be used once when this monster is evolved!")
	}

	activate(){

		selectNode("boost","Select an ally to boost", (node) => (node.team == mode.turn), (selection) => { 
			selection.monster.health += 5;
			refresh();
			beginSelection();
		});

	}

}

