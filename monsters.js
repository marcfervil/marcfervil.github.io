	class Monster {
  		constructor(name, attack, health) {
    		this.name = name;
    		this.attack = attack;
    		this.health = health;
        this.evolutions = [];
        this.id = Math.random();
        this.abilities = [Attack];
        this.effects = ["Fatigue"];
        this.color = "#222222";
     //   this.firstTurn = true;
    	}

      damage(amount){
          this.overflow = amount;
          if(amount > this.health){
              this.overflow = this.health;
          }
          this.health -= amount;

          if(this.health < 0) this.health = 0;

          return this.overflow;
      }

      static get name(){
          return this.constructor.name;
      }

      onEvolved(){
          select(findYourMonsterNode(this.id));
          beginSelection();
      }

      hasEffect(effect){
          return this.effects.includes(effect);
      }

      addEffect(effect){
          if(!this.hasEffect(effect))this.effects.push(effect);
      }

      removeEffect(effect){
        //console.log("delete");
          this.effects.splice(this.effects.indexOf(effect),1);
      }

    	paint(x,y){
    		ctx.beginPath();
  			ctx.fillStyle = "#222222";

          this.color = "#222222";
        if(this.hasEffect("Fatigue"))this.color = "#BDA800FF";
        if(this.attack == 0 )this.color = "grey";
        if(this.hasEffect("Fortified"))this.color = "purple";

        ctx.strokeStyle = this.color;


      //  ctx.lineWidth = "6";
  			ctx.rect((20+(90*x)), (20+(90*y)), 80, 80);
  			ctx.stroke();


        ctx.fillStyle = "#222222";
  			ctx.font = "20px Helvetica";
  			//ctx.fillStyle = "red";
  			ctx.fillText(this.name, ((40+(90*x)))-(this.name.length), (20+(90*y)+45));

  			ctx.fillStyle = "green";
  			ctx.fillText(this.health, ((20+(90*x)+80))-(this.health.toString().length*20), (20+(90*y)+74));


  			ctx.fillStyle = "red";
  			ctx.fillText(this.attack, (25+(90*x)), (50+(90*y)+45));

    	}

      death(){
          this.abilities.forEach(abilityClass => {
           
              ability = new abilityClass(this.id);
              ability.uneffect();
            
          })
      }
  }

  	class Nothing extends Monster {
  		constructor() {
    		super("nothing",0,0);

    	}
  	}

  	class Egg extends Monster {
  		constructor() {
    	   super("Egg",0,10);
         this.evolutions = [Cat,Dog];
         this.effects = [];
    	}

      damage(amount){
        this.x = super.damage(amount);
       // if(this.health == 0) alert("The "+this.node.team+"team loses! "); 
        return this.x;
      }

      static get cost(){
          return 0;
      }

  	}

    class Coyote extends Monster {
      constructor() {
         super("Coyote",2,10);

         this.evolutions = [];
           this.abilities.push(Rabbies,InstaDeath);
      }

       static get cost(){
          return 2;
      }
    }


    class Toaster extends Monster {
      constructor() {
         super("Toaster",10,10);
       
         this.evolutions = [];
       //    this.abilities.push(Rabbies);
      }

       static get cost(){
          return 0;
      }
    }





    class Dog extends Monster {
      constructor() {
         super("Dog",2,1);
         this.evolutions = [Wolf,Fox,Rat,Coyote];
      }
       static get cost(){
          return 1;
      }
    }


    class Fox extends Monster {
      constructor() {
         super("Fox",2,2);
         this.evolutions = [];
         this.abilities.push(Boost)
      }
       static get cost(){
          return 2;
      }

       onEvolved(){
          select(findYourMonsterNode(this.id));
          new Boost(this.id).activate();
      }
    }


    class Wolf extends Monster {
      constructor() {
         super("Wolf",5,2);
         this.evolutions = [Bear];
      }

      static get cost(){
          return 2;
      }
    }


    class Bear extends Monster {
      constructor() {
         super("Bear",7,5);
         this.evolutions = [];
         this.abilities.push(DoubleAttack);
      }

      static get cost(){
          return 3;
      }
    }

    class Lynx extends Monster {
      constructor() {
         super("Lynx",2,3);
         this.evolutions = [];
         this.abilities.push(Fortify);
      }

       static get cost(){
          return 2;
      }

    }

    class Cat extends Monster {
      constructor() {
         super("Cat",1,2);
         this.evolutions = [Lynx,Lion];
      }

       static get cost(){
          return 1;
      }
    }

    class Lion extends Monster {
      constructor() {
         super("Lion",2,4);
         this.evolutions = [Tiger];
      }

       static get cost(){
          return 2;
      }
    }


    class Tiger extends Monster {
      constructor() {
         super("Tiger",2,7);
         this.evolutions = [];
         this.abilities.push(AttackSteal,Fortify);
      }

       static get cost(){
          return 3;
      }
    }


     class Rat extends Monster {
      constructor() {
         super("Rat",1,1);
        this.evolutions = [];
        this.abilities.push(Scavenge);
      }

       static get cost(){
          return 2;
      }
    }


     class Weasel extends Monster {
      constructor() {
          super("Weasel",1,1);
          this.evolutions = [];
          this.abilities.push(Scavenge);
      }

       static get cost(){
          return 3;
      }
    }


     class Bird extends Monster {
      constructor() {
          super("Bird",50,50);
          this.evolutions = [];
          this.abilities.push(Rabbies);
      }

       static get cost(){
          return 0;
      }
    }
 