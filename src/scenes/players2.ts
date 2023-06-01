import Phaser, { Data } from "phaser";
import { sharedInstance as events } from "../helpers/eventCenter";    // this is the shared events emitter

export default class Players2 extends Phaser.Scene {

	private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private keys; 

    private spaceship?: Phaser.Physics.Matter.Sprite;
    private spaceship2?: Phaser.Physics.Matter.Sprite;
    private upgraded: boolean = false;

    private speed = 5;
    private normalSpeed = 5;
    private turboSpeed = 10;
    private shootSpeed = -15;
    private scrollSpeed = -1;

    private laserSound!: Phaser.Sound.BaseSound;
    private explosionSound!:  Phaser.Sound.BaseSound;
    private powerupSound!: Phaser.Sound.BaseSound;
    private backgroundMusic!: Phaser.Sound.BaseSound;

    constructor() {
        super('players2');
    }

    init() {
		this.cursors = this.input.keyboard.createCursorKeys();  // setup keyboard input
        

        // load the other scenes
        // this.scene.launch('start');
        this.scene.launch('ui');
        this.scene.launch('gameover');
    }

    preload(){
        
        this.load.image('star', 'assets/star2.png');
        this.load.image('boss', 'assets/boss.png');
        this.load.atlas('explosion', 'assets/explosion.png', 'assets/explosion.json');


        //this loads a whole tileset, check assets/space-shooter/space-shooter-tileset.json for individual image names
        this.load.atlas('space', 'assets/space-shooter/space-shooter-tileset.png', 'assets/space-shooter/space-shooter-tileset.json');  
        
        // this file has the start locations of all objects in the game
        this.load.tilemapTiledJSON('spacemap', 'assets/space-shooter-tilemap.json');

        this.load.audio('laser', ['assets/sounds/laser.wav']);
        this.load.audio('explosion', ['assets/sounds/explosion.mp3']);
        this.load.audio('powerup', ['assets/sounds/powerup.wav']);
        this.load.audio('pulsar', ['assets/sounds/pulsar-office.mp3']);

    }

    create(){
        this.keys = this.input.keyboard.addKeys('A,W,S,D');
        const { width, height } = this.scale;  // width and height of the scene

        // Add random stars background
        var bg = this.add.group({ key: 'star', frameQuantity: 3000  });
        var rect = new Phaser.Geom.Rectangle(0, 0, width, 6200);
        Phaser.Actions.RandomRectangle(bg.getChildren(), rect);

        this.createSpaceshipAnimations();
        this.createEnemyAnimations();

        // load tilemap with object locations
        const map = this.make.tilemap({key: 'spacemap'});
        const objectsLayer = map.getObjectLayer('objects');
        objectsLayer.objects.forEach(obj => {
            const {x=0, y=0, name} = obj;   // get the coordinates and name of the object from the tile map
            console.log('adding object from tilemap at x:'+x+' y:'+y+' name:'+name);

            // find where the objects are in the tile map and add sprites accordingly by object name
            switch(name){
                case 'spawn':
                    this.cameras.main.scrollY = y-800;   // set camera to spaceship Y coordinates
                    this.spaceship = this.matter.add.sprite(x + 700, y, 'space')
                        .play('spaceship-idle');
                    this.spaceship.setCollisionGroup(1); 
                    this.spaceship.setCollidesWith(0); 

                    // configure collision detection
                    this.spaceship.setOnCollide((data: MatterJS.ICollisionPair) => {
                        const spriteA = (data.bodyA as MatterJS.BodyType).gameObject as Phaser.Physics.Matter.Sprite
                        const spriteB = (data.bodyB as MatterJS.BodyType).gameObject as Phaser.Physics.Matter.Sprite

                        if (!spriteA?.getData || !spriteB?.getData)
                            return;
                        if (spriteA?.getData('type') == 'speedup') {
                            console.log('collided with speedup');
                            this.powerupSound.play();
                        }
                        if (spriteB?.getData('type') == 'speedup') {
                            console.log('collided with speedup');
                            this.powerupSound.play();
                        }
                        if (spriteA?.getData('type') == 'enemy') {
                            console.log('collided with enemy');
                            this.explosionSound.play();
                        }
                        if (spriteB?.getData('type') == 'enemy') {
                            console.log('collided with enemy');
                            this.explosionSound.play();
                        }
                        
                    });

                    this.spaceship2 = this.matter.add.sprite(x, y, 'space')
                        .play('spaceship-idle2');
                    this.spaceship2.setCollisionGroup(2); 
                    this.spaceship2.setCollidesWith(0)

                    // configure collision detection
                    this.spaceship2.setOnCollide((data: MatterJS.ICollisionPair) => {
                        const spriteA = (data.bodyA as MatterJS.BodyType).gameObject as Phaser.Physics.Matter.Sprite
                        const spriteB = (data.bodyB as MatterJS.BodyType).gameObject as Phaser.Physics.Matter.Sprite

                        if (!spriteA?.getData || !spriteB?.getData)
                            return;
                        if (spriteA?.getData('type') == 'speedup') {
                            console.log('collided with speedup');
                            this.powerupSound.play();
                        }
                        if (spriteB?.getData('type') == 'speedup') {
                            console.log('collided with speedup');
                            this.powerupSound.play();
                        }
                        if (spriteA?.getData('type') == 'enemy') {
                            console.log('collided with enemy');
                            this.explosionSound.play();
                        }
                        if (spriteB?.getData('type') == 'enemy') {
                            console.log('collided with enemy');
                            this.explosionSound.play();
                        }
                        
                    });
                    break;
                case 'speedup':
                    const speedup = this.matter.add.sprite(x, y, 'space', 'Power-ups/bolt_gold.png', {
                        isStatic: true,
                        isSensor: true
                    });
                    speedup.setBounce(1);
                    speedup.setData('type', 'speedup');
                    break;
                /*
                case 'enemy':
                    const enemy = this.matter.add.sprite(x,y,'space','Enemies/enemyRed2.png',{
                        isSensor:true
                    });
                    enemy.setData('type','enemy');
                    this.createEnemyAnimations();
                    break;
                */
            }
        });

        // Sounds are loaded into memory here
        this.powerupSound = this.sound.add('powerup');
        this.explosionSound = this.sound.add('explosion');
        this.laserSound = this.sound.add('laser'); 
        this.backgroundMusic = this.sound.add('pulsar');
        
    }

    update(){
        if (!this.spaceship?.active)   // This checks if the spaceship has been created yet
            return;

        if(!this.spaceship2?.active) 
            return;
        
        // move camera up
        // this.cameras.main  //look here at how to adjust the camera view 
        if(this.cameras.main.scrollY >= 0){
            var scrollDiff = this.cameras.main.scrollY // var to track scroll movement for ship
            this.cameras.main.scrollY = this.cameras.main.scrollY + this.scrollSpeed;
            scrollDiff -= this.cameras.main.scrollY 
            //console.log(this.cameras.main.scrollY);//this is to debug the scroll
            this.spaceship.setY(this.spaceship.y - scrollDiff) 
            this.spaceship2.setY(this.spaceship2.y - scrollDiff) // sync scroll speed with ship speed
        }
        // Emit the time event with the current time value
        //events.emit('timeUpdated', this.time.now);


        //------------------------------------------

        // handle keyboard input
        if (this.cursors.left.isDown){
            this.spaceship.setVelocityX(-this.speed);
            if (this.spaceship.x < 50) this.spaceship.setX(50);    // left boundry
            //else this.cameras.main.scrollX = this.cameras.main.scrollX - 0.2
            this.spaceship.flipX = true;
        } else if (this.cursors.right.isDown){
            this.spaceship.setVelocityX(this.speed);
            if (this.spaceship.x > 1550) this.spaceship.setX(1550);    // right boundry 
            //else this.cameras.main.scrollX = this.cameras.main.scrollX + 0.2
            this.spaceship.flipX = false;
        } else if (this.cursors.up.isDown){
            this.spaceship.setVelocityY(-this.speed)
            if (this.spaceship.y < this.cameras.main.scrollY + 110) this.spaceship.setY(this.cameras.main.scrollY + 110);
            this.spaceship.flipY = false;
        } else if (this.cursors.down.isDown){
            this.spaceship.setVelocityY(this.speed)
            if (this.spaceship.y > this.cameras.main.scrollY +  965) this.spaceship.setY(this.cameras.main.scrollY + 965);
            this.spaceship.flipY = false;
        } else{
            this.spaceship.setVelocityX(0);
            this.spaceship.setVelocityY(0);
        }

        if (this.keys.A.isDown){
            this.spaceship2.setVelocityX(-this.speed);
            if (this.spaceship2.x < 50) this.spaceship2.setX(50);    // left boundry
            //else this.cameras.main.scrollX = this.cameras.main.scrollX - 0.2
            this.spaceship2.flipX = true;
        } 
        else if (this.keys.D.isDown){
            this.spaceship2.setVelocityX(this.speed);
            if (this.spaceship2.x > 1550) this.spaceship2.setX(1550);    // right boundry 
            //else this.cameras.main.scrollX = this.cameras.main.scrollX + 0.2
            this.spaceship2.flipX = false;
        } 
        else if (this.keys.W.isDown){
            this.spaceship2.setVelocityY(-this.speed)
            if (this.spaceship2.y < this.cameras.main.scrollY + 110) this.spaceship2.setY(this.cameras.main.scrollY + 110);
            this.spaceship2.flipY = false;
        } 
        else if (this.keys.S.isDown){
            this.spaceship2.setVelocityY(this.speed)
            if (this.spaceship2.y > this.cameras.main.scrollY +  965) this.spaceship2.setY(this.cameras.main.scrollY + 965);
            this.spaceship2.flipY = false;
        } 
        else{
            this.spaceship2.setVelocityX(0);
            this.spaceship2.setVelocityY(0);
        }

        //create enemies on a random number check
        if(Math.random()*100 >99.4 ){
                this.createEnemy(Math.random()*1500,this.cameras.main.scrollY +90);
        }

        //TODO: Add ability to hold down shift to attack continuously with a delay between shots
        //      And put a delay so shots are limited by shootSpeed variable for the sake of powerups
        const shiftJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.shift);   // this is to make sure it only happens once per key press
        if(this.cursors.shift.isDown && shiftJustPressed ){
            this.createLaser(this.spaceship.x, this.spaceship.y - 50, 0, this.shootSpeed, Math.PI);
        }

        const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space);
        if(this.cursors.space.isDown && spaceJustPressed ){
            this.createLaser(this.spaceship2.x, this.spaceship2.y - 50, 0, this.shootSpeed, Math.PI);
        }
        
    }


    // create a laser sprite
    createLaser(x: number, y: number, xSpeed: number, ySpeed:number, radians:number = 0){
        var laser = this.matter.add.sprite(x, y, 'space', 'Lasers/laserGreen08.png', { isSensor: true });
        this.upgraded;
        laser.setData('type', 'laser');
        laser.setVelocityY(ySpeed) // add laser vertical movement
        laser.setOnCollide((data: MatterJS.ICollisionPair) => {
            
            const spriteA = (data.bodyA as MatterJS.BodyType).gameObject as Phaser.Physics.Matter.Sprite
            const spriteB = (data.bodyB as MatterJS.BodyType).gameObject as Phaser.Physics.Matter.Sprite
            

            if (!spriteA?.getData || !spriteB?.getData)
                return;
            //detects all enemy types
            if (spriteA?.getData('type') == 'enemy1' || spriteA?.getData('type') == 'enemy2' || spriteA?.getData('type') == 'enemy3') {
                console.log('laser collided with enemy');
                spriteA.destroy();
                spriteB.destroy();
                this.explosionSound.play();
                
                events.emit('enemy-explode');
                

            }

        });
        
        // destroy laser object after 500ms, otherwise lasers stay in memory and slow down the game
        setTimeout((laser) => laser.destroy(), 1000, laser);   
    }

    createEnemy(x:number,y:number){
        var chance = '';
        var result = Math.floor(Math.random()*3+1);
        console.log('Spawned ',result);
        switch(result){
        case 3:
            chance = 'Enemies/enemyBlue3.png';
            break;
        case 2:
            chance = 'Enemies/enemyGreen2.png';
            break;
        default:
            chance = 'Enemies/enemyRed1.png';
        }
        var enemy = this.matter.add.sprite(x,y,'space',chance,{
            isSensor:true
        });
        //sets enemy type to a specific type
        enemy.setData('type',('enemy'+result));
        //sets behavior depending on time
        //below is behavior of blue enemy, zig zagging on screen
        if(enemy.getData('type') == 'enemy3'){
            var rem = 1;
            if(Math.floor(Math.random()*2+1) == 2)
                rem = rem * -1;
            enemy.setVelocityX(this.normalSpeed*rem);
            enemy.setVelocityY(this.normalSpeed);
            setTimeout((enemy) => {
                rem = rem * -1,
                enemy.setVelocityX(this.normalSpeed*rem),
                enemy.setVelocityY(this.normalSpeed)
            }, 1500, enemy);
        }
        //below is the behavior of the red emeies, shooting lasers at player
        else if(enemy.getData('type') == 'enemy1'){

        }

        //Destroys enemy object, enemies can live off screen, there will be a 10 second time to delete enemies
        setTimeout((enemy, enemy1, enemy2, enemy3) => enemy.destroy(), 14000, enemy);
        
    }


    private createSpaceshipAnimations(){
        this.anims.create({
            key: 'spaceship-idle',
            frames: [{key:'space', frame: 'playerShip1_blue.png'}]
        });

        this.anims.create({
            key: 'spaceship-idle2',
            frames: [{key:'space', frame: 'playerShip1_red.png'}]
        });


        this.anims.create({
            key: 'spaceship-explode',
            frameRate: 30,
            frames: this.anims.generateFrameNames('explosion', {
                start: 1,
                end: 16,
                prefix: 'explosion',
                suffix: '.png'
            } ),
            repeat:1
        });
    }

    private createEnemyAnimations(){
        this.anims.create({
            key: 'enemy-idle',
            frames: [{key:'space', frame: 'Enemies/enemyBlack1.png'}]
        });

        this.anims.create({
            key: 'enemy-explode',
            frameRate: 15,
            frames: this.anims.generateFrameNames('explosion', {
                start: 1,
                end: 16,
                prefix: 'explosion',
                suffix: '.png'
            } ),
            repeat:1
        });
    }
    getTime() {
        return this.sys.game.getTime();
        const currentTime = this.getTime();
        if(currentTime >0){
          key:'scoreCollected'
        }
        //console.log(currentTime);
        
    }
}