class Tutorial extends Phaser.Scene {
    constructor() {
        super('tutorialScene');
    }


    create() {
        this.keyStart = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.keyPause = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        this.sceneKey = 'tutorialScene';
        currScene = this.sceneKey;

        this.room2Spawned = false;
        this.room3Spawned = false;
        this.room4Spawned = false;
        this.room5Spawned = false;

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

        this.map = this.make.tilemap({key: "tutorialTilemap", tileWidth: 32, tileHeight: 32 });

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

        // this.wallsLayer.destroy(false);
        // this.wallsLayer = this.map.createStaticLayer("Walls", this.tileset);

        // this.floorLayer.setPipeline('Light2D')
        // this.sceneryLayer.setPipeline('Light2D')
        // this.wallsLayer.setPipeline('Light2D')
        // this.light = this.lights.addLight(centerX, centerY, 200)
        // this.lights.enable().setAmbientColor(0x888888);
        // this.lights.addLight(centerX, centerY, 500).setColor(0xFFFFFF)

        this.physics.world.bounds.setTo(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        
        this.rooms = [];
        //this.currentRoom = 1;
        
        this.map.findObject('MainObjects', function(object) {
            // rooms
            if (object.type === 'Room') {
                this.rooms.push(object);
            }
            if(object.name === 'Door1_2') {
                // Door(scene, oSpawnX, oSpawnY, room1, room2, isOpen)
                this.door1_2 = new Door(this, object.x, object.y, 'Room1', 'Room2', true);
            }
            if(object.name === 'Door2_3') {
                this.door2_3 = new Door(this, object.x, object.y, 'Room2', 'Room3', false);
            }
            if(object.name === 'Door3_4') {
                this.door3_4 = new Door(this, object.x, object.y, 'Room3', 'Room4', false);
            }
            if(object.name === 'Door4_5') {
                this.door4_5 = new Door(this, object.x, object.y, 'Room4', 'Room5', false);
            }
            if(object.name === 'Door5_end') {
                this.door5_end = new Door(this, object.x, object.y, 'Room5', 'End', false);
            }
            if (object.name === 'Player') {
                player = new Player(this, game.scene.keys.hudScene, object.x, object.y);
                player.canUseCorruption = false;
            }
            if (object.name === 'End') {
                // Endpoint(scene, oSpawnX, oSpawnY, sceneDestination)
                this.endpoint = new Endpoint(this, object.x, object.y, "gameOverScene");
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
        this.physics.add.collider(this.redEnemyGroup,  this.wallsLayer);
        this.physics.add.collider(this.blueEnemyGroup,  this.wallsLayer);

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

        // this.input.keyboard.on('keydown-Y', function () {
        //     if(!this.scene.spawnedEnemies) {
        //         inTutorial = true;
        //         this.scene.tutorialNum++; 
        //         if(this.scene.tutorialNum == 1) {
        //             this.scene.tutorialText.setText("Press SHIFT to change your color state between RED and BLUE. (Y)");
        //         }
        //         if(this.scene.tutorialNum == 2) {
        //             this.scene.tutorialText.setText("When you are BLUE, RED objects cannot collide with you, but BLUE objects can collide with you.(Y)");
        //         }
        //         if(this.scene.tutorialNum == 3) {
        //             this.scene.tutorialText.setText("RED collides with RED, BLUE collides with BLUE, and OPPOSITES pass through. Notice that SHIFTING has a cooldown. (Y)");
        //         }
        //         if(this.scene.tutorialNum == 4) {
        //             this.scene.tutorialText.setText("While your body is RED, you have the RED KNIFE equppied. Use the MOUSE to aim and use LEFT MOUSE BUTTON to rapidly shoot them. (Y)");
        //         }
        //         if(this.scene.tutorialNum == 5) {
        //             this.scene.tutorialText.setText("While you are not shooting, your weapon is in IDLE form. The IDLE KNIFE stuns and deals extra damage. (Y)");
        //             this.scene.rDummy1 = this.scene.redEnemyGroup.addDummy(centerX - 50, centerY + 100, this.scene.redEnemyGroup, this.scene.blueEnemyGroup, this.scene.redEnemyBulletGroup, this.scene.blueEnemyBulletGroup, false, false, 0, 0);
        //             this.scene.rDummy2 = this.scene.redEnemyGroup.addDummy(centerX - 50, centerY - 100, this.scene.redEnemyGroup, this.scene.blueEnemyGroup, this.scene.redEnemyBulletGroup, this.scene.blueEnemyBulletGroup, false, false, 0, 0);
        //         }
        //         if(this.scene.tutorialNum == 6) {
        //             this.scene.tutorialText.setText("While your body is BLUE, you have the BLUE ORB equppied. After shooting, it accelerates and pierces enemies. (Y)");
        //         }
        //         if(this.scene.tutorialNum == 7) {
        //             this.scene.tutorialText.setText("The IDLE ORB knocksback and stuns enemies. (Y)");
        //             this.scene.bDummy1 = this.scene.blueEnemyGroup.addDummy(centerX + 50, centerY + 100, this.scene.redEnemyGroup, this.scene.blueEnemyGroup, this.scene.redEnemyBulletGroup, this.scene.blueEnemyBulletGroup, true, false, 0, 0);
        //             this.scene.bDummy2 = this.scene.blueEnemyGroup.addDummy(centerX + 50, centerY - 100, this.scene.redEnemyGroup, this.scene.blueEnemyGroup, this.scene.redEnemyBulletGroup, this.scene.blueEnemyBulletGroup, true, false, 0, 0);
        //         }
        //         if(this.scene.tutorialNum == 8) {
        //             this.scene.tutorialText.setText("Each IDLE weapon can also block and destroy enemy projectiles of the same color. (Y)");
        //             // Replace dummies with shooting dummies
        //             this.scene.rDummy3 = this.scene.redEnemyGroup.addDummy(centerX - 50, centerY, this.scene.redEnemyGroup, this.scene.blueEnemyGroup, this.scene.redEnemyBulletGroup, this.scene.blueEnemyBulletGroup, false, true, -1, 0);
        //             this.scene.bDummy3 = this.scene.blueEnemyGroup.addDummy(centerX + 50, centerY, this.scene.redEnemyGroup, this.scene.blueEnemyGroup, this.scene.redEnemyBulletGroup, this.scene.blueEnemyBulletGroup, true, true, 1, 0);
        //         }
        //         if(this.scene.tutorialNum == 9) {
        //             this.scene.tutorialText.setText("The RED KNIFE is good at offense and against single enemies. The BLUE ORB is good at defense and against multiple enemies. (Y)");
        //         }
        //         if(this.scene.tutorialNum == 10) {
        //             this.scene.tutorialText.setText("CORRUPTION enables you to quickly and frequently deal massive damage. The ESSENCES OF CORRUPTION indicate your corruption level. (Y)");
        //         }
        //         if(this.scene.tutorialNum == 11) {
        //             this.scene.tutorialText.setText("Gain CORRUPTION by dealing damage with the RED KNIFE, blocking enemies with the BLUE ORB, or blocking projectiles with an IDLE weapon. (Y)");
        //         }
        //         if(this.scene.tutorialNum == 12) {
        //             this.scene.tutorialText.setText("Once you have some CORRUPTION, SHIFT to ACTIVATE it and empower your NEXT ATTACK with additional damage based on your CORRUPTION. (Y)");
        //         }
        //         if(this.scene.tutorialNum == 13) {
        //             this.scene.tutorialText.setText("CORRUPTION decays while not ACTIVATED. While ACTIVATED, use the CORRUPT weapon before it EXPIRES. (Y)");
        //         }
        //         if(this.scene.tutorialNum == 14) {
        //             this.scene.tutorialText.setText("Enemies can also SHIFT their own color state so kill them quickly with powerful CORRUPTION attacks! (Y)");
        //         }
        //         if(this.scene.tutorialNum == 15) {
        //             this.scene.tutorialText.setText("To end the tutorial and start infinite enemy spawners, press (N)");
        //         }

        //     }
        // });

        this.input.keyboard.on('keydown-ZERO', function () {
            this.door1_2.toggleOpen();
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

        if (player.roomChange) {
            this.cameras.main.fadeOut(250, 0, 0, 0, function(camera, progress) {
                player.canMove = false;
                if (progress === 1) {
                    if(!this.room2Spawned && player.currentRoom == 1) {
                        this.door1_2.toggleOpen();
                        this.spawnEnemies2();
                    }
                    if(!this.room3Spawned && player.currentRoom == 2) {
                        this.spawnEnemies3();
                    }
                    if(!this.room4Spawned && player.currentRoom == 3) {
                        this.spawnEnemies4();
                        // Highlight corruption counter
                        game.scene.keys.hudScene.highlightHudElement(centerX - 220, screenHeight - 70, 440, 60, 5000);
                        // Highlight corruption expire bar
                        game.scene.keys.hudScene.highlightHudElement(centerX - 220, screenHeight - 25, 440, 25, 5000);
                        // Highlight corruption heal
                        game.scene.keys.hudScene.highlightHudElement(screenWidth - 380, screenHeight - 30, 450, 30, 5000);

                        player.canUseCorruption = true;
                    }
                    if(!this.room5Spawned && player.currentRoom == 4) {
                        this.spawnEnemies5();
                    }
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

                        }
                    }, this);
                }
            }, this);
        }
    }

    spawnEnemies2() {
        this.room2Spawned = true;
        this.map.findObject('Spawns2', function(object) {
            if (object.name === 'Slime2_1') {
                //addDummy(spawnX, spawnY, redGroup, blueGroup, redBulletGroup, blueBulletGroup, flip, isShooter, shotX, shotY)
                this.redEnemyGroup.addDummy(object.x, object.y, this.redEnemyGroup, this.blueEnemyGroup, this.redEnemyBulletGroup, this.blueEnemyBulletGroup, false, false);
            }
            if (object.name === 'Slime2_2') {
                this.redEnemyGroup.addDummy(object.x, object.y, this.redEnemyGroup, this.blueEnemyGroup, this.redEnemyBulletGroup, this.blueEnemyBulletGroup, false, false);
            }
            if (object.name === 'Slime2_3') {
                this.redEnemyGroup.addDummy(object.x, object.y, this.redEnemyGroup, this.blueEnemyGroup, this.redEnemyBulletGroup, this.blueEnemyBulletGroup, false, false);
            }
            if (object.name === 'Slime2_4') {
                this.blueEnemyGroup.addDummy(object.x, object.y, this.redEnemyGroup, this.blueEnemyGroup, this.redEnemyBulletGroup, this.blueEnemyBulletGroup, true, false);
            }
            if (object.name === 'Slime2_5') {
                this.blueEnemyGroup.addDummy(object.x, object.y, this.redEnemyGroup, this.blueEnemyGroup, this.redEnemyBulletGroup, this.blueEnemyBulletGroup, true, false);
            }
            if (object.name === 'Slime2_6') {
                this.blueEnemyGroup.addDummy(object.x, object.y, this.redEnemyGroup, this.blueEnemyGroup, this.redEnemyBulletGroup, this.blueEnemyBulletGroup, true, false);
            }
        }, this);
    }
    spawnEnemies3() {
        this.room3Spawned = true;
        this.map.findObject('Spawns3', function(object) {
            if (object.name === 'Slime3_1') {
                //addDummy(spawnX, spawnY, redGroup, blueGroup, redBulletGroup, blueBulletGroup, flip, isShooter, shotX, shotY)
                this.redEnemyGroup.addDummy(object.x, object.y, this.redEnemyGroup, this.blueEnemyGroup, this.redEnemyBulletGroup, this.blueEnemyBulletGroup, false, true, 0, 1);
            }
            if (object.name === 'Slime3_2') {
                this.blueEnemyGroup.addDummy(object.x, object.y, this.redEnemyGroup, this.blueEnemyGroup, this.redEnemyBulletGroup, this.blueEnemyBulletGroup, false, true, 0, -1);
            }
            if (object.name === 'Slime3_3') {
                this.redEnemyGroup.addDummy(object.x, object.y, this.redEnemyGroup, this.blueEnemyGroup, this.redEnemyBulletGroup, this.blueEnemyBulletGroup, false, true, 0, 1);
            }
            if (object.name === 'Slime3_4') {
                this.blueEnemyGroup.addDummy(object.x, object.y, this.redEnemyGroup, this.blueEnemyGroup, this.redEnemyBulletGroup, this.blueEnemyBulletGroup, false, true, 0, -1);
            }
            if (object.name === 'Slime3_5') {
                this.redEnemyGroup.addDummy(object.x, object.y, this.redEnemyGroup, this.blueEnemyGroup, this.redEnemyBulletGroup, this.blueEnemyBulletGroup, false, true, 0, 1);
            }
        }, this);
    }
    spawnEnemies4() {
        this.room4Spawned = true;
        this.map.findObject('Spawns4', function(object) {
            if (object.name === 'Slime4_1') {
                //addDummy(spawnX, spawnY, redGroup, blueGroup, redBulletGroup, blueBulletGroup, flip, isShooter, shotX, shotY)
                this.redEnemyGroup.addDummy(object.x, object.y, this.redEnemyGroup, this.blueEnemyGroup, this.redEnemyBulletGroup, this.blueEnemyBulletGroup, false, false);
            }
            if (object.name === 'Slime4_2') {
                this.blueEnemyGroup.addDummy(object.x, object.y, this.redEnemyGroup, this.blueEnemyGroup, this.redEnemyBulletGroup, this.blueEnemyBulletGroup, false, false);
            }
            if (object.name === 'Slime4_3') {
                this.redEnemyGroup.addDummy(object.x, object.y, this.redEnemyGroup, this.blueEnemyGroup, this.redEnemyBulletGroup, this.blueEnemyBulletGroup, false, true, 0, -1);
            }
            if (object.name === 'Slime4_4') {
                this.blueEnemyGroup.addDummy(object.x, object.y, this.redEnemyGroup, this.blueEnemyGroup, this.redEnemyBulletGroup, this.blueEnemyBulletGroup, false, false);

            }
            if (object.name === 'Slime4_5') {
                this.redEnemyGroup.addDummy(object.x, object.y, this.redEnemyGroup, this.blueEnemyGroup, this.redEnemyBulletGroup, this.blueEnemyBulletGroup, false, false);
            }
            if (object.name === 'Slime4_6') {
                this.blueEnemyGroup.addDummy(object.x, object.y, this.redEnemyGroup, this.blueEnemyGroup, this.redEnemyBulletGroup, this.blueEnemyBulletGroup, false, true, 0, -1);
            }
            if (object.name === 'Slime4_7') {
                this.redEnemyGroup.addDummy(object.x, object.y, this.redEnemyGroup, this.blueEnemyGroup, this.redEnemyBulletGroup, this.blueEnemyBulletGroup, false, false);
            }
            if (object.name === 'Slime4_8') {
                this.blueEnemyGroup.addDummy(object.x, object.y, this.redEnemyGroup, this.blueEnemyGroup, this.redEnemyBulletGroup, this.blueEnemyBulletGroup, false, false);
            }
        }, this);
    }
    spawnEnemies5() {
        this.room5Spawned = true;
        this.map.findObject('Spawns5', function(object) {
            if (object.name === 'Slime5_1') {
                //addChaser(spawnX, spawnY, changeCondition, redGroup, blueGroup)
                this.blueEnemyGroup.addChaser(object.x, object.y, "timed", this.redEnemyGroup, this.blueEnemyGroup);
            }
            if (object.name === 'Slime5_2') {
                this.redEnemyGroup.addChaser(object.x, object.y, "damaged", this.redEnemyGroup, this.blueEnemyGroup);
            }
            if (object.name === 'Slime5_3') {
                this.blueEnemyGroup.addChaser(object.x, object.y, "mirror", this.redEnemyGroup, this.blueEnemyGroup);        
            }
        }, this);
    }
}