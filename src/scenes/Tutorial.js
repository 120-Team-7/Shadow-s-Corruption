class Tutorial extends Phaser.Scene {
    constructor() {
        super('tutorialScene');
    }


    create() {
        this.keyStart = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.keyPause = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        this.sceneKey = 'tutorialScene';
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

        this.map = this.make.tilemap({key: "arenaTilemap", tileWidth: 32, tileHeight: 32 });

        // Define tiles used in map.
        this.tileset = this.map.addTilesetImage("fornow5",  "tiles", 32, 32,);

        // The map layers.
        
        this.floorLayer = this.map.createStaticLayer("Background", this.tileset);
        this.sceneryBottomLayer = this.map.createStaticLayer("SceneryBottom", this.tileset);
        this.sceneryTopLayer = this.map.createStaticLayer("SceneryTop", this.tileset);
        this.wallsLayer = this.map.createStaticLayer("Walls", this.tileset);
        this.redWallsLayer = this.map.createStaticLayer("RedWalls", this.tileset)
        this.blueWallsLayer = this.map.createStaticLayer("BlueWalls", this.tileset)

        this.wallsLayer.setCollisionByProperty({collides: true});


        // this.wallsLayer.destroy(false);
        // this.wallsLayer = this.map.createStaticLayer("Walls", this.tileset);

        // this.floorLayer.setPipeline('Light2D')
        // this.sceneryLayer.setPipeline('Light2D')
        // this.wallsLayer.setPipeline('Light2D')
        // this.light = this.lights.addLight(centerX, centerY, 200)
        // this.lights.enable().setAmbientColor(0x888888);
        // this.lights.addLight(centerX, centerY, 500).setColor(0xFFFFFF)

        this.physics.world.bounds.setTo(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        // this.wallsLayer.active = false;
        
        // this.redWallLayer.setCollisionByProperty({collides: true});



        // this.redWallLayer.active = false;
        // console.log(this.redWallLayer.state);

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


        // Initialize play objects ----------------------------------------------------------------------------------------------------

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

        this.tutorialText = this.add.text(centerX, 0, 'Press Y to continue with the tutorial or N to skip it and start infinite enemy spawner', playConfig).setOrigin(0.5, 0);
        this.tutorialNum = 0;
        inTutorial = true;

        this.input.keyboard.on('keydown-Y', function () {
            if(!this.scene.spawnedEnemies) {
                inTutorial = true;
                this.scene.tutorialNum++; 
                if(this.scene.tutorialNum == 1) {
                    this.scene.tutorialText.setText("Press SHIFT to change your color state between RED and BLUE. (Y)");
                }
                if(this.scene.tutorialNum == 2) {
                    this.scene.tutorialText.setText("When you are BLUE, RED objects cannot collide with you, but BLUE objects can collide with you.(Y)");
                }
                if(this.scene.tutorialNum == 3) {
                    this.scene.tutorialText.setText("RED collides with RED, BLUE collides with BLUE, and OPPOSITES pass through. Notice that SHIFTING has a cooldown. (Y)");
                }
                if(this.scene.tutorialNum == 4) {
                    this.scene.tutorialText.setText("While your body is RED, you have the RED KNIFE equppied. Use the MOUSE to aim and use LEFT MOUSE BUTTON to rapidly shoot them. (Y)");
                }
                if(this.scene.tutorialNum == 5) {
                    this.scene.tutorialText.setText("While you are not shooting, your weapon is in IDLE form. The IDLE KNIFE stuns and deals extra damage. (Y)");
                    this.scene.rDummy1 = this.scene.redEnemyGroup.addDummy(centerX - 50, centerY + 100, this.scene.redEnemyGroup, this.scene.blueEnemyGroup, this.scene.redEnemyBulletGroup, this.scene.blueEnemyBulletGroup, false, false, 0, 0);
                    this.scene.rDummy2 = this.scene.redEnemyGroup.addDummy(centerX - 50, centerY - 100, this.scene.redEnemyGroup, this.scene.blueEnemyGroup, this.scene.redEnemyBulletGroup, this.scene.blueEnemyBulletGroup, false, false, 0, 0);
                }
                if(this.scene.tutorialNum == 6) {
                    this.scene.tutorialText.setText("While your body is BLUE, you have the BLUE ORB equppied. After shooting, it accelerates and pierces enemies. (Y)");
                }
                if(this.scene.tutorialNum == 7) {
                    this.scene.tutorialText.setText("The IDLE ORB knocksback and stuns enemies. (Y)");
                    this.scene.bDummy1 = this.scene.blueEnemyGroup.addDummy(centerX + 50, centerY + 100, this.scene.redEnemyGroup, this.scene.blueEnemyGroup, this.scene.redEnemyBulletGroup, this.scene.blueEnemyBulletGroup, true, false, 0, 0);
                    this.scene.bDummy2 = this.scene.blueEnemyGroup.addDummy(centerX + 50, centerY - 100, this.scene.redEnemyGroup, this.scene.blueEnemyGroup, this.scene.redEnemyBulletGroup, this.scene.blueEnemyBulletGroup, true, false, 0, 0);
                }
                if(this.scene.tutorialNum == 8) {
                    this.scene.tutorialText.setText("Each IDLE weapon can also block and destroy enemy projectiles of the same color. (Y)");
                    // Replace dummies with shooting dummies
                    this.scene.rDummy3 = this.scene.redEnemyGroup.addDummy(centerX - 50, centerY, this.scene.redEnemyGroup, this.scene.blueEnemyGroup, this.scene.redEnemyBulletGroup, this.scene.blueEnemyBulletGroup, false, true, -1, 0);
                    this.scene.bDummy3 = this.scene.blueEnemyGroup.addDummy(centerX + 50, centerY, this.scene.redEnemyGroup, this.scene.blueEnemyGroup, this.scene.redEnemyBulletGroup, this.scene.blueEnemyBulletGroup, true, true, 1, 0);
                }
                if(this.scene.tutorialNum == 9) {
                    this.scene.tutorialText.setText("The RED KNIFE is good at offense and against single enemies. The BLUE ORB is good at defense and against multiple enemies. (Y)");
                }
                if(this.scene.tutorialNum == 10) {
                    this.scene.tutorialText.setText("CORRUPTION enables you to quickly and frequently deal massive damage. The ESSENCES OF CORRUPTION indicate your corruption level. (Y)");
                }
                if(this.scene.tutorialNum == 11) {
                    this.scene.tutorialText.setText("Gain CORRUPTION by dealing damage with the RED KNIFE, blocking enemies with the BLUE ORB, or blocking projectiles with an IDLE weapon. (Y)");
                }
                if(this.scene.tutorialNum == 12) {
                    this.scene.tutorialText.setText("Once you have some CORRUPTION, SHIFT to ACTIVATE it and empower your NEXT ATTACK with additional damage based on your CORRUPTION. (Y)");
                }
                if(this.scene.tutorialNum == 13) {
                    this.scene.tutorialText.setText("CORRUPTION decays while not ACTIVATED. While ACTIVATED, use the CORRUPT weapon before it EXPIRES. (Y)");
                }
                if(this.scene.tutorialNum == 14) {
                    this.scene.tutorialText.setText("Enemies can also SHIFT their own color state so kill them quickly with powerful CORRUPTION attacks! (Y)");
                }
                if(this.scene.tutorialNum == 15) {
                    this.scene.tutorialText.setText("To end the tutorial and start infinite enemy spawners, press (N)");
                }

            }
        });

        // Remove tutorial items and start infinite enemy spawner
        this.startSpawning = this.input.keyboard.on('keydown-N', function () {
            if(!this.spawnedEnemies) {
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
                    },
                    callbackContext: this,
                    loop: true,
                });
            }
        }, this);
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

        // if(playerState == 0) {
        //     this.wallsLayer.destroy(true);
        //     this.wallsLayer = this.map.createStaticLayer("Walls", this.tileset);
        //     this.wallsLayer.setCollisionByProperty({collides: true});
        //     console.log("true");

        // } else {
        //     this.wallsLayer.destroy(true);
        //     this.wallsLayer = this.map.createStaticLayer("Walls", this.tileset);
        //     this.wallsLayer.setCollisionByProperty({collides: false});
        //     console.log("false");

        // }

        if (Phaser.Input.Keyboard.JustDown(this.keyStart) || Phaser.Input.Keyboard.JustDown(this.keyPause)) {
            if(!isGameOver) {
                isPaused = true;
                this.scene.pause(currScene);
                this.scene.pause('hudScene');
                this.scene.swapPosition('menuScene', currScene);
                this.scene.setVisible(false, 'hudScene');
                this.scene.run('menuScene');
                this.scene.setVisible(true, 'menuScene');
            }
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