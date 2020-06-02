class Practice extends Phaser.Scene {
    constructor() {
        super('practiceScene');
    }

    preload () {
        this.load.video('stunLocking', './assets/videos/StunLocking.mp4');
        this.load.video('idleKnife', './assets/videos/IdleKnifeKillBonus.mp4');
        this.load.video('orbMulti', './assets/videos/OrbStunMultihit.mp4');
        this.load.video('weaponMines', './assets/videos/WeaponMines.mp4');
        this.load.video('speedBoost', './assets/videos/CorruptionSpeedBoost.mp4');
        this.load.video('knifeChain', './assets/videos/CorruptionKnifeChaining.mp4');
        this.load.video('shootBlockShoot', './assets/videos/ShootBlockShoot.mp4');
        this.load.video('short3', './assets/videos/SCshort3.mp4');
    }

    create() {
        this.keyStart = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.keyPause = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        this.sceneKey = 'practiceScene';
        currScene = this.sceneKey;

        this.room2Spawned = false;
        this.room3Spawned = false;
        this.room4Spawned = false;
        this.room5Spawned = false;

        this.physics.world.debugGraphic.setAlpha(0);

        corruptionParticles = this.add.particles('corruptionParticle');
        corruptionParticles.setDepth(500);

        this.map = this.make.tilemap({key: "practiceMap", tileWidth: 32, tileHeight: 32 });

        // Define tiles used in map.
        this.tileset = this.map.addTilesetImage("fornow5",  "tiles", 32, 32,);

        // The map layers.
        
        this.floorLayer = this.map.createStaticLayer("Background", this.tileset);
        this.sceneryBottomLayer = this.map.createStaticLayer("SceneryBottom", this.tileset);
        // this.sceneryTopLayer = this.map.createStaticLayer("SceneryTop", this.tileset);
        this.wallsLayer = this.map.createStaticLayer("Walls", this.tileset);

        this.wallsLayer.setCollisionByProperty({collides: true});

        this.physics.world.bounds.setTo(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        
        // Videos
        this.video1 = this.add.video(centerX, 0, 'idleKnife').setOrigin(0.5, 0).setScale(0.5, 0.5);
        this.video1.play(true);
        this.video2 = this.add.video(centerX + screenWidth, 0, 'stunLocking').setOrigin(0.5, 0).setScale(0.5, 0.5);
        this.video3 = this.add.video(centerX + 2*screenWidth, 0, 'orbMulti').setOrigin(0.5, 0).setScale(0.5, 0.5);
        this.video4 = this.add.video(centerX + 3*screenWidth, 0, 'weaponMines').setOrigin(0.5, 0).setScale(0.5, 0.5);
        this.video5 = this.add.video(centerX + 4*screenWidth, 0, 'speedBoost').setOrigin(0.5, 0).setScale(0.5, 0.5);
        this.video6 = this.add.video(centerX + 5*screenWidth, 0, 'knifeChain').setOrigin(0.5, 0).setScale(0.5, 0.5);
        this.video7 = this.add.video(centerX + 6*screenWidth, 0, 'shootBlockShoot').setOrigin(0.5, 0).setScale(0.5, 0.5);
        this.video8 = this.add.video(centerX + 7*screenWidth, 0, 'short3').setOrigin(0.5, 0).setScale(0.5, 0.5);

        this.rooms = [];
        //this.currentRoom = 1;
        
        this.map.findObject('MainObjects', function(object) {
            // rooms
            if (object.type === 'Room') {
                this.rooms.push(object);
            }
            if (object.name === 'Player') {
                player = new Player(this, game.scene.keys.hudScene, object.x, object.y);
            }
            if (object.name === 'End') {
                // Endpoint(scene, oSpawnX, oSpawnY, sceneDestination)
                this.endpoint = new Endpoint(this, object.x, object.y, "gameOverScene");
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

        this.scene.run('hudScene');

        // Add play objects ----------------------------------------------------------------------------------------------------

        // Dev tool
        // this.input.keyboard.on('keydown-ZERO', function () {
        //     tutorialNum = 4;
        // }, this);
        
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

                    if(player.currentRoom == 1) {
                        this.video1.play(true);
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