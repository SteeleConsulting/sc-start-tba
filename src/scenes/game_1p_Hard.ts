import Phaser, { Data } from "phaser";
import { sharedInstance as events } from "../helpers/eventCenter";    // this is the shared events emitter

export default class Game1PHard extends Phaser.Scene {

    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private spaceship?: Phaser.Physics.Matter.Sprite;
    private bossShip?: Phaser.Physics.Matter.Sprite;

    private spaceshipShield = 0;//how much shield ship has
    private shieldVis?:Phaser.Physics.Matter.Sprite;//display for shield
    private spaceshipZoom = 1;//stackable speed power up

    private upgraded: boolean = false;
    private bossHealth = 30;
    private bossDirection = false;//false means left, true means right

    private speed = 5;
    private normalSpeed = 5;
    private turboSpeed = 10;
    private shootSpeed = -15;
    private scrollSpeed = -1;
    private tickCounter = 0;

    private laserSound!: Phaser.Sound.BaseSound;
    private explosionSound!: Phaser.Sound.BaseSound;
    private powerupSound!: Phaser.Sound.BaseSound;
    private backgroundMusic!: Phaser.Sound.BaseSound;

    constructor() {
        super('1p_hard');
    }

    init() {
        this.cursors = this.input.keyboard.createCursorKeys();  // setup keyboard input

        // load the other scenes
        // this.scene.launch('start');
        //this.scene.launch('ui2');
        this.scene.launch('ui');
        this.scene.launch('gameover');
    }

    preload() {
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
        this.load.audio('neon', ['assets/sounds/neon-sky.mp3']);

    }

    create() {
        const { width, height } = this.scale;  // width and height of the scene

        // Add random stars background
        var bg = this.add.group({ key: 'star', frameQuantity: 3000 });
        var rect = new Phaser.Geom.Rectangle(0, 0, width, 6200);
        Phaser.Actions.RandomRectangle(bg.getChildren(), rect);

        this.createSpaceshipAnimations();
        this.createEnemyAnimations();

        // load tilemap with object locations
        const map = this.make.tilemap({ key: 'spacemap' });
        const objectsLayer = map.getObjectLayer('objects');
        objectsLayer.objects.forEach(obj => {
            const { x = 0, y = 0, name } = obj;   // get the coordinates and name of the object from the tile map
            console.log('adding object from tilemap at x:' + x + ' y:' + y + ' name:' + name);

            // find where the objects are in the tile map and add sprites accordingly by object name
            switch (name) {
                case 'spawn':
                    this.cameras.main.scrollY = y - 800;   // set camera to spaceship Y coordinates
                    this.spaceship = this.matter.add.sprite(x, y, 'space')
                        .play('spaceship-idle');
                    //makes invisible shield, will only appear if there is a shield
                    this.shieldVis = this.matter.add.sprite(x,y,'space','Effects/shield1.png');
                    this.shieldVis.visible = false;
                    this.shieldVis.setCollisionGroup(1); 
                    this.shieldVis.setCollidesWith(0);

                    // configure collision detection
                    this.spaceship.setOnCollide((data: MatterJS.ICollisionPair) => {
                        const spriteA = (data.bodyA as MatterJS.BodyType).gameObject as Phaser.Physics.Matter.Sprite
                        const spriteB = (data.bodyB as MatterJS.BodyType).gameObject as Phaser.Physics.Matter.Sprite

                        if (!spriteA?.getData || !spriteB?.getData)
                            return;
                        if (spriteB?.getData('type') == 'speedup') {
                            this.spaceshipZoom++;
                            console.log('Speed up! Speed is: ',this.spaceshipZoom);
                            spriteB.destroy();
                            setTimeout(() => {this.spaceshipZoom=1,console.log('Speed reverted')}, 5000);
                            
                            this.powerupSound.play();
                        }
                        if (spriteB?.getData('type') == 'shield') {
                            if(!this.shieldVis?.active)
                                return;
                            this.spaceshipShield++;
                            this.shieldVis.visible = true;
                            console.log('Shield health increase! Shield power: ', this.spaceshipShield);
                            spriteB.destroy();
                            this.powerupSound.play();
                        }
                        if (spriteB.getData('type') == 'pill') {
                            console.log('increase life!');
                            spriteB.destroy();
                            events.emit('life-up');
                            this.powerupSound.play();
                        }
                        if (spriteB?.getData('type') == 'enemy1' || spriteB?.getData('type') == 'enemy2' || spriteB?.getData('type') == 'enemy3') {
                            console.log('collided with enemy');
                            this.explosionSound.play();
                            if (this.spaceshipShield != 0) {
                                this.spaceshipShield--;
                                console.log('Shield took hit... Shield left: ', this.spaceshipShield);
                                if(this.spaceshipShield == 0){
                                    if(!this.shieldVis?.active)
                                        return;
                                    this.shieldVis.visible = false;
                                }
                            }
                            else{
                                events.emit('collide-enemy');
                            }
                        }
                        if (spriteB == this.bossShip) {
                            console.log('Collided with boss');
                            if (this.spaceshipShield != 0) {
                                this.spaceshipShield--;
                                console.log('Shield took hit... Shield left: ', this.spaceshipShield);
                                if(this.spaceshipShield == 0){
                                    if(!this.shieldVis?.active)
                                        return;
                                    this.shieldVis.visible = false;
                                }
                            }
                            else{
                                events.emit('collide-enemy');
                            }
                        }
                        if (spriteB?.getData('type') == 'asteroid') {
                            console.log('collided with asteroid');
                            if (this.spaceshipShield != 0) {
                                this.spaceshipShield--;
                                console.log('Shield took hit... Shield left: ', this.spaceshipShield);
                                if(this.spaceshipShield == 0){
                                    if(!this.shieldVis?.active)
                                        return;
                                    this.shieldVis.visible = false;
                                }
                            }
                            else{
                                events.emit('collide-enemy');
                            }
                            this.explosionSound.play();
                        }

                    });
                    break;

                case 'speedup':
                    const speedup = this.matter.add.sprite(x + 20, y, 'space', 'Power-ups/bolt_gold.png', {
                        isStatic: true,
                        isSensor: true
                    });
                    speedup.setBounce(1);
                    speedup.setData('type', 'speedup');
                    break;

                case 'powerup':
                    var result = Phaser.Math.Between(1, 3);

                    switch (result) {
                        case 3:
                            const shield = this.matter.add.sprite(x, y, 'space', "Power-ups/shield_silver.png", {
                                isStatic: true,
                                isSensor: true
                            });
                            shield.setData('type', 'shield');
                            break;
                        case 1:
                            const health = this.matter.add.sprite(x, y, 'space', 'Power-ups/pill_red.png', {
                                isStatic: true,
                                isSensor: true
                            });
                            health.setData('type', 'pill');
                            break;
                    }
                    break;

                case 'boss':
                    this.bossShip = this.matter.add.sprite(x + 300, y - 100, 'space', 'ufoYellow.png', {
                        isSensor: true,

                    });
                    this.bossShip.setDisplaySize(500, 500);

                    break;

            }
        });

        // Sounds are loaded into memory here
        this.powerupSound = this.sound.add('powerup');
        this.explosionSound = this.sound.add('explosion');
        this.laserSound = this.sound.add('laser');
        this.backgroundMusic = this.sound.add('neon');

        events.emit('timeUpdated', this.time.now);
    }

    update() {
        if (!this.spaceship?.active || !this.shieldVis?.active)   // This checks if the spaceship has been created yet
            return;

        /*This does the boss health check, uncomment only when level repetition is complete
        if(this.bossHealth <= 0){ //Checks to see if the boss is dead, if so, end level
            this.bossShip?.destroy();
            console.log('Level Complete!');
            return;
        }
        */
        //IF player reaches the boss section, it will run the boss phase and patterns
        if (this.cameras.main.scrollY <= 0 && this.bossHealth > 0) {
            //console.log("You have reached the final boss section" , this.tickCounter);
            if (!this.bossShip?.active)   // This checks if the bossShip has been created yet
                this.bossHealth = 0;
            //insert interval method for boss phase
            else if (this.tickCounter == 50 || this.tickCounter == 150) {
                //console.log("Boss shoots triple laser");
                this.createEnemyLaser(this.bossShip.x, this.bossShip.y + 250, -10, -this.turboSpeed, Math.PI);
                this.createEnemyLaser(this.bossShip.x, this.bossShip.y + 250, 0, -this.turboSpeed, Math.PI);
                this.createEnemyLaser(this.bossShip.x, this.bossShip.y + 250, 10, -this.turboSpeed, Math.PI);
                this.tickCounter++;
            }
            else if (this.tickCounter == 100) {
                //console.log("Boss shoots quad laser");
                this.createEnemyLaser(this.bossShip.x, this.bossShip.y + 250, -15, -this.turboSpeed, Math.PI);
                this.createEnemyLaser(this.bossShip.x, this.bossShip.y + 250, -5, -this.turboSpeed, Math.PI);
                this.createEnemyLaser(this.bossShip.x, this.bossShip.y + 250, 5, -this.turboSpeed, Math.PI);
                this.createEnemyLaser(this.bossShip.x, this.bossShip.y + 250, 15, -this.turboSpeed, Math.PI);
                this.tickCounter++;
            }
            else if (this.tickCounter == 200) {
                if (Math.floor(Math.random() * 2) == 1) {//summons left
                    //console.log("Throw asteroid from left");
                    this.throwAsteroid(0, Math.floor(Math.random()) * 500 + 550, 20);
                }
                else {//summons right
                    //console.log("Throw asteroid from right");
                    this.throwAsteroid(1500, Math.floor(Math.random() * 500) + 550, -20);
                }
                this.tickCounter = 0;
            }
            else {
                this.tickCounter++;
            }
            if (this.bossShip?.active) {
                this.bossMovement(this.bossShip.x, ((30 - this.bossHealth) / 3) * 2);
            }
        }

        // move camera up
        // this.cameras.main  //look here at how to adjust the camera view 
        if (this.cameras.main.scrollY >= 0) {
            var scrollDiff = this.cameras.main.scrollY // var to track scroll movement for ship
            this.cameras.main.scrollY = this.cameras.main.scrollY + this.scrollSpeed;
            scrollDiff -= this.cameras.main.scrollY
            //console.log(this.cameras.main.scrollY);//this is to debug the scroll
            this.spaceship.setY(this.spaceship.y - scrollDiff) // sync scroll speed with ship speed
        }
        // Emit the time event with the current time value
        //events.emit('timeUpdated', this.time.now);


        //------------------------------------------

        // handle keyboard input
        //spaceshipZoom is speed multiplier
        if (this.cursors.left.isDown) {
            this.spaceship.setVelocityX(-this.speed*this.spaceshipZoom);
            if (this.spaceship.x < 50) this.spaceship.setX(50);    // left boundry
            else this.cameras.main.scrollX = this.cameras.main.scrollX - 0.2
            this.spaceship.flipX = true;
        } else if (this.cursors.right.isDown) {
            this.spaceship.setVelocityX(this.speed*this.spaceshipZoom);
            if (this.spaceship.x > 1550) this.spaceship.setX(1550);    // right boundry 
            else this.cameras.main.scrollX = this.cameras.main.scrollX + 0.2
            this.spaceship.flipX = false;
        } else if (this.cursors.up.isDown) {
            this.spaceship.setVelocityY(-this.speed*this.spaceshipZoom)
            if (this.spaceship.y < this.cameras.main.scrollY + 110) this.spaceship.setY(this.cameras.main.scrollY + 110);
            this.spaceship.flipY = false;
        } else if (this.cursors.down.isDown) {
            this.spaceship.setVelocityY(this.speed*this.spaceshipZoom)
            if (this.spaceship.y > this.cameras.main.scrollY + 965) this.spaceship.setY(this.cameras.main.scrollY + 965);
            this.spaceship.flipY = false;
        } else {
            this.spaceship.setVelocityX(0);
            this.spaceship.setVelocityY(0);
        }
        //this is the shild sprite following the ship
        this.shieldVis.x = this.spaceship.x;
        this.shieldVis.y = this.spaceship.y;

        //create enemies on a random number check
        if (Math.random() * 100 > 99.4 && this.cameras.main.scrollY >= 0) {
            this.createEnemy(Math.random() * 1500, this.cameras.main.scrollY + 90);
        }

        //TODO: Add ability to hold down shift to attack continuously with a delay between shots
        //      And put a delay so shots are limited by shootSpeed variable for the sake of powerups
        const shiftJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.shift);   // this is to make sure it only happens once per key press
        if (this.cursors.shift.isDown && shiftJustPressed) {
            this.createLaser(this.spaceship.x, this.spaceship.y - 50, 0, this.shootSpeed, Math.PI);
        }

    }


    // create a laser sprite for friendly ships
    createLaser(x: number, y: number, xSpeed: number, ySpeed: number, radians: number = 0) {
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
                if ((spriteA?.getData('type') == 'enemy1')) {
                    events.emit('red-100');
                }
                if (spriteA?.getData('type') == 'enemy2') {
                    events.emit('green-50');

                } if (spriteA?.getData('type') == 'enemy3') {
                    events.emit('blue-150');
                }
                console.log('laser collided with enemy');
                spriteA.destroy();
                spriteB.destroy();
                this.explosionSound.play();

                events.emit('enemy-explode');

            }
            if (spriteA == this.bossShip) {
                this.bossHealth--;
                console.log("Boss health :", this.bossHealth);
                spriteB.destroy();
            }
            if (spriteA?.getData('type') == 'asteroid') {
                console.log('Asteroid blocked laser');
                spriteB.destroy();
            }

        });

        // destroy laser object after 500ms, otherwise lasers stay in memory and slow down the game
        setTimeout((laser) => laser.destroy(), 1000, laser);
    }

    //Creates enemy lasers that hurt the player
    createEnemyLaser(x: number, y: number, xSpeed: number, ySpeed: number, radians: number = 0) {
        //console.log("enemy laser shot");
        var laser = this.matter.add.sprite(x, y, 'space', 'Lasers/laserRed08.png', { isSensor: true });
        this.upgraded;
        laser.setData('type', 'laser');
        laser.setVelocityX(xSpeed);//add horizontal movement if wanted, for angle shots
        laser.setVelocityY(-ySpeed) // add laser vertical movement
        laser.setOnCollide((data: MatterJS.ICollisionPair) => {

            const spriteA = (data.bodyA as MatterJS.BodyType).gameObject as Phaser.Physics.Matter.Sprite
            const spriteB = (data.bodyB as MatterJS.BodyType).gameObject as Phaser.Physics.Matter.Sprite


            if (!spriteA?.getData || !spriteB?.getData)
                return;
            //detects all enemy types
            if (spriteA == this.spaceship) {
                console.log('enemy laser hit spaceship');
                //spriteA.destroy();
                spriteB.destroy();
                if (this.spaceshipShield != 0) {
                    this.spaceshipShield--;
                    console.log('Shield took hit... Shield left: ', this.spaceshipShield);
                    if(this.spaceshipShield == 0){
                        if(!this.shieldVis?.active)
                            return;
                        this.shieldVis.visible = false;
                    }
                }
                else{
                    events.emit('collide-enemy');
                }
                this.explosionSound.play();
                //events.emit('enemy-explode');
            }
            if (spriteA?.getData('type') == 'asteroid') {
                console.log('Asteroid blocked enemy laser');
                spriteB.destroy();
            }

        });

        // destroy laser object after 500ms, otherwise lasers stay in memory and slow down the game
        setTimeout((laser) => laser.destroy(), 1500, laser);
    }

    //Creates enemies to spawn on the map
    createEnemy(x: number, y: number) {
        var chance = '';
        var result = Math.floor(Math.random() * 3 + 1);
        console.log('Spawned ', result);
        switch (result) {
            case 3:
                chance = 'Enemies/enemyBlue3.png';
                break;
            case 2:
                chance = 'Enemies/enemyGreen2.png';
                break;
            default:
                chance = 'Enemies/enemyRed1.png';
        }
        var enemy = this.matter.add.sprite(x, y, 'space', chance, {
            isSensor: true
        });
        //sets enemy type to a specific type
        enemy.setData('type', ('enemy' + result));
        //sets behavior depending on time
        //below is behavior of blue enemy, zig zagging on screen
        if (enemy.getData('type') == 'enemy3') {
            var rem = 1;
            if (Math.floor(Math.random() * 2 + 1) == 2)
                rem = rem * -1;
            enemy.setVelocityX(this.normalSpeed * rem);
            enemy.setVelocityY(this.normalSpeed);
            setTimeout((enemy) => {
                rem = rem * -1,
                    enemy.setVelocityX(this.normalSpeed * rem),
                    enemy.setVelocityY(this.normalSpeed)
            }, 1500, enemy);
        }
        //below is the behavior of the red emeies, shooting lasers at player
        else if (enemy.getData('type') == 'enemy1') {
            this.createEnemyLaser(enemy.x, enemy.y - 50, 0, this.shootSpeed, Math.PI);
            setTimeout((enemy) => {
                this.createEnemyLaser(enemy.x, enemy.y - 50, 0, this.shootSpeed, Math.PI),
                    setTimeout((enemy) =>
                        this.createEnemyLaser(enemy.x, enemy.y - 50, 0, this.shootSpeed, Math.PI),
                        4000, enemy
                    );
            },
                4000, enemy
            );
        }
        //below is the behavior of the green enemies, zoom forward
        else {
            enemy.setVelocityY(this.turboSpeed);
        }

        //Destroys enemy object, enemies can live off screen, there will be a 10 second time to delete enemies
        setTimeout((enemy, enemy1, enemy2, enemy3) => enemy.destroy(), 14000, enemy);

    }
    //Throws asteroid in given spawn location and direction
    throwAsteroid(spawnX: number, spawnY: number, speed: number) {
        var asteroid = this.matter.add.sprite(spawnX, spawnY, 'space', 'Meteors/meteorGrey_big3.png', { isSensor: true });
        asteroid.setData('type', 'asteroid');
        asteroid.setVelocityX(speed);
        asteroid.setDisplaySize(200, 200);
        setTimeout((asteroid) => asteroid.destroy(), 3000, asteroid);
    }

    //this will tell the boss which direction to move and how fast
    bossMovement(x: number, xSpeed: number) {
        if (!this.bossShip?.active)   // This checks if the bossShip has been created yet
            return;
        //checks which dirrection to go to, false is left and true is right
        if (x >= 1250)
            this.bossDirection = false;
        if (x <= 250)
            this.bossDirection = true;
        if (this.bossDirection)
            this.bossShip.setVelocityX(xSpeed);
        else
            this.bossShip.setVelocityX(-xSpeed);
    }

    private createPowerupAnimations() {
        this.anims.create({
            key: ''
        })
    }

    private createSpaceshipAnimations() {
        this.anims.create({
            key: 'spaceship-idle',
            frames: [{ key: 'space', frame: 'playerShip1_blue.png' }]
        });
        this.anims.create({
            key: 'spaceship-explode',
            frameRate: 30,
            frames: this.anims.generateFrameNames('explosion', {
                start: 1,
                end: 16,
                prefix: 'explosion',
                suffix: '.png'
            }),
            repeat: 1
        });
    }

    private createEnemyAnimations() {
        this.anims.create({
            key: 'enemy-idle',
            frames: [{ key: 'space', frame: 'Enemies/enemyBlack1.png' }]
        });

        this.anims.create({
            key: 'enemy-explode',
            frameRate: 15,
            frames: this.anims.generateFrameNames('explosion', {
                start: 1,
                end: 16,
                prefix: 'explosion',
                suffix: '.png'
            }),
            repeat: 1
        });
    }
    getTime() {
        return this.sys.game.getTime();
        /*
        const currentTime = this.getTime();
        if(currentTime >0){
          key:'scoreCollected'
        }
        //console.log(currentTime);
        */
    }
}