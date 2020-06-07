class Tutorial extends Phaser.Scene {
    constructor() {
        super('tutorialScene');
    }

    create() {
        this.sceneKey = 'tutorialScene';
        currScene = this.sceneKey;

        this.canContinue = true;
        this.room2Spawned = false;
        this.room3Spawned = false;
        this.room4Spawned = false;
        this.room5Spawned = false;

        this.physics.world.debugGraphic.setAlpha(0);

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

        this.physics.world.bounds.setTo(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        
        this.rooms = [];
        //this.currentRoom = 1;
        
        this.map.findObject('MainObjects', function(object) {
            // rooms
            if (object.type === 'Room') {
                this.rooms.push(object);
            }
            
        }, this);

        // Initialize play objects ----------------------------------------------------------------------------------------------------

        // Pointer
        pointer = this.input.activePointer;

        
        this.map.findObject('MainObjects', function(object) {
            // Doors
            if(object.name === 'Door1_2') {
                // Door(scene, oSpawnX, oSpawnY, isOpen)
                this.door1_2 = new Door(this, object.x, object.y, false);
            }
            if(object.name === 'Door2_3') {
                this.door2_3 = new Door(this, object.x, object.y, false);
            }
            if(object.name === 'Door3_4') {
                this.door3_4 = new Door(this, object.x, object.y, false);
            }
            if(object.name === 'Door4_5') {
                this.door4_5 = new Door(this, object.x, object.y, false);
            }
            if(object.name === 'Door5_end') {
                this.door5_end = new Door(this, object.x, object.y, false);
            }
            if (object.name === 'Player') {
                player = new Player(this, game.scene.keys.hudScene, object.x, object.y);
                player.canUseCorruption = false;
            }
            if (object.name === 'End') {
                this.endpoint = new Endpoint(this, object.x, object.y, "gameOverScene", "x");
            }
        }, this);

        // ColorGroup(scene, state)
        this.redGroup = new ObsColorGroup(this, 0);
        this.blueGroup = new ObsColorGroup(this, 1);
        

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
        
        // Tutorial
        tutorialNum = 0;
        inTutorial = true;

        // Dev tool
        // this.input.keyboard.on('keydown-ZERO', function () {
        //     tutorialNum = 4;
        // }, this);

        this.canContinue = false;
        this.time.delayedCall(200, () => {
            game.scene.keys.hudScene.tutorialText.setAlpha(1);
            game.scene.keys.hudScene.buttonPromt.setAlpha(1);
            game.scene.keys.hudScene.textBox.setAlpha(0.8);
            this.canContinue = true;
        }, null, this);

        this.objectiveFadeIn = this.tweens.add( {
            targets: game.scene.keys.hudScene.objectiveText,
            alpha: { from: 0, to: 1},
            ease: 'Quart.easeIn',
            duration: 500,
            paused: true,
        });
        

        // Progress tutorial text
        this.input.keyboard.on('keydown-SPACE', function () {
            if(this.canContinue) {
                tutorialNum++;
                if(tutorialNum == 1) {
                    this.fadeOutInText("I'll have to leave this cave to continue razing the old world and shaping the Void Frontier.");
                }
                if(tutorialNum == 2) {
                    this.fadeOutInText("SHIFTING between the realms to navigate these old world remnants will have to do for now.");
                    this.canContinue = false;
                    this.door1_2.toggleOpen();
                    // Highlight right room door
                    game.scene.keys.hudScene.highlightHudElement(screenWidth - 40, centerY - 50, 40, 100, 500);
                    this.moveShiftObjective = true;
                    this.objectiveFadeIn.play();
                }
                if(tutorialNum == 3) {
                    this.fadeOutInText("I'll make good use of these docile void corrupted slimes.");
                    this.canContinue = false;
                    pStats.knifeThrown = 0;
                    pStats.orbShot = 0;
                    this.shootingObjective = true;
                    this.objectiveFadeIn.play();
                }
                if(tutorialNum == 4) {
                    this.fadeOutInText("While not shooting, I'm able to focus on my weapons in the MELEE form.");
                }
                if(tutorialNum == 5) {
                    this.fadeOutInText("MELEE weapons paralyze their fragile minds with visions of the void.");
                    this.canContinue = false;
                    pStats.knifeStabbed = 0;
                    pStats.orbEnemyBlock = 0;
                    this.idleWeaponObjective = true;
                    this.objectiveFadeIn.play();
                }
                if(tutorialNum == 6) {
                    this.fadeOutInText("MELEE weapons nullify their desperate projectile attacks.");
                    this.canContinue = false;
                    pStats.knifeBulletBlock = 0;
                    pStats.orbBulletBlock = 0;
                    this.blockProjectileObjective = true;
                    this.objectiveFadeIn.play();
                }
                if(tutorialNum == 7) {
                    this.fadeOutInText("With such a juicy assortment of minions, I must gather CORRUPTION.");
                }
                if(tutorialNum == 8) {
                    this.fadeOutInText("With my knife, I can easily extract CORRUPTION from corporeal beings.");
                }
                if(tutorialNum == 9) {
                    this.fadeOutInText("With my orb, I'll have to use the MELEE form to siphon the CORRUPTION from their soul.");
                }
                if(tutorialNum == 10) {
                    this.fadeOutInText("Their projectile attacks are distilled into CORRUPTION with MELEE weapons.");
                }
                if(tutorialNum == 11) {
                    this.fadeOutInText("CORRUPTION naturally decays, and I cannot hold more than five ESSENSES OF CORRUPTION, so I must harvest regularly.");
                    // Highlight corruption counter
                    game.scene.keys.hudScene.highlightHudElement(centerX - 220, screenHeight - 70, 440, 60, 5000);
                    this.canContinue = false;
                    pStats.corruptionGained = 0;
                    this.corruptionGainObjective = true;
                    this.objectiveFadeIn.play();
                }
                if(tutorialNum == 12) {
                    this.fadeOutInText("Once I have some CORRUPTION, I can SHIFT to ACTIVATE it with the immense void energy of phasing.");
                }
                if(tutorialNum == 13) {
                    this.fadeOutInText("After ACTIVATION, I can deliver a single devestating CORRUPTED attack.");
                }
                if(tutorialNum == 14) {
                    this.fadeOutInText("Unfortunately, ACTIVATION cannot last outside the void's embrace so I must quickly use it.");
                    // Highlight corruption expire bar
                    game.scene.keys.hudScene.highlightHudElement(centerX - 220, screenHeight - 25, 440, 25, 5000);
                }
                if(tutorialNum == 15) {
                    this.fadeOutInText("Dealing CORRUPTED damage fills my heart regeneration. Once fully filled, I regain a void life heart.");
                    // Highlight corruption heal
                    game.scene.keys.hudScene.highlightHudElement(screenWidth - 380, screenHeight - 30, 450, 30, 5000);
                }
                if(tutorialNum == 16) {
                    this.fadeOutInText("The power of CORRUPTION will transform these pathetic realm weapons into lethal tools of the void.");
                    this.canContinue = false;
                    pStats.knifeCorruptedDamage = 0;
                    pStats.orbCorruptedDamage = 0;
                    this.corruptionDamageObjective = true;
                    this.objectiveFadeIn.play();
                }
                if(tutorialNum == 17) {
                    this.fadeOutInText("It seems these slimes haven't been fully corrupted, yet they each have their own method of phasing between realms.");
                    this.canContinue = false;
                }
                if(tutorialNum == 18) {
                    this.fadeOutInText("With CORRUPTION, I will reign supreme in this world in which all have the been touched by the void.");
                    this.canContinue = false;
                    // Highlight right room door
                    game.scene.keys.hudScene.highlightHudElement(screenWidth - 40, centerY - 50, 40, 100, 500);
                }
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

        if(this.moveShiftObjective) {
            this.objectiveTracker("WASD TO MOVE & SHIFT TO PHASE BETWEEN REALMS");
        }
        if(this.shootingObjective) {
            this.objectiveTracker("(LEFTCLICK) Knives shot: " + pStats.knifeThrown + "/8, Orbs shot: " + pStats.orbShot + "/3");
            if(pStats.knifeThrown >= 8 && pStats.orbShot >= 3) {
                this.shootingObjective = false;
                this.objectiveComplete(true);
            }
        }
        if(this.idleWeaponObjective) {
            this.objectiveTracker("(AIM MOUSE TOWARD & WALK CLOSE TO ENEMY) Melee knife hits: " + pStats.knifeStabbed + "/5, Melee orb hits: " + pStats.orbEnemyBlock + "/8");
            if(pStats.knifeStabbed >= 5 && pStats.orbEnemyBlock >= 8) {
                this.idleWeaponObjective = false;
                this.objectiveComplete(false);
                this.door2_3.toggleOpen();
                // Highlight right room door
                game.scene.keys.hudScene.highlightHudElement(screenWidth - 40, centerY - 50, 40, 100, 500);
            }
        }
        if(this.blockProjectileObjective) {
            this.objectiveTracker("(POSITON MELEE WEAPON IN PROJECTILE PATH) Red projectiles blocked: " + pStats.knifeBulletBlock + "/3, Blue projectiles blocked: " + pStats.orbBulletBlock + "/3");
            if(pStats.knifeBulletBlock >= 3 && pStats.orbBulletBlock >= 3) {
                this.blockProjectileObjective = false;
                this.objectiveComplete(false);
                this.door3_4.toggleOpen();
                // Highlight right room door
                game.scene.keys.hudScene.highlightHudElement(screenWidth - 40, centerY - 50, 40, 100, 500);
            }
        }
        if(this.corruptionGainObjective) {
            this.objectiveTracker("(DAMAGE WITH KNIFE, BLOCK WITH ORB, BLOCK PROJECTILES WITH MELEE) Corruption gained: " + pStats.corruptionGained + "/20");
            if(pStats.corruptionGained >= 20) {
                this.corruptionGainObjective = false;
                this.objectiveComplete(true);
            }
        }
        if(this.corruptionDamageObjective) {
            this.objectiveTracker("(GAIN CORRUPTION, SHIFT, ATTACK) Corrupted knife damage: " + pStats.knifeCorruptedDamage + "/20, Corrupted orb damage: " + pStats.orbCorruptedDamage + "/30");
            if(pStats.knifeCorruptedDamage >= 20 && pStats.orbCorruptedDamage >= 30) {
                this.corruptionDamageObjective = false;
                this.objectiveComplete(false);
                this.door4_5.toggleOpen();
                // Highlight right room door
                game.scene.keys.hudScene.highlightHudElement(screenWidth - 40, centerY - 50, 40, 100, 500);
            }
        }
        if(this.changingEnemiesObjective) {
            this.objectiveTracker("(KILL SLIMES) Enemies killed: " + pStats.enemiesKilled + "/3");
            if(pStats.enemiesKilled >= 3) {
                this.door5_end.toggleOpen();
                this.changingEnemiesObjective = false;
                this.objectiveComplete(true);
            }
        }

        if (player.roomChange) {
            this.cameras.main.fadeOut(250, 0, 0, 0, function(camera, progress) {
                player.canMove = false;
                if (progress === 1) {
                    if(!this.room2Spawned && player.currentRoom == 1) {
                        this.canContinue = true;
                        this.spawnEnemies2();
                        this.moveShiftObjective = false;
                        this.objectiveComplete(true);
                    }
                    if(!this.room3Spawned && player.currentRoom == 2) {
                        this.canContinue = true;
                        this.spawnEnemies3();
                    }
                    if(!this.room4Spawned && player.currentRoom == 3) {
                        this.canContinue = true;
                        this.spawnEnemies4();
                        player.canUseCorruption = true;
                    }
                    if(!this.room5Spawned && player.currentRoom == 4) {
                        this.canContinue = true;
                        this.objectiveFadeIn.play();
                        this.changingEnemiesObjective = true;
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

        if(this.canContinue) {
            game.scene.keys.hudScene.buttonPromt.setAlpha(1);
        } else {
            game.scene.keys.hudScene.buttonPromt.setAlpha(0);
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
        let tutorialConfig = {
            fontFamily: 'Courier',
            fontSize: '25px',
            color: '#000000',
            stroke: '#8B008B',
            strokeThickness: 1,
            align: 'center',
            padding: {
                top: 10,
                bottom: 10,
                left: 0,
                right: 0,
            },
            wordWrap: {
                width: screenWidth,
                useAdvancedWrap: true,
            }
        }
        this.map.findObject('Spawns5', function(object) {
            if (object.name === 'Slime5_1') {
                //addChaser(spawnX, spawnY, changeCondition, redGroup, blueGroup)
                this.blueEnemyGroup.addChaser(object.x, object.y, "timed", this.redEnemyGroup, this.blueEnemyGroup);
                this.add.text(object.x, object.y - 105, 'Timer', tutorialConfig).setOrigin(0.5, 0);
            }
            if (object.name === 'Slime5_2') {
                this.redEnemyGroup.addChaser(object.x, object.y, "damaged", this.redEnemyGroup, this.blueEnemyGroup);
                this.add.text(object.x, object.y - 105, 'Damage', tutorialConfig).setOrigin(0.5, 0);
            }
            if (object.name === 'Slime5_3') {
                this.blueEnemyGroup.addChaser(object.x, object.y, "mirror", this.redEnemyGroup, this.blueEnemyGroup);
                this.add.text(object.x, object.y - 105, 'Mirror', tutorialConfig).setOrigin(0.5, 0);        
            }
        }, this);
    }

    fadeOutInText(string) {
        this.tweens.add( {
            targets: game.scene.keys.hudScene.tutorialText,
            alpha: { from: 1, to: 0},
            ease: 'Quart.easeOut',
            duration: 250,
            onComplete: function() {
                game.scene.keys.hudScene.tutorialText.setText(string);
                this.tweens.add( {
                    targets: game.scene.keys.hudScene.tutorialText,
                    alpha: { from: 0, to: 1},
                    ease: 'Quart.easeIn',
                    duration: 250,
                });
            },
            onCompleteScope: this
        });
    }

    objectiveTracker(string) {
        game.scene.keys.hudScene.objectiveText.setAlpha(1);
        game.scene.keys.hudScene.objectiveText.setText(string);
    }

    objectiveComplete(canContinue) {
        this.tweens.add( {
            targets: game.scene.keys.hudScene.objectiveText,
            alpha: { from: 1, to: 0},
            ease: 'Quart.easeOut',
            duration: 500,
            onComplete: function() {
                this.canContinue = canContinue;
            },
            onCompleteScope: this
        });
    }
}