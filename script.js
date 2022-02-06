window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 500;
    let canvasPosition = canvas.getBoundingClientRect();

    class GameArea {
        constructor(ctx, width, height, actionStatus){
            this.ctx = ctx;
            this.width = width;
            this.height = height;
            this.enemies = [];
            this.battle = [];
            this.actions = [];
            this.turnPosition = 0;
            this.maxPosition;
            this.battle.push(new Woodsman(this));
            this.battle.push(new GraveRobber(this));
            this.battle.push(new SteamMan(this));
            this.battle.push(new Boss(this));
            //this.actionStatus = 'idle';
        }

        assignTurn(){
            let i = 0;
            this.battle.forEach(object => {
                object.turnNumber = i;
                i++;
            });
        }

        setStatus(action){
            this.statusToSet = action;
            this.battle[this.turnPosition].setState(this.statusToSet);
            this.turnPosition += 1;
            console.log(this.turnPosition);
        }

        calculateActions(){
            this.battle.forEach(object => this.actions.push(object));
            this.maxPosition = this.actions.length;
        }
        update(deltaTime){
            // if(this.actionStatus === 'act' && this.turnPosition < this.maxPosition){
            //     this.battle.forEach(object => {if (object === this.actions[this.turnPosition]) {
            //         object.attack();
            //     }}); 
            // }
            this.turnPosition = (this.turnPosition % this.maxPosition);
            console.log(this.turnPosition);
            this.battle.forEach(object => {
                object.update(deltaTime);
                //discovered that you can run code to update the canvas and still assign values
            });
            //this.party.forEach(object => object.attack());
            //console.log(this.party[0].frameTimer)
            //do something
        }
        draw(){
            this.battle.forEach(object => object.draw(this.ctx));
        }
    }

    class Character {
        constructor(gameArea){
            this.gameArea = gameArea;
            this.turnNumber;
            this.frameX;
            this.maxFrame;
            this.frameInterval = 150;
            this.frameTimer = 0;
        }
        update(deltaTime){
            // this.turnNumber = this.gameArea.turnPosition;
            // if(this.turnPosition > this.gameArea.actions.length -1){
            //     this.turnPosition = 0;
            // }
            //console.log(this.gameArea.actionStatus);
            if(this.status === 'attack'){
                this.maxFrame = 5;
                this.image = this.images[1];
            } else if (this.status === 'defend') {
                //this.frameX = 3;
                this.maxFrame = 3;
                this.image = this.images[1];
            } else {
                this.maxFrame = 3;
                this.image = this.images[0];
            }
            //console.log(this.status);
            if (this.frameTimer > this.frameInterval){
                if (this.status === 'attack' && this.frameX === 5) {
                    this.status = 'idle';
                }
                if (this.status === 'defend' && this.turnNumber === this.gameArea.turnPosition) {this.status = 'idle';}
                if (this.frameX < this.maxFrame) this.frameX++
                //need another variable that tracks the actual turn, and takes the turn position % = that persons turn to act...
                else this.frameX = 0;
                this.frameTimer = 0;
               
            } else {
                this.frameTimer += deltaTime;
            }
        }
        draw(ctx){
            ctx.drawImage(this.image, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
        }
    }


    class Woodsman extends Character {
        constructor(gameArea) {
            super(gameArea);
            this.spriteWidth = 48;
            this.spriteHeight = 48;
            this.width = this.spriteWidth * 1.75;
            this.height = this.spriteHeight * 1.75;
            this.x = gameArea.width/4;
            this.y = gameArea.height/3;
            this.status = 'idle';
            this.images = [woodsman, woodsman2];
            this.image;
        }

        attack(){
            this.status = 'attack';  
        }

        setState(action){
            this.status = action;
        }
        // update(deltaTime){
        //     super.update(deltaTime);
        // }
        // draw(ctx){
        //     super.draw(ctx);
        // }
    }

    class GraveRobber extends Character {
        constructor(gameArea) {
            super(gameArea);
            this.spriteWidth = 48;
            this.spriteHeight = 48;
            this.width = this.spriteWidth * 1.75;
            this.height = this.spriteHeight * 1.75;
            this.x = gameArea.width/4;
            this.y = gameArea.height/2;
            this.status = 'idle';
            this.images = [woman, woman2];
            this.image;
        }

        attack(){
            this.status = 'attack';
        }
        setState(action){
            this.status = action;
        }
    }

    class SteamMan extends Character {
        constructor(gameArea) {
            super(gameArea);
            this.spriteWidth = 48;
            this.spriteHeight = 48;
            this.width = this.spriteWidth * 1.75;
            this.height = this.spriteHeight * 1.75;
            this.x = gameArea.width/4;
            this.y = gameArea.height/5;
            this.status = 'idle';
            this.images = [roboman, roboman2];
            this.image;
        }

        attack(){
            this.status = 'attack';
        }
        setState(action){
            this.status = action;
        }
    }

    class Boss extends Character {
        constructor(gameArea) {
            super(gameArea);
            this.spriteWidth = 72;
            this.spriteHeight = 72;
            this.width = this.spriteWidth * 3;
            this.height = this.spriteHeight * 3;
            this.x = gameArea.width/2;
            this.y = gameArea.height/6;
            this.status = 'idle';
            this.images = [boss, boss2];
            this.image;
        }

        attack(){
            this.status = 'attack';
        }
        setState(action){
            this.status = action;
        }
    }

    window.addEventListener('click', function(e){
        //console.log(e);
        let positionX = e.x - canvasPosition.left;
        let positionY = e.y - canvasPosition.top;
        if(positionX > 20 && positionY > canvas.height - 60 && positionX < 120 && positionY < canvas.height -10){
            // console.log(positionX);
            // console.log(positionY);
            // console.log('thats a hit');
            //gameArea.actionStatus = 'act';
            gameArea.setStatus('attack');
        }
        if(positionX > 130 && positionY > canvas.height - 60 && positionX < 230 && positionY < canvas.height - 10){
            gameArea.setStatus('defend');
        }
        //send state of current object that is acting
    });

    //function to draw the menu
    function drawMenu() {
        ctx.fillStyle = 'green';
        ctx.fillRect(20, canvas.height - 60, 100, 50);
        ctx.fillStyle = '#000A47';
        ctx.font = '25px serif';
        ctx.fillText('Attack', 35, canvas.height - 30);
        ctx.fillStyle = 'blue';
        ctx.fillRect( 130, canvas.height - 60, 100, 50);
        ctx.fillStyle='#fff';
        ctx.font = '25 px serif';
        ctx.fillText('Defend', 145, canvas.height - 30);
    }

    // function setAnimation(e){

    // }

    const gameArea = new GameArea(ctx, canvas.width, canvas.height);
    gameArea.calculateActions();
    gameArea.assignTurn();
    console.log(gameArea);
    let lastTime = 0;
    function animate(timeStamp){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        //console.log(deltaTime);
        //console.log(gameArea.actions); 
        gameArea.update(deltaTime);
        gameArea.draw();
        drawMenu();
        requestAnimationFrame(animate);
    }
    animate(0);
});



//to do, create a class method for characters that checks if it is time to act. done, maybe we can optimize this though.
//add a status for what action the character is taking and to track if it is their turn done, need to add more statuses such as item, def, etc.
//need to make sure status is retained until it is time to act again. (in some cases like defend)
//creat a method that reads the input for what to do if it is their turn to act (same as above need to refine)

//next step add 2 more party members and the enemy creature. done

//next step, add additional states (magic, def, item), give boss random attack pattern once it is their turn.
