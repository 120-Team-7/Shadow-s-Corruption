class Practice extends Phaser.Scene {
    constructor() {
        super('practiceScene');
    }

    preload () {
        this.loadingText = this.add.text(screenWidth, screenHeight, 'LOADING...', {
            fontFamily: 'Courier',
            fontSize: '40px',
            color: '#8B008B',
            align: 'center',
            stroke: '#000000',
            strokeThickness: strokeThickness,
        }).setOrigin(1, 1);
        this.tweens.add({
            targets: this.loadingText,
            alpha: { from: 1, to: 0.25},
            ease: 'Sine.easeInOut',
            duration: 1000,
            yoyo: true,
            loop: -1,
        });
        this.load.video('stunLocking', './assets/videos/StunLocking.mp4');
        this.load.video('meleeKnife', './assets/videos/MeleeKnifeKill.mp4');
        this.load.video('orbDouble', './assets/videos/OrbDouble.mp4');
        this.load.video('weaponMines', './assets/videos/WeaponMine.mp4');
        this.load.video('cKnifeChain', './assets/videos/CorruptKnifeChain.mp4');
        this.load.video('shootBlockShoot', './assets/videos/ShootBlockShoot.mp4');
    }

    create() {
        this.keyStart = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.keyPause = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        this.sceneKey = 'practiceScene';
        currScene = this.sceneKey;

        this.physics.world.debugGraphic.setAlpha(0);

        corruptionParticles = this.add.particles('corruptionParticle');
        corruptionParticles.setDepth(500);


        let practiceConfig = {
            fontFamily: 'Courier',
            fontSize: '25px',
            color: '#000000',
            stroke: '#8B008B',
            strokeThickness: 2,
            align: 'center',
            padding: {
                top: 10,
                bottom: 10,
                left: 0,
                right: 0,
            },
            wordWrap: {
                width: screenWidth - 64,
                useAdvancedWrap: true,
            }
        }

        this.map = this.make.tilemap({key: "practiceMap", tileWidth: 32, tileHeight: 32 });

        // Define tiles used in map.
        this.tileset = this.map.addTilesetImage("fornow5",  "tiles", 32, 32,);

        // The map layers
        this.floorLayer = this.map.createStaticLayer("Background", this.tileset);
        this.sceneryBottomLayer = this.map.createStaticLayer("SceneryBottom", this.tileset);

        // Text
        this.textBoxY = 220;
        this.textBox = this.add.rectangle(0, screenHeight, 12*screenWidth, this.textBoxY, dimGray).setOrigin(0, 1);
        this.text1 = this.add.text(centerX, screenHeight - this.textBoxY, "For the duration of the stun condition, enemies stop all actions and cannot contact damage. Each MELEE weapon stuns for 1 second. The MELEE knife has a 0.8 second cooldown. The MELEE orb has a 0.5 second cooldown before it can affect the same enemy. If you continuously stun an enemy, it is stun locked or unable to do anything.", practiceConfig).setOrigin(0.5, 0);
        this.text2 = this.add.text(centerX + screenWidth, screenHeight - this.textBoxY, "If the MELEE knife kills an enemy, you gain full CORRUPTION and the MELEE knife reload of 0.8 seconds is instant. Additionally, if your MELEE knife is corrupted, kills don't stop CORRUPTION ACTIVATION. In other words, a CORRUPTED MELEE knife can finish off many hurt enemies and still be shot as either an orb or knife.", practiceConfig).setOrigin(0.5, 0);
        this.text2 = this.add.text(centerX + 2*screenWidth, screenHeight - this.textBoxY, "An enemy is invulnerable to the orb's effects after being hit by it for 0.5 seconds. By stunning an enemy with the MELEE orb and then walking into the enemy, you are able to shoot the orb on top of the enemy while it is knocked away. Since the orb moves slowly at first and accelerates, it eventually catches up to the enemy to hit them again.", practiceConfig).setOrigin(0.5, 0);
        this.text3 = this.add.text(centerX + 3*screenWidth, screenHeight - this.textBoxY, "When you SHIFT, the MELEE weapon you held before you switched is dropped as a mine. The mine has all the same effects as the MELEE form of the weapon but rapidly disapates. The mine can be used as a brief trap to protect you after SHIFTING.", practiceConfig).setOrigin(0.5, 0);
        this.text4 = this.add.text(centerX + 4*screenWidth, screenHeight - this.textBoxY, "You gain CORRUPTION equal to the damage dealt of a knife attack. CORRUPT attacks have bonus damage based on CORRUPTION level at the time of the attack. Using these facts, you can use the knife to chain CORRUPT knife throws and net 1 CORRUPTION each time due to the 1 base damage of the thrown knife.", practiceConfig).setOrigin(0.5, 0);
        this.text5 = this.add.text(centerX + 5*screenWidth, screenHeight - this.textBoxY, "Being efficient with CORRUPTION is key to doing well. A single CORRUPT attack always deal more overall damage than several normal attacks. Gaining and using CORRUPTION is easy so, constantly doing so will allow you to kill enemies the fastest. By repeatedly and quickly gaining CORRUPTION, SHIFTING, and using it, you can efficiently maintain your CORRUPTION at a high level.", practiceConfig).setOrigin(0.5, 0);

        this.wallsLayer = this.map.createStaticLayer("Walls", this.tileset);
        this.wallsLayer.setCollisionByProperty({collides: true});

        this.physics.world.bounds.setTo(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        
        // Videos
        this.videoScale = 0.75;
        this.video1 = this.add.video(centerX, 0, 'stunLocking').setOrigin(0.5, 0).setScale(this.videoScale, this.videoScale);
        this.video2 = this.add.video(centerX + screenWidth, 0, 'meleeKnife').setOrigin(0.5, 0).setScale(this.videoScale, this.videoScale);
        this.video3 = this.add.video(centerX + 2*screenWidth, 0, 'orbDouble').setOrigin(0.5, 0).setScale(this.videoScale, this.videoScale);
        this.video4 = this.add.video(centerX + 3*screenWidth, 0, 'weaponMines').setOrigin(0.5, 0).setScale(this.videoScale, this.videoScale);
        this.video5 = this.add.video(centerX + 4*screenWidth, 0, 'cKnifeChain').setOrigin(0.5, 0).setScale(this.videoScale, this.videoScale);
        this.video6 = this.add.video(centerX + 5*screenWidth, 0, 'shootBlockShoot').setOrigin(0.5, 0).setScale(this.videoScale, this.videoScale);
        // this.video7 = this.add.video(centerX + 6*screenWidth, 0, 'cKnifeChain').setOrigin(0.5, 0).setScale(this.videoScale, this.videoScale);

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
        
        this.loadingText.destroy();
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
                    if(player.currentRoom == 0) {
                        this.video1.play(true);
                        this.video2.stop();
                        this.video3.stop();
                        this.video4.stop();
                        this.video5.stop();
                        this.video6.stop();
                        // this.video7.stop();
                    }
                    if(player.currentRoom == 1) {
                        this.video1.stop();
                        this.video2.play(true);
                        this.video3.stop();
                        this.video4.stop();
                        this.video5.stop();
                        this.video6.stop();
                        // this.video7.stop();
                    }
                    if(player.currentRoom == 2) {
                        this.video1.stop();
                        this.video2.stop();
                        this.video3.play(true);
                        this.video4.stop();
                        this.video5.stop();
                        this.video6.stop();
                        // this.video7.stop();
                    }
                    if(player.currentRoom == 3) {
                        this.video1.stop();
                        this.video2.stop();
                        this.video3.stop();
                        this.video4.play(true);
                        this.video5.stop();
                        this.video6.stop();
                        // this.video7.stop();
                    }
                    if(player.currentRoom == 4) {
                        this.video1.stop();
                        this.video2.stop();
                        this.video3.stop();
                        this.video4.stop();
                        this.video5.play(true);
                        this.video6.stop();
                        // this.video7.stop();
                    }
                    if(player.currentRoom == 5) {
                        this.video1.stop();
                        this.video2.stop();
                        this.video3.stop();
                        this.video4.stop();
                        this.video5.stop();
                        this.video6.play(true);
                        // this.video7.stop();
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

}