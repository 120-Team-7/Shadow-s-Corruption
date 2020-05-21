class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }


    create() {
        keyStart = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);


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
                left: 10,
                right: 10,
            },
            fixedWidth: screenWidth,
            wordWrap: {
                width: screenWidth,
                useAdvancedWrap: true,
            }
        }
        this.cameras.main.setBackgroundColor('#696969');



        // Initialize play objects ----------------------------------------------------------------------------------------------------
        
        // Pointer
        pointer = this.input.activePointer;

        // Player(scene, pSpawnX, pSpawnY, redObjGroup, blueObjGroup)
        player = new Player(this, game.scene.keys.hudScene, centerX, centerY);

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
        
        // Add obstacles
        this.redGroup.addObstacle(centerX, centerY + 200);
        this.redGroup.addObstacle(centerX + 200, centerY);
        this.redGroup.addObstacle(centerX - 200, centerY - 200);
        this.redGroup.addObstacle(centerX, centerY - 200);
        this.redGroup.addObstacle(centerX - 200, centerY);
        this.redGroup.addObstacle(centerX + 200, centerY + 200);
        this.redGroup.addObstacle(centerX - 200, centerY + 200);
        this.redGroup.addObstacle(centerX + 200, centerY - 200);

        // Tutorial text

        this.tutorialText = this.add.text(centerX, 0, 'Press Y to continue with the tutorial or N to skip it and start infinite enemy spawner', playConfig).setOrigin(0.5, 0);
        this.tutorialNum = 0;

        this.input.keyboard.on('keydown-Y', function () {
            if(!this.scene.spawnedEnemies) {
                inTutorial = true;
                isInvuln = true;
                this.scene.tutorialNum++; 
                if(this.scene.tutorialNum == 1) {
                    this.scene.tutorialText.setText("You are trapped by RED obstacles. Because you are RED, RED objects collide with you. Press WASD to move. (Y)");
                }
                if(this.scene.tutorialNum == 2) {
                    this.scene.tutorialText.setText("Press SHIFT to change your color state between RED and BLUE. When you are BLUE, RED objects cannot collide with you, but BLUE objects can collide with you. Try moving through the RED obstacles. (Y)");
                }
                if(this.scene.tutorialNum == 3) {
                    this.scene.tutorialText.setText("RED collides with RED, BLUE collides with BLUE, and OPPOSITES pass through. Try freely moving through the obstacles by SHIFTING at the right time. Notice that SHIFTING has a cooldown. (Y)");
                    this.scene.redGroup.clear(true, true);
                    this.scene.blueGroup.clear(true, true);
                    this.scene.redGroup.addObstacle(centerX, centerY - 100);
                    this.scene.redGroup.addObstacle(centerX - 400, centerY - 100);
                    this.scene.redGroup.addObstacle(centerX + 400, centerY - 100);
                    this.scene.redGroup.addObstacle(centerX - 200, centerY + 100);
                    this.scene.redGroup.addObstacle(centerX + 200, centerY + 100);

                    this.scene.blueGroup.addObstacle(centerX, centerY + 100);
                    this.scene.blueGroup.addObstacle(centerX - 200, centerY - 100);
                    this.scene.blueGroup.addObstacle(centerX + 200, centerY - 100);
                    this.scene.blueGroup.addObstacle(centerX - 400, centerY + 100);
                    this.scene.blueGroup.addObstacle(centerX + 400, centerY + 100);
                }
                if(this.scene.tutorialNum == 4) {
                    this.scene.tutorialText.setText("While your body is RED, you have the RED KNIFE equppied. Use the MOUSE to aim and press the LEFT MOUSE BUTTON to rapidly shoot them. (Y)");
                    this.scene.redGroup.clear(true, true);
                    this.scene.blueGroup.clear(true, true);
                    // EnemyColorGroup.addDummy(spawnX, spawnY, redGroup, blueGroup, redBulletGroup, blueBulletGroup, isShooter, shotX, shotY)
                    this.scene.rDummy1 = this.scene.redEnemyGroup.addDummy(centerX - 50, centerY + 100, this.scene.redEnemyGroup, this.scene.blueEnemyGroup, this.scene.redEnemyBulletGroup, this.scene.blueEnemyBulletGroup, false, 0, 0);
                    this.scene.rDummy2 = this.scene.redEnemyGroup.addDummy(centerX - 50, centerY - 100, this.scene.redEnemyGroup, this.scene.blueEnemyGroup, this.scene.redEnemyBulletGroup, this.scene.blueEnemyBulletGroup, false, 0, 0);
                }
                if(this.scene.tutorialNum == 5) {
                    this.scene.tutorialText.setText("While you are not shooting, your held weapon is in the IDLE form. The IDLE KNIFE can be used to stab close range enemies dealing extra damage and stunning them, but a sucessful hit starts a much longer cooldown than shooting it. (Y)");
                }
                if(this.scene.tutorialNum == 6) {
                    this.scene.tutorialText.setText("While your body is BLUE, you have the BLUE ORB equppied. When shot, it starts a long cooldown, moves slowly, rapidly accelerates, and pierces enemies. The ORB's IDLE form knocksback and stuns enemies it comes into contact with. (Y)");
                    this.scene.bDummy1 = this.scene.blueEnemyGroup.addDummy(centerX + 50, centerY + 100, this.scene.redEnemyGroup, this.scene.blueEnemyGroup, this.scene.redEnemyBulletGroup, this.scene.blueEnemyBulletGroup, false, 0, 0);
                    this.scene.bDummy2 = this.scene.blueEnemyGroup.addDummy(centerX + 50, centerY - 100, this.scene.redEnemyGroup, this.scene.blueEnemyGroup, this.scene.redEnemyBulletGroup, this.scene.blueEnemyBulletGroup, false, 0, 0);
                }
                if(this.scene.tutorialNum == 7) {
                    this.scene.tutorialText.setText("Each IDLE weapon can also block and destroy enemy projectiles of the same color. (Y)");
                    // Replace dummies with shooting dummies
                    this.scene.rDummy3 = this.scene.redEnemyGroup.addDummy(centerX - 50, centerY, this.scene.redEnemyGroup, this.scene.blueEnemyGroup, this.scene.redEnemyBulletGroup, this.scene.blueEnemyBulletGroup, true, -1, 0);

                    this.scene.bDummy3 = this.scene.blueEnemyGroup.addDummy(centerX + 50, centerY, this.scene.redEnemyGroup, this.scene.blueEnemyGroup, this.scene.redEnemyBulletGroup, this.scene.blueEnemyBulletGroup, true, 1, 0);
                }
                if(this.scene.tutorialNum == 8) {
                    this.scene.tutorialText.setText("Each weapon type has strengths and weaknesses. Both them can only be use on enemies of the weapon's corresponding color. The RED KNIFE is better offensively and against single enemies, but the BLUE orb is better defensively and against many targets. (Y)");
                }
                if(this.scene.tutorialNum == 9) {
                    this.scene.tutorialText.setText("CORRUPTION is an important mechanic that greatly increases your offensive power and allows you to quickly kill swarms of tough enemies. Notice the CORRUPTION counter on the bottom of the screen. (Y)");
                }
                if(this.scene.tutorialNum == 10) {
                    this.scene.tutorialText.setText("Gain CORRUPTION by dealing damage with the RED KNIFE, blocking enemies with the BLUE ORB, or blocking projectiles with an IDLE weapon. Once you have some CORRUPTION, SHIFT to ACTIVATE it and empower your NEXT SHOT with additional damage based on your CORRUPTION. (Y)");
                }
                if(this.scene.tutorialNum == 11) {
                    this.scene.tutorialText.setText("CORRUPTION decreases by 1 every second while not ACTIVATED. While ACTIVATED, use the empowered CORRUPT KNIFE or CORRUPT ORB before the EXPIRE time when CORRUPTION is set back 0. Upon using the CORRUPTION SHOT corruption is set to 0. (Y)");
                }
                if(this.scene.tutorialNum == 12) {
                    this.scene.tutorialText.setText("In order to survive, you must build up and use your CORRUPTION as quickly and often as you can. However, don't forget that SHIFTING leaves you vulnerable to enemies of the color you switch to. (Y)");
                }
                if(this.scene.tutorialNum == 13) {
                    this.scene.tutorialText.setText("Remember use CORRUPTION to quickly kill enemies before they SHIFT their own color state and overwhelm you! If you are in danger, remember that SHIFTING makes you immune to enemies of the color you shifted away from! Press (N) to spawn enemies.");
                }
            }
        });

        // Remove tutorial items and start infinite enemy spawner
        this.input.keyboard.on('keydown-N', function () {
            if(!this.scene.spawnedEnemies) {
                inTutorial = false;
                isInvuln = false;
                this.scene.spawnedEnemies = true;
                this.scene.tutorialText.destroy();
                this.scene.redGroup.clear(true, true);
                this.scene.blueGroup.clear(true, true);
                this.scene.redEnemyGroup.clear(true, true);
                this.scene.blueEnemyGroup.clear(true, true);

                this.scene.spawnEnemies();
                this.scene.infiniteEnemySpawner = this.scene.time.addEvent({
                    delay: infiniteSpawnerDelay,
                    callback: () => {
                        this.scene.spawnEnemies();
                    },
                    callbackContext: this.scene,
                    loop: true,
                });
            }
        });
        
    }

    update() {
        // console.log(game.scene.keys.hudScene);

        pointer = this.input.activePointer;
        player.update();
        this.knifeGroup.update();
        this.orbGroup.update();
        this.redEnemyGroup.update();
        this.blueEnemyGroup.update();
        this.redEnemyBulletGroup.update();
        this.blueEnemyBulletGroup.update();

        // console.log(player);

        if (Phaser.Input.Keyboard.JustDown(keyStart)) {
            isPaused = true;
            this.scene.pause('playScene');
            this.scene.pause('hudScene');
            this.scene.setVisible(false, 'playScene');
            this.scene.setVisible(false, 'hudScene');
            this.scene.run('menuScene');
            this.scene.setVisible(true, 'menuScene');
        }
    }

    spawnEnemies(){
        let screenBuffer = 20;
        let randNum1 = Math.random();
        let randNum2 = Math.random();
        let randNum3 = Math.random();
        let randNum4 = Math.random();
        let randChange1 = Math.random();
        let randChange2 = Math.random();
        let randChange3 = Math.random();
        if(randNum3 < 0.5) {
            this.rSpawnX = screenWidth - screenBuffer;
            this.bSpawnX = screenBuffer;
        } else {
            this.rSpawnX = screenBuffer;
            this.bSpawnX = screenWidth - screenBuffer;
        }
        if(randNum4 < 0.5) {
            this.rSpawnY = screenHeight - screenBuffer;
            this.bSpawnY = screenBuffer;
        } else {
            this.rSpawnY = screenBuffer;
            this.bSpawnY = screenHeight - screenBuffer;
        }
        if(randNum1 < 0.5){
            this.randSpawnX = screenWidth - screenBuffer;
        } else {
            this.randSpawnX = screenBuffer;
        }
        if(randNum2 < 0.5){
            if(randChange1 < 0.5) {
                // EnemyColorGroup.addShooter(spawnX, spawnY, changeCondition, redGroup, blueGroup, redBulletGroup, blueBulletGroup)
                this.redEnemyGroup.addShooter(this.randSpawnX, centerY, 'timed', this.redEnemyGroup, this.blueEnemyGroup, this.redEnemyBulletGroup, this.blueEnemyBulletGroup);
            } else {
                this.redEnemyGroup.addShooter(this.randSpawnX, centerY, 'damaged', this.redEnemyGroup, this.blueEnemyGroup, this.redEnemyBulletGroup, this.blueEnemyBulletGroup);
            }
        } else {
            if(randChange1 < 0.5) {
                this.blueEnemyGroup.addShooter(this.randSpawnX, centerY, 'timed', this.redEnemyGroup, this.blueEnemyGroup, this.redEnemyBulletGroup, this.blueEnemyBulletGroup);
            } else {
                this.blueEnemyGroup.addShooter(this.randSpawnX, centerY, 'damaged', this.redEnemyGroup, this.blueEnemyGroup, this.redEnemyBulletGroup, this.blueEnemyBulletGroup);
            }
        }
        if(randChange2 < 0.5) {
            // EnemyColorGroup.addChaser(spawnX, spawnY, changeCondition, redGroup, blueGroup)
            this.redEnemyGroup.addChaser(this.rSpawnX, this.rSpawnY, 'timed', this.redEnemyGroup, this.blueEnemyGroup);
        } else {
            this.redEnemyGroup.addChaser(this.rSpawnX, this.rSpawnY, 'damaged', this.redEnemyGroup, this.blueEnemyGroup);
        }
        if(randChange3 < 0.5) {
            this.blueEnemyGroup.addChaser(this.bSpawnX, this.bSpawnY, 'timed', this.redEnemyGroup, this.blueEnemyGroup);
        } else {
            this.blueEnemyGroup.addChaser(this.bSpawnX, this.bSpawnY, 'damaged', this.redEnemyGroup, this.blueEnemyGroup);
        }
    }
}