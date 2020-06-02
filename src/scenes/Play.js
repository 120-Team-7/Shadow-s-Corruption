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
        const tileset = this.map.addTilesetImage("fornow5",  "tiles", 32, 32,);

        // The map layers.
         
        this.floorLayer = this.map.createStaticLayer("Background",        tileset);
        this.gemsLayer = this.map.createStaticLayer("Gems",        tileset);
        this.sceneryLayer = this.map.createStaticLayer("Scenery",        tileset);
        this.redwallLayer = this.map.createStaticLayer("Redwall",        tileset);
        this.bluewallLayer = this.map.createStaticLayer("Bluewall",        tileset);
        this.wallsLayer = this.map.createStaticLayer("Walls",        tileset);

        this.physics.world.bounds.setTo(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.wallsLayer.setCollisionByProperty({collides: true});

        this.rooms = [];
        this.currentRoom = 1;
        
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
        this.map.findObject('ColorWalls', function(object) {
            if (object.name === 'Red') {
                this.redGroup.addObstacle(object.x, object.y);
            }
            if (object.name === 'Blue') {
                this.blueGroup.addObstacle(object.x, object.y);
            }
    }, this);


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
                isPaused = true;
                this.scene.pause(currScene);
                this.scene.pause('hudScene');
                this.scene.setVisible(false, 'hudScene');
                this.scene.run('menuScene');
                this.scene.swapPosition('menuScene', currScene);
                this.scene.setVisible(true, 'menuScene');
            }
        }
        if (player.roomChange) {
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
                        this.roomStart(player.currentRoom);
                        }
                    }, this);
                }
            }, this);
        }
    }
    roomStart(roomNumber) {
        
        if (roomNumber == 1) {
            this.spawnEnemies2();
        }
        if (roomNumber == 2) {
            this.spawnEnemies3();
        }
        if (roomNumber == 3) {
            this.spawnEnemies4();
        }
        if (roomNumber == 4) {
            this.spawnEnemies5();
        }
        if (roomNumber == 5) {
            this.spawnEnemies6();
        }
        
    }
    spawnEnemies() {
        let screenBuffer = 20;
        this.map.findObject('Objects', function(object) {
            if (object.type === 'Spawn') {
                if (object.name === 'Slime') {
                    this.blueEnemyGroup.addShooter(object.x,object.y, 'timed', this.redEnemyGroup, this.blueEnemyGroup, this.redEnemyBulletGroup, this.blueEnemyBulletGroup);
                    //this.redEnemyGroup.addChaser(object.x, object.y, 'timed', this.redEnemyGroup, this.blueEnemyGroup);
                }
            }
            if (object.type === 'Spawn') {
                if (object.name === 'Slime2') {
                    this.blueEnemyGroup.addShooter(object.x,object.y, 'timed', this.redEnemyGroup, this.blueEnemyGroup, this.redEnemyBulletGroup, this.blueEnemyBulletGroup);
                    //this.redEnemyGroup.addChaser(object.x, object.y, 'timed', this.redEnemyGroup, this.blueEnemyGroup);
                }
            }
        }, this);
    }
    //spawn enemies in room2
    spawnEnemies2() {
        let screenBuffer = 20;
        this.map.findObject('Objects', function(object) {
            if (object.type === 'Spawn2') {
                if (object.name === 'Slime5') {
                    //this.blueEnemyGroup.addShooter(object.x,object.y, 'timed', this.redEnemyGroup, this.blueEnemyGroup, this.redEnemyBulletGroup, this.blueEnemyBulletGroup);
                    this.redEnemyGroup.addChaser(object.x, object.y, 'timed', this.redEnemyGroup, this.blueEnemyGroup);
                }
            }
            if (object.type === 'Spawn2') {
                if (object.name === 'Slime6') {
                    //this.redEnemyGroup.addChaser(object.x,object.y, 'timed', this.redEnemyGroup, this.blueEnemyGroup, this.redEnemyBulletGroup, this.blueEnemyBulletGroup);
                    this.blueEnemyGroup.addChaser(object.x, object.y, 'mirror', this.redEnemyGroup, this.blueEnemyGroup);
                }
            }
            if (object.type === 'Spawn2') {
                if (object.name === 'Slime7') {
                    this.blueEnemyGroup.addShooter(object.x,object.y, 'damaged', this.redEnemyGroup, this.blueEnemyGroup, this.redEnemyBulletGroup, this.blueEnemyBulletGroup);
                    //this.redEnemyGroup.addChaser(object.x, object.y, 'timed', this.redEnemyGroup, this.blueEnemyGroup);
                }
            }
            if (object.type === 'Spawn2') {
                if (object.name === 'Slime8') {
                    this.redEnemyGroup.addShooter(object.x,object.y, 'timed', this.redEnemyGroup, this.blueEnemyGroup, this.redEnemyBulletGroup, this.blueEnemyBulletGroup);
                    //this.redEnemyGroup.addChaser(object.x, object.y, 'timed', this.redEnemyGroup, this.blueEnemyGroup);
                }
            }
        }, this);
    }
    spawnEnemies3() {
        let screenBuffer = 20;
        this.map.findObject('Objects', function(object) {
            if (object.type === 'Spawn3') {
                if (object.name === 'Slime9') {
                    //this.blueEnemyGroup.addShooter(object.x,object.y, 'timed', this.redEnemyGroup, this.blueEnemyGroup, this.redEnemyBulletGroup, this.blueEnemyBulletGroup);
                    this.redEnemyGroup.addChaser(object.x, object.y, 'timed', this.redEnemyGroup, this.blueEnemyGroup);
                }
            }
            if (object.type === 'Spawn3') {
                if (object.name === 'Slime10') {
                    //this.redEnemyGroup.addChaser(object.x,object.y, 'timed', this.redEnemyGroup, this.blueEnemyGroup, this.redEnemyBulletGroup, this.blueEnemyBulletGroup);
                    this.redEnemyGroup.addChaser(object.x, object.y, 'damaged', this.redEnemyGroup, this.blueEnemyGroup);
                }
            }
            if (object.type === 'Spawn3') {
                if (object.name === 'Slime11') {
                    this.blueEnemyGroup.addShooter(object.x,object.y, 'damaged', this.redEnemyGroup, this.blueEnemyGroup, this.redEnemyBulletGroup, this.blueEnemyBulletGroup);
                    //this.redEnemyGroup.addChaser(object.x, object.y, 'timed', this.redEnemyGroup, this.blueEnemyGroup);
                }
            }
            if (object.type === 'Spawn3') {
                if (object.name === 'Slime12') {
                    this.redEnemyGroup.addShooter(object.x,object.y, 'timed', this.redEnemyGroup, this.blueEnemyGroup, this.redEnemyBulletGroup, this.blueEnemyBulletGroup);
                    //this.redEnemyGroup.addChaser(object.x, object.y, 'timed', this.redEnemyGroup, this.blueEnemyGroup);
                }
            }
        }, this);
    }
    spawnEnemies4() {
        let screenBuffer = 20;
        this.map.findObject('Objects', function(object) {
            if (object.type === 'Spawn4') {
                if (object.name === 'Slime13') {
                    this.blueEnemyGroup.addShooter(object.x,object.y, 'damaged', this.redEnemyGroup, this.blueEnemyGroup, this.redEnemyBulletGroup, this.blueEnemyBulletGroup);
                    //this.redEnemyGroup.addChaser(object.x, object.y, 'timed', this.redEnemyGroup, this.blueEnemyGroup);
                }
            }
            if (object.type === 'Spawn4') {
                if (object.name === 'Slime14') {
                    this.redEnemyGroup.addChaser(object.x,object.y, 'mirror', this.redEnemyGroup, this.blueEnemyGroup);
                    //this.redEnemyGroup.addChaser(object.x, object.y, 'timed', this.redEnemyGroup, this.blueEnemyGroup);
                }
            }
            if (object.type === 'Spawn4') {
                if (object.name === 'Slime15') {
                    this.blueEnemyGroup.addChaser(object.x,object.y, 'mirror', this.redEnemyGroup, this.blueEnemyGroup);
                    //this.redEnemyGroup.addChaser(object.x, object.y, 'timed', this.redEnemyGroup, this.blueEnemyGroup);
                }
            }
            if (object.type === 'Spawn4') {
                if (object.name === 'Slime16') {
                    this.redEnemyGroup.addShooter(object.x,object.y, 'timed', this.redEnemyGroup, this.blueEnemyGroup, this.redEnemyBulletGroup, this.blueEnemyBulletGroup);
                    //this.redEnemyGroup.addChaser(object.x, object.y, 'timed', this.redEnemyGroup, this.blueEnemyGroup);
                }
            }
        }, this);
    }
    spawnEnemies5() {
        let screenBuffer = 20;
        this.map.findObject('Objects', function(object) {
            if (object.type === 'Spawn5') {
                if (object.name === 'Slime17') {
                    this.blueEnemyGroup.addShooter(object.x,object.y, 'damaged', this.redEnemyGroup, this.blueEnemyGroup, this.redEnemyBulletGroup, this.blueEnemyBulletGroup);
                    //this.redEnemyGroup.addChaser(object.x, object.y, 'timed', this.redEnemyGroup, this.blueEnemyGroup);
                }
            }
            if (object.type === 'Spawn5') {
                if (object.name === 'Slime18') {
                    this.redEnemyGroup.addChaser(object.x,object.y, 'timed', this.redEnemyGroup, this.blueEnemyGroup);
                    //this.redEnemyGroup.addChaser(object.x, object.y, 'timed', this.redEnemyGroup, this.blueEnemyGroup);
                }
            }
            if (object.type === 'Spawn5') {
                if (object.name === 'Slime19') {
                    this.blueEnemyGroup.addChaser(object.x,object.y, 'mirror', this.redEnemyGroup, this.blueEnemyGroup);
                    //this.redEnemyGroup.addChaser(object.x, object.y, 'timed', this.redEnemyGroup, this.blueEnemyGroup);
                }
            }
            if (object.type === 'Spawn5') {
                if (object.name === 'Slime20') {
                    this.redEnemyGroup.addShooter(object.x,object.y, 'timed', this.redEnemyGroup, this.blueEnemyGroup, this.redEnemyBulletGroup, this.blueEnemyBulletGroup);
                    //this.redEnemyGroup.addChaser(object.x, object.y, 'timed', this.redEnemyGroup, this.blueEnemyGroup);
                }
            }
        }, this);
    }
    spawnEnemies6() {
        let screenBuffer = 20;
        this.map.findObject('Objects', function(object) {
            if (object.type === 'Spawn6') {
                if (object.name === 'Slime21') {
                    this.blueEnemyGroup.addShooter(object.x,object.y, 'damaged', this.redEnemyGroup, this.blueEnemyGroup, this.redEnemyBulletGroup, this.blueEnemyBulletGroup);
                    //this.redEnemyGroup.addChaser(object.x, object.y, 'timed', this.redEnemyGroup, this.blueEnemyGroup);
                }
            }
            if (object.type === 'Spawn6') {
                if (object.name === 'Slime22') {
                    this.redEnemyGroup.addChaser(object.x,object.y, 'timed', this.redEnemyGroup, this.blueEnemyGroup);
                    //this.redEnemyGroup.addChaser(object.x, object.y, 'timed', this.redEnemyGroup, this.blueEnemyGroup);
                }
            }
            if (object.type === 'Spawn6') {
                if (object.name === 'Slime23') {
                    this.blueEnemyGroup.addChaser(object.x,object.y, 'mirror', this.redEnemyGroup, this.blueEnemyGroup);
                    //this.redEnemyGroup.addChaser(object.x, object.y, 'timed', this.redEnemyGroup, this.blueEnemyGroup);
                }
            }
            if (object.type === 'Spawn6') {
                if (object.name === 'Slime24') {
                    this.redEnemyGroup.addShooter(object.x,object.y, 'timed', this.redEnemyGroup, this.blueEnemyGroup, this.redEnemyBulletGroup, this.blueEnemyBulletGroup);
                    //this.redEnemyGroup.addChaser(object.x, object.y, 'timed', this.redEnemyGroup, this.blueEnemyGroup);
                }
            }
        }, this);
    }
}