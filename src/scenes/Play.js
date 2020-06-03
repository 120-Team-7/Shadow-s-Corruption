class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }


    create() {
        this.keyStart = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.keyPause = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        this.sceneKey = 'playScene';
        currScene = this.sceneKey;

        this.enemyNum = 0;
        this.killGoal = 0;
        this.inFight = true;
        this.spawnedEnemies2 = false;
        this.spawnedEnemies3 = false;
        this.spawnedEnemies4 = false;
        this.spawnedEnemies5 = false;
        this.spawnedEnemies6 = false;

        this.clearedEnemies2 = false;
        this.clearedEnemies3 = false;
        this.clearedEnemies4 = false;
        this.clearedEnemies5 = false;
        this.clearedEnemies6 = false;

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

            // Rooms
            if (object.type === 'Room') {
                this.rooms.push(object);
            }
            // Doors
            if (object.type === 'Door') {
                if(object.name === 'Door1_2') {
                    // Door(scene, oSpawnX, oSpawnY, room1, room2, isOpen)
                    this.door1_2 = new Door(this, object.x, object.y, 'Room1', 'Room2', false);
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
                if(object.name === 'Door5_6') {
                    this.door5_6 = new Door(this, object.x, object.y, 'Room5', 'Room6', false);
                }
                if(object.name === 'Door6_end') {
                    this.door6_end = new Door(this, object.x, object.y, 'Room6', 'End', false);
                }
            }
            // Spawn points
            if (object.type === 'Spawn') {
                if (object.name === 'Player') {
                    player = new Player(this, game.scene.keys.hudScene, object.x, object.y);
                }
            }
            if (object.name === 'End') {
                // Endpoint(scene, oSpawnX, oSpawnY, sceneDestination)
                this.endpoint = new Endpoint(this, object.x, object.y, "gameOverScene");
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

    this.scene.run('hudScene');

    // Add play objects ----------------------------------------------------------------------------------------------------

    this.spawnEnemies();
    this.updateRoomData(this.spawnedEnemies2);
    this.inFight = true;

    // Nuke all enemies
    this.input.keyboard.on('keydown-N', function () {
        this.redEnemyGroup.nukeEnemies();
        this.blueEnemyGroup.nukeEnemies();
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
                this.scene.setVisible(false, 'hudScene');
                this.scene.run('menuScene');
                this.scene.swapPosition('menuScene', currScene);
                this.scene.setVisible(true, 'menuScene');
            }
        }

        if(this.inFight) {
            if(!this.clearedEnemies1 && pStats.enemiesKilled == this.killGoal) {
                this.inFight = false;
                this.clearedEnemies1 = true;
                this.door1_2.open();
            }
            if(this.spawnedEnemies2  && !this.clearedEnemies2 && pStats.enemiesKilled == this.killGoal) {
                this.inFight = false;
                this.clearedEnemies2 = true;
                this.door1_2.open();
                this.door2_3.open();
            }
            if(this.spawnedEnemies3  && !this.clearedEnemies3 && pStats.enemiesKilled == this.killGoal) {
                this.inFight = false;
                this.clearedEnemies3 = true;
                this.door2_3.open();
                this.door3_4.open();
            }
            if(this.spawnedEnemies4  && !this.clearedEnemies4 && pStats.enemiesKilled == this.killGoal) {
                this.inFight = false;
                this.clearedEnemies4 = true;
                this.door3_4.open();
                this.door4_5.open();
            }
            if(this.spawnedEnemies5  && !this.clearedEnemies5 && pStats.enemiesKilled == this.killGoal) {
                this.inFight = false;
                this.clearedEnemies5 = true;
                this.door4_5.open();
                this.door5_6.open();
            }
            if(this.spawnedEnemies6  && !this.clearedEnemies6 && pStats.enemiesKilled == this.killGoal) {
                this.inFight = false;
                this.clearedEnemies6 = true;
                this.door5_6.open();
                this.door6_end.open();
            }
        }

        if (player.roomChange) {
            this.cameras.main.fadeOut(250, 0, 0, 0, function(camera, progress) {
            player.canMove = false;
            if (progress === 1) {
                this.roomStart(player.currentRoom);
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
    roomStart(roomNumber) {
        
        if (!this.spawnedEnemies2 && roomNumber == 1) {
            this.inFight = true;
            this.spawnedEnemies2 = true;
            this.spawnEnemies2();
            this.door1_2.close();
            this.updateRoomData();
        }
        if (!this.spawnedEnemies3 && roomNumber == 2) {
            this.inFight = true;
            this.spawnedEnemies3 = true;
            this.spawnEnemies3();
            this.door2_3.close();
            this.updateRoomData();
        }
        if (!this.spawnedEnemies4 && roomNumber == 3) {
            this.inFight = true;
            this.spawnedEnemies4 = true;
            this.spawnEnemies4();
            this.door3_4.close();
            this.updateRoomData();
        }
        if (!this.spawnedEnemies5 && roomNumber == 4) {
            this.inFight = true;
            this.spawnedEnemies5 = true;
            this.spawnEnemies5();
            this.door4_5.close();
            this.updateRoomData();
        }
        if (!this.spawnedEnemies6 && roomNumber == 5) {
            this.inFight = true;
            this.spawnedEnemies6 = true;
            this.spawnEnemies6();
            this.door5_6.close();
            this.updateRoomData();
        }
    }

    updateRoomData() {
        this.enemyNum = this.redEnemyGroup.getLength() + this.blueEnemyGroup.getLength();
        this.killGoal = pStats.enemiesKilled + this.enemyNum;
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