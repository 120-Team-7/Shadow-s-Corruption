class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }


    create() {
        this.keyStart = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.keyPause = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        this.sceneKey = 'playScene';
        currScene = this.sceneKey;

        this.spawnedEnemies = false;

        this.physics.world.debugGraphic.setAlpha(0);

        let playConfig = {
            fontFamily: 'Courier',
            fontSize: '30px',
            color: '#000000',
            backgroundColor: '#FFFFFF',
            align: 'center',
            padding: {
                top: 10,
                bottom: 10,
                left: 0,
                right: 0,
            },
            fixedWidth: screenWidth,
            wordWrap: {
                width: screenWidth,
                useAdvancedWrap: true,
            }
        }
        corruptionParticles = this.add.particles('corruptionParticle');
        corruptionParticles.setDepth(500);

        this.map = this.make.tilemap({key: "level"});

        // Define tiles used in map.
        const tileset = this.map.addTilesetImage("fornow",  "tiles", 32, 32,);

        // The map layers.
        
        this.floorLayer = this.map.createStaticLayer("Background",        tileset);
        this.sceneryLayer = this.map.createStaticLayer("Scenery",        tileset);
        this.wallsLayer = this.map.createStaticLayer("Walls",        tileset);

        this.physics.world.bounds.setTo(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.wallsLayer.setCollisionByProperty({collides: true});

        this.rooms = [];
        //this.currentRoom = 1;
        
        this.map.findObject('Objects', function(object) {

            // rooms
            if (object.type === 'Room') {
                this.rooms.push(object);
            }
            // spawn points
            if (object.type === 'Spawn') {
                if (object.name === 'Player') {
                    player = new Player(this, game.scene.keys.hudScene, object.x, object.y);
                }
            }
            if (object.type === 'Spawn') {
                if (object.name === 'Slime') {
                    //this.redEnemyGroup.addChaser(this.rSpawnX, this.rSpawnY, 'timed', this.redEnemyGroup, this.blueEnemyGroup);
                }
            }
        
        }, this);

        this.cameras.main.setBounds(this.rooms[player.currentRoom].x,
            this.rooms[player.currentRoom].y,
            this.rooms[player.currentRoom].width,
            this.rooms[player.currentRoom].height,
            true);

        // Initialize play objects ----------------------------------------------------------------------------------------------------

        // Pointer
        pointer = this.input.activePointer;

        // ColorGroup(scene, state)
        this.redGroup = new ObsColorGroup(this, 0);
        this.blueGroup = new ObsColorGroup(this, 1);

        // EnemyColorGroup(scene, state)
        this.redEnemyGroup = new EnemyColorGroup(this, 0);
        this.blueEnemyGroup = new EnemyColorGroup(this, 1);
        this.collideEnemyGroups = this.physics.add.collider(this.redEnemyGroup, this.blueEnemyGroup, null, function(red, blue) {
            if(red.stunned || blue.stunned) {
                return false;
            } else {
                return true;
            }
        }, this);

        // EnemyBulletGroup(scene, state)
        this.redEnemyBulletGroup = new EnemyBulletGroup(this, 0);
        this.blueEnemyBulletGroup = new EnemyBulletGroup(this, 1);

        // KnifeGroup(scene, state, redEnemyGroup)
        this.knifeGroup = new KnifeGroup(this, game.scene.keys.hudScene, 0, this.redEnemyGroup);
        // OrbGroup(scene, state, blueEnemyGroup)
        this.orbGroup = new OrbGroup(this, game.scene.keys.hudScene, 1, this.blueEnemyGroup);

        // Add play objects ----------------------------------------------------------------------------------------------------

    }

    update() {
        pointer = this.input.activePointer;
        player.update();
        this.knifeGroup.update();
        this.orbGroup.update();
        this.redEnemyGroup.update();
        this.blueEnemyGroup.update();
        this.redEnemyBulletGroup.update();
        this.blueEnemyBulletGroup.update();

        if (Phaser.Input.Keyboard.JustDown(this.keyStart) || Phaser.Input.Keyboard.JustDown(this.keyPause)) {
            if(!isGameOver) {
                console.log("pause play: " + currScene);
                isPaused = true;
                this.scene.pause(currScene);
                this.scene.pause('hudScene');
                this.scene.swapPosition('menuScene', currScene);
                this.scene.setVisible(false, 'hudScene');
                this.scene.run('menuScene');
                this.scene.setVisible(true, 'menuScene');
            }
        }
        if (player.roomChange) {
            this.spawnEnemies2();
            this.cameras.main.fadeOut(250, 0, 0, 0, function(camera, progress) {
            player.canMove = false;
            if (progress === 1) {
                // Change camera boundaries when fade out complete.
                this.cameras.main.setBounds(this.rooms[player.currentRoom].x,
                                            this.rooms[player.currentRoom].y,
                                            this.rooms[player.currentRoom].width,
                                            this.rooms[player.currentRoom].height,
                                            true);

                // Fade back in with new boundaries.
                this.cameras.main.fadeIn(500, 0, 0, 0, function(camera, progress) {
                    if (progress === 1) {
                        player.canMove = true;
                        //this.roomStart(player.currentRoom);
                        }
                    }, this);
                }
            }, this);
        }
    }
    
spawnEnemies() {
    let screenBuffer = 20;
    this.map.findObject('Objects', function(object) {
        if (object.type === 'Spawn') {
            if (object.name === 'Slime') {
                this.blueEnemyGroup.addShooter(object.x,object.y, 'timed', this.redEnemyGroup, this.blueEnemyGroup, this.redEnemyBulletGroup, this.blueEnemyBulletGroup);
                //this.redEnemyGroup.addChaser(object.x, object.y, 'timed', this.redEnemyGroup, this.blueEnemyGroup);
                this.physics.add.collider(this.redEnemyGroup,  this.wallsLayer);
                this.physics.add.collider(this.blueEnemyGroup,  this.wallsLayer);
            }
        }
        if (object.type === 'Spawn') {
            if (object.name === 'Slime2') {
                this.blueEnemyGroup.addShooter(object.x,object.y, 'timed', this.redEnemyGroup, this.blueEnemyGroup, this.redEnemyBulletGroup, this.blueEnemyBulletGroup);
                //this.redEnemyGroup.addChaser(object.x, object.y, 'timed', this.redEnemyGroup, this.blueEnemyGroup);
                this.physics.add.collider(this.redEnemyGroup,  this.wallsLayer);
                this.physics.add.collider(this.blueEnemyGroup,  this.wallsLayer);
            }
        }
    }, this);
}
//spawn enemies in room2
spawnEnemies2() { 
    let screenBuffer = 20;
    this.map.findObject('Objects', function(object) {
        if (object.type === 'Spawn2') {
            if (object.name === 'SlimeA') {
                this.blueEnemyGroup.addShooter(object.x,object.y, 'timed', this.redEnemyGroup, this.blueEnemyGroup, this.redEnemyBulletGroup, this.blueEnemyBulletGroup);
                //this.redEnemyGroup.addChaser(object.x, object.y, 'timed', this.redEnemyGroup, this.blueEnemyGroup);
                this.physics.add.collider(this.redEnemyGroup,  this.wallsLayer);
                this.physics.add.collider(this.blueEnemyGroup,  this.wallsLayer);
            }
        }
        if (object.type === 'Spawn2') {
            if (object.name === 'SlimeB') {
                //this.blueEnemyGroup.addShooter(object.x,object.y, 'timed', this.redEnemyGroup, this.blueEnemyGroup, this.redEnemyBulletGroup, this.blueEnemyBulletGroup);
                this.redEnemyGroup.addChaser(object.x, object.y, 'timed', this.redEnemyGroup, this.blueEnemyGroup);
                this.physics.add.collider(this.redEnemyGroup,  this.wallsLayer);
                this.physics.add.collider(this.blueEnemyGroup,  this.wallsLayer);
            }
        }
    
    }, this);
}   

    randSpawnEnemies() {
        let screenBuffer = 50;
        let randNum1 = Phaser.Math.Between(0, 1);
        let randNum2 = Phaser.Math.Between(0, 1);
        let randNum3 = Phaser.Math.Between(0, 1);
        let randNum4 = Phaser.Math.Between(0, 1);
        let randChange1 = Phaser.Math.Between(1, 3)
        let randChange2 = Phaser.Math.Between(1, 3);
        let randChange3 = Phaser.Math.Between(1, 3);
        let lX = 440;
        let rX = 1600;
        let tY = 1080;
        let bY = 1670;
        let cenY = 1080 + (1670 - 1080)/2
        if(randNum1 == 0) {
            this.rSpawnX = rX;
            this.bSpawnX = lX;
        } else {
            this.rSpawnX = lX;
            this.bSpawnX = rX;
        }
        if(randNum2 == 0) {
            this.rSpawnY = bY;
            this.bSpawnY = tY;
        } else {
            this.rSpawnY = tY;
            this.bSpawnY = bY;
        }
        if(randNum3 == 0){
            this.randSpawnX = rX;
        } else {
            this.randSpawnX = lX;
        }

        if(randNum4 == 0){
            if(randChange1 == 1) {
                // EnemyColorGroup.addShooter(spawnX, spawnY, changeCondition, redGroup, blueGroup, redBulletGroup, blueBulletGroup)
                this.redEnemyGroup.addShooter(this.randSpawnX, cenY, 'timer', this.redEnemyGroup, this.blueEnemyGroup, this.redEnemyBulletGroup, this.blueEnemyBulletGroup);
            } else if(randChange1 == 2){
                this.redEnemyGroup.addShooter(this.randSpawnX, cenY, 'damaged', this.redEnemyGroup, this.blueEnemyGroup, this.redEnemyBulletGroup, this.blueEnemyBulletGroup);
            } else if(randChange1 == 3) { 
                this.redEnemyGroup.addShooter(this.randSpawnX, cenY, 'mirror', this.redEnemyGroup, this.blueEnemyGroup, this.redEnemyBulletGroup, this.blueEnemyBulletGroup);
            }
        } else {
            if(randChange1 == 1) {
                this.blueEnemyGroup.addShooter(this.randSpawnX, cenY, 'timer', this.redEnemyGroup, this.blueEnemyGroup, this.redEnemyBulletGroup, this.blueEnemyBulletGroup);
            } else if(randChange1 == 2){
                this.blueEnemyGroup.addShooter(this.randSpawnX, cenY, 'damaged', this.redEnemyGroup, this.blueEnemyGroup, this.redEnemyBulletGroup, this.blueEnemyBulletGroup);
            } else if(randChange1 == 3) { 
                this.blueEnemyGroup.addShooter(this.randSpawnX, cenY, 'mirror', this.redEnemyGroup, this.blueEnemyGroup, this.redEnemyBulletGroup, this.blueEnemyBulletGroup);
            }
        }
        if(randChange2 == 1) {
            // EnemyColorGroup.addChaser(spawnX, spawnY, changeCondition, redGroup, blueGroup)
            this.redEnemyGroup.addChaser(this.rSpawnX, this.rSpawnY, 'timed', this.redEnemyGroup, this.blueEnemyGroup);
        } else if(randChange2 == 2) {
            this.redEnemyGroup.addChaser(this.rSpawnX, this.rSpawnY, 'damaged', this.redEnemyGroup, this.blueEnemyGroup);
        } else if(randChange2 == 3) {
            this.redEnemyGroup.addChaser(this.rSpawnX, this.rSpawnY, 'mirror', this.redEnemyGroup, this.blueEnemyGroup);
        }
        if(randChange3 == 1) {
            this.blueEnemyGroup.addChaser(this.bSpawnX, this.bSpawnY, 'timed', this.redEnemyGroup, this.blueEnemyGroup);
        } else if(randChange3 == 2) {
            this.blueEnemyGroup.addChaser(this.bSpawnX, this.bSpawnY, 'damaged', this.redEnemyGroup, this.blueEnemyGroup);
        } else if(randChange3 == 3) {
            this.blueEnemyGroup.addChaser(this.bSpawnX, this.bSpawnY, 'mirror', this.redEnemyGroup, this.blueEnemyGroup);
        }
    }
}