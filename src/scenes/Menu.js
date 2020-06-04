class Menu extends Phaser.Scene {
    constructor() {
        super('menuScene');
    }

    create() {
        this.keyStart = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.keyInstructions = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);
        this.keyMute = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);

        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '100px',
            color: '#000000',
            stroke: '#8B008B',
            strokeThickness: strokeThickness,
            align: 'center',
            padding: {
                top: 10,
                bottom: 10,
                left: 10,
                right: 10,
            },
            fixedWidth: 0,
            wordWrap: {
                width: screenWidth,
                useAdvancedWrap: true,
            }
        }

        let scene = this;
        currScene = null;
        nextScene = "next";
        this.selectingScene = false;

        corruptionParticles = this.add.particles('corruptionParticle');
        // this.titleSplash = this.add.sprite(0, 0, 'titleSplash').setOrigin(0, 0).setAlpha(0.8);
        this.shadowBackground = this.add.sprite(centerX, 0, 'shadowBackground').setOrigin(0.5, 0).setAlpha(0).setScale(0.65, 1);
        this.title = this.add.sprite(centerX, 20, 'title').setOrigin(0.5, 0);

        // Add menu screen text
        menuConfig.fontSize = '35px';
        this.add.text(centerX, centerY, 'Press I for controls', menuConfig).setOrigin(0.5, 0.5);
        this.difficultyText = this.add.text(centerX, centerY + textSpacer, 'Press E for EASY, Press N for NORMAL', menuConfig).setOrigin(0.5, 0.5);
        this.tutorialSelect = this.add.text(centerX, centerY + 2*textSpacer, 'Tutorial: press 1', menuConfig).setOrigin(0.5, 0.5);
        this.playSelect = this.add.text(centerX, centerY + 3*textSpacer, 'Play: press 2', menuConfig).setOrigin(0.5, 0.5);
        this.arenaSelect = this.add.text(centerX, centerY + 4*textSpacer, 'Arena: press 3', menuConfig).setOrigin(0.5, 0.5);
        this.startText = this.add.text(centerX, centerY + 5*textSpacer, 'Press ENTER to start selected', menuConfig).setOrigin(0.5, 0.5);
        this.restartText = this.add.text(centerX, centerY + 3*textSpacer, 'Press R to return to main menu', menuConfig).setOrigin(0.5, 0.5);
        this.selectSceneText = this.add.text(centerX, centerY + 3*textSpacer, 'Level select: press 1', menuConfig).setOrigin(0.5, 0.5);
        this.creditsSceneText = this.add.text(centerX, centerY + 2*textSpacer, 'Credits: press C', menuConfig).setOrigin(0.5, 0.5);

        this.corruptionLeft = corruptionParticles.createEmitter({
            x: -20,
            y: { min: 0, max: screenHeight },
            lifespan: { min: 3000, max: 6000,},
            speedX: { min: 50, max: 130 },
            alpha: { start: 1, end: 0 },
            scale: { start: 0.5, end: 0 },
            quantity: 6,
            frequency: 200,
        });
        this.corruptionRight = corruptionParticles.createEmitter({
            x: screenWidth + 20,
            y: { min: 0, max: screenHeight },
            lifespan: { min: 3000, max: 6000,},
            speedX: { min: -130, max: -50 },
            alpha: { start: 1, end: 0 },
            scale: { start: 0.5, end: 0 },
            quantity: 6,
            frequency: 200,
        });


        this.input.keyboard.on('keydown-N', function () {
            chaserConfig.health = 10;
            shooterConfig.health = 10;
            scene.difficultyText.setText('Press E for EASY, Press N for [NORMAL]')
        });
        this.input.keyboard.on('keydown-E', function () {
            chaserConfig.health = 5;
            shooterConfig.health = 5;
            scene.difficultyText.setText('Press E for [EASY], Press N for NORMAL')
        });

        this.input.keyboard.on('keydown-ONE', function () {
            if(isGameOver) {
                if(!this.selectingScene) {
                    this.selectingScene = true;
                } else {
                    if(currScene != 'tutorialScene') {
                        nextScene = 'tutorialScene';
                    }
                    this.tutorialSelect.setText('[Tutorial]: press 1');
                    this.playSelect.setText('Play: press 2');
                    this.arenaSelect.setText('Arena: press 3');
                }
            }
        }, this);

        this.input.keyboard.on('keydown-TWO', function () {
            if(isGameOver && this.selectingScene) {
                if(currScene != 'playScene') {
                    nextScene = 'playScene';
                }
                this.tutorialSelect.setText('Tutorial: press 1');
                this.playSelect.setText('[Play]: press 2');
                this.arenaSelect.setText('Arena: press 3');
            }
        }, this);

        this.input.keyboard.on('keydown-THREE', function () {
            if(isGameOver && this.selectingScene) {
                if(currScene != 'arenaScene') {
                    nextScene = 'arenaScene';
                }
                this.tutorialSelect.setText('Tutorial: press 1');
                this.playSelect.setText('Play: press 2');
                this.arenaSelect.setText('[Arena]: press 3');
            }
        }, this);

        this.input.keyboard.on('keydown-C', function () {
            if(isGameOver && !this.selectingScene) {
                this.scene.run('creditsScene');
                this.scene.pause('menuScene');
                this.scene.bringToTop('creditsScene');
            }
        }, this);

        this.input.keyboard.on('keydown-R', function () {
            if(isPaused) {
                isPaused = false;
                isGameOver = true;
                pStats.enemiesKilled = 0;
                pStats.orbKilled = 0;
                pStats.knifeKilled = 0;
                pStats.damageDealt = 0;
                pStats.knifeCorruptedDamage = 0; 
                pStats.orbCorruptedDamage = 0; 
                pStats.corruptionGained = 0; 
                pStats.switchNum = 0; 
                pStats.knifeThrown = 0; 
                pStats.knifeStabbed = 0; 
                pStats.knifeBulletBlock = 0; 
                pStats.orbShot = 0; 
                pStats.orbEnemyBlock = 0; 
                pStats.orbBulletBlock = 0;  
                this.scene.stop(currScene);
                this.scene.stop('hudScene');
                this.scene.restart('menuScene');
            }
        }, this);

        this.cameras.main.fadeIn(3000, 0, 0, 0);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.keyInstructions)) {
            this.scene.run('instructionsScene');
            this.scene.pause('menuScene');
            this.scene.bringToTop('instructionsScene');
        }

        if(isPaused) {
            this.selectSceneText.setAlpha(0);
            this.restartText.setAlpha(1);
            this.tutorialSelect.setAlpha(0);
            this.playSelect.setAlpha(0);
            this.arenaSelect.setAlpha(0);
            this.shadowBackground.setAlpha(pauseAlpha);
            this.startText.setText("Press ENTER to unpause");
        } else {
            this.restartText.setAlpha(0);
            this.shadowBackground.setAlpha(0);
            this.startText.setText("Press ENTER to start selected level");
        }
        
        if(isGameOver) {
            if(!this.selectingScene) {
                this.creditsSceneText.setAlpha(1);
                this.selectSceneText.setAlpha(1);
                this.tutorialSelect.setAlpha(0);
                this.playSelect.setAlpha(0);
                this.arenaSelect.setAlpha(0);
            } else {
                this.creditsSceneText.setAlpha(0);
                this.selectSceneText.setAlpha(0);
                this.tutorialSelect.setAlpha(1);
                this.playSelect.setAlpha(1);
                this.arenaSelect.setAlpha(1);
            }
        }

        if (Phaser.Input.Keyboard.JustDown(this.keyStart) && nextScene != "next") {
            this.selectingScene = false;
            this.corruptionRight.remove();
            this.corruptionLeft.remove();
            if(isGameOver && currScene != nextScene) {
                isGameOver = false;
                pCurrHealth = pMaxHealth;
                corruption = 0;
                isInvuln = false;
                usingCorruption = false;
                inTutorial = false;
                player = null;
                pointer = null;

                this.scene.run(nextScene);
                // this.scene.run('hudScene');
                this.scene.setVisible(true, 'hudScene');
                this.scene.pause('menuScene');
                this.scene.setVisible(false, 'menuScene');

            } else if(isPaused) {
                isPaused = false;
                this.scene.swapPosition('menuScene', currScene);
                this.scene.run(currScene);
                this.scene.run('hudScene');
                this.scene.setVisible(true, 'hudScene');
                this.scene.pause('menuScene');
                this.scene.setVisible(false, 'menuScene');
            }
        }

        if (Phaser.Input.Keyboard.JustDown(this.keyMute)) {
            if(game.sound.mute == false){
                game.sound.mute = true;
            } else {
                game.sound.mute = false;
            }
        }
    }
}