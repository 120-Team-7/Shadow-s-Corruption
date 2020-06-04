class Arena extends Phaser.Scene {
    constructor() {
        super('arenaScene');
    }

    create() {
        this.sceneKey = 'arenaScene';
        currScene = this.sceneKey;
        this.spawnedEnemies = false;
        this.currTime = 0;

        this.physics.world.debugGraphic.setAlpha(0);

        let playConfig = {
            fontFamily: 'Courier',
            fontSize: '40px',
            color: '#8B008B',
            stroke: '#000000',
            strokeThickness: strokeThickness,
            // backgroundColor: '#000000',
            align: 'center',
            padding: {
                top: 10,
                bottom: 10,
                left: 10,
                right: 10,
            },
            fixedWidth: screenWidth,
            wordWrap: {
                width: screenWidth,
                useAdvancedWrap: true,
            }
        }

        // Initialize play objects ----------------------------------------------------------------------------------------------------

        corruptionParticles = this.add.particles('corruptionParticle');
        corruptionParticles.setDepth(500);

        this.map = this.make.tilemap({key: "arenaTilemap", tileWidth: 32, tileHeight: 32 });

        // Define tiles used in map.
        this.tileset = this.map.addTilesetImage("fornow5",  "tiles", 32, 32,);

        // The map layers.
        
        this.floorLayer = this.map.createStaticLayer("Background", this.tileset);
        this.sceneryBottomLayer = this.map.createStaticLayer("SceneryBottom", this.tileset);
        // this.sceneryTopLayer = this.map.createStaticLayer("SceneryTop", this.tileset);
        this.wallsLayer = this.map.createStaticLayer("Walls", this.tileset);
        this.redWallsLayer = this.map.createStaticLayer("RedWalls", this.tileset)
        this.blueWallsLayer = this.map.createStaticLayer("BlueWalls", this.tileset)

        this.wallsLayer.setCollisionByProperty({collides: true});

        this.physics.world.bounds.setTo(0, 0, this.map.widthInPixels, this.map.heightInPixels);  

        this.rooms = [];
        //this.currentRoom = 1;
        
        this.map.findObject('Spawns', function(object) {
            if (object.name === 'Player') {
                player = new Player(this, game.scene.keys.hudScene, object.x, object.y);
            }
        }, this);

        // ColorGroup(scene, state)
        this.redGroup = new ObsColorGroup(this, 0);
        this.blueGroup = new ObsColorGroup(this, 1);

        this.map.findObject('ColorWalls', function(object) {
                if (object.name === 'Red') {
                    this.redGroup.addObstacle(object.x, object.y);
                }
                if (object.name === 'Blue') {
                    this.blueGroup.addObstacle(object.x, object.y);
                }
        }, this);

        // Pointer
        pointer = this.input.activePointer;

        // EnemyColorGroup(scene, state, obstacleGroup)
        this.redEnemyGroup = new EnemyColorGroup(this, 0, this.redGroup);
        this.blueEnemyGroup = new EnemyColorGroup(this, 1, this.blueGroup);
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
        
        // Tutorial text

        this.tutorialText = this.add.text(centerX, 0, 'SPACEBAR to start infinite enemy spawner', playConfig).setOrigin(0.5, 0);
        this.tutorialNum = 0;
        inTutorial = true;

        this.scene.run('hudScene');

        // Remove tutorial items and start infinite enemy spawner
        this.startSpawning = this.input.keyboard.on('keydown-SPACE', function () {
            if(!this.spawnedEnemies) {
                this.enemyCount = 0;
                this.timeElapsed = this.add.text(centerX + 200, 32, 'Time: 0', playConfig).setOrigin(0.5, 0);
                this.arenaClock = this.time.addEvent({
                    delay: 1000, 
                    callback: () => {
                        this.currTime ++;
                        this.timeElapsed.setText("Time: " + this.currTime);
                    }, 
                    callbackContext: this,
                    loop: true,
                });
                this.killCount = this.add.text(centerX - 200, 32, '', playConfig).setOrigin(0.5, 0);

                inTutorial = false;
                this.spawnedEnemies = true;
                this.tutorialText.destroy();
                this.damageTextTimer = this.time.delayedCall(500, () => {
                    this.redEnemyGroup.clear(true, true);
                    this.blueEnemyGroup.clear(true, true);
                    this.randSpawnEnemies();
                }, null, this);

                let lX = 0 + 50;
                let rX = screenWidth - 50;
                let tY = 100;
                let bY = screenHeight - 100;
                let cenY = centerY;
                this.portalLT = this.add.ellipse(lX, tY, 64, 64);
                this.portalLT.setFillStyle(black);
                this.portalRT = this.add.ellipse(rX, tY, 64, 64);
                this.portalRT.setFillStyle(black);
                this.portalLB = this.add.ellipse(lX, bY, 64, 64);
                this.portalLB.setFillStyle(black);
                this.portalRB = this.add.ellipse(rX, bY, 64, 64);
                this.portalRB.setFillStyle(black);

                this.portalLM = this.add.ellipse(lX, cenY, 64, 64);
                this.portalLM.setFillStyle(black);
                this.portalRM = this.add.ellipse(rX, cenY, 64, 64);
                this.portalRM.setFillStyle(black);
        
                this.portalSpawn = this.tweens.add({
                    targets: [ this.portalLT, this.portalRT, this.portalLB, this.portalRB , this.portalLM, this.portalRM ],
                    alpha: { from: 0.5, to: 1},
                    scale: { from: 1, to: 2},
                    ease: 'Quart.easeIn',
                    duration: 500,
                    yoyo: true,
                });
                this.portalWarp = this.tweens.add({
                    targets: [ this.portalLT, this.portalRT, this.portalLB, this.portalRB , this.portalLM, this.portalRM ],
                    scale: { from: 1, to: 0.75 },
                    ease: 'Quart.easeIn',
                    duration: 250,
                    yoyo: true,
                });
                this.portalWarping = this.time.addEvent({
                    delay: 250,
                    callback: () => {
                        if(!this.portalSpawn.isPlaying()) {
                            this.portalWarp.play();
                        }
                    },
                    callbackContext: this,
                    loop: true,
                });
                this.infiniteEnemySpawner = this.time.addEvent({
                    delay: infiniteSpawnerDelay,
                    callback: () => {
                        this.portalSpawn.play();
                        
                        this.randSpawnEnemies();
                        if(this.currTime >= 18*infiniteSpawnerDelay/1000) {
                            this.randSpawnEnemies();
                        }
                    },
                    callbackContext: this,
                    loop: true,
                });
            }
        }, this);

        this.input.keyboard.on('keydown-ZERO', function () {
            this.currTime = 180;
        }, this);
    }

    update() {
        if(this.spawnedEnemies) {
            this.killCount.setText("Kills: " + pStats.enemiesKilled);
        }
        pointer = this.input.activePointer;
        player.update();
        this.knifeGroup.update();
        this.orbGroup.update();
        this.redEnemyGroup.update();
        this.blueEnemyGroup.update();
        this.redEnemyBulletGroup.update();
        this.blueEnemyBulletGroup.update();

        if(!isPaused && this.spawnedEnemies) {
            this.arenaClock.paused = false;
        }
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
        let lX = 0 + 50;
        let rX = screenWidth - 50;
        let tY = 100;
        let bY = screenHeight - 100;
        let cenY = centerY;
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

        if(this.currTime >= 18*infiniteSpawnerDelay/1000){
            arenaMaxEnemies = 8;
        } else if(this.currTime >= 12*infiniteSpawnerDelay/1000){
            arenaMaxEnemies = 6;
        } else if(this.currTime >= 6*infiniteSpawnerDelay/1000){
            arenaMaxEnemies = 4;
        } else if(this.currTime >= 3*infiniteSpawnerDelay/1000){
            arenaMaxEnemies = 3;
        } else if(this.currTime >= 1*infiniteSpawnerDelay/1000){
            arenaMaxEnemies = 2;
        }

        if(this.currTime >= 5*infiniteSpawnerDelay/1000) {
            if(this.enemyCount - pStats.enemiesKilled < arenaMaxEnemies) {
                this.enemyCount++;
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
            }
        }
        
        if(this.enemyCount  - pStats.enemiesKilled < arenaMaxEnemies) {
            this.enemyCount++;
            if(randChange2 == 1) {
                // EnemyColorGroup.addChaser(spawnX, spawnY, changeCondition, redGroup, blueGroup)
                this.redEnemyGroup.addChaser(this.rSpawnX, this.rSpawnY, 'timed', this.redEnemyGroup, this.blueEnemyGroup);
            } else if(randChange2 == 2) {
                this.redEnemyGroup.addChaser(this.rSpawnX, this.rSpawnY, 'damaged', this.redEnemyGroup, this.blueEnemyGroup);
            } else if(randChange2 == 3) {
                this.redEnemyGroup.addChaser(this.rSpawnX, this.rSpawnY, 'mirror', this.redEnemyGroup, this.blueEnemyGroup);
            }
        }
        if(this.currTime >= 2*infiniteSpawnerDelay/1000) {
            if(this.enemyCount  - pStats.enemiesKilled < arenaMaxEnemies) {
                this.enemyCount++;
                if(randChange3 == 1) {
                    this.blueEnemyGroup.addChaser(this.bSpawnX, this.bSpawnY, 'timed', this.redEnemyGroup, this.blueEnemyGroup);
                } else if(randChange3 == 2) {
                    this.blueEnemyGroup.addChaser(this.bSpawnX, this.bSpawnY, 'damaged', this.redEnemyGroup, this.blueEnemyGroup);
                } else if(randChange3 == 3) {
                    this.blueEnemyGroup.addChaser(this.bSpawnX, this.bSpawnY, 'mirror', this.redEnemyGroup, this.blueEnemyGroup);
                }
            }
        }
    }
}