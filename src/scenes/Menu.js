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
            color: '#8B008B',
            stroke: '#000000',
            strokeThickness: 10,
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

        this.titleSplash = this.add.sprite(0, 0, 'titleSplash').setOrigin(0, 0).setAlpha(0.5);
        this.title = this.add.sprite(centerX, 20, 'title').setOrigin(0.5, 0);
        this.shadowBackground = this.add.sprite(0, 0, 'shadowBackground').setOrigin(0, 0).setAlpha(0).setDepth(10000);

        // Add menu screen text
        // this.add.text(centerX, 50, "Shadow's Corruption", menuConfig).setOrigin(0.5, 0.5);
        menuConfig.fontSize = '35px';
        this.add.text(centerX, centerY, 'Press I for controls', menuConfig).setOrigin(0.5, 0.5);
        this.difficultyText = this.add.text(centerX, centerY + textSpacer, 'Press DOWN ARROW for EASY, Press UP ARROW for NORMAL', menuConfig).setOrigin(0.5, 0.5);
        this.tutorialSelect = this.add.text(centerX, centerY + 2*textSpacer, 'Tutorial: press 1', menuConfig).setOrigin(0.5, 0.5);
        this.playSelect = this.add.text(centerX, centerY + 3*textSpacer, 'Play: press 2', menuConfig).setOrigin(0.5, 0.5);
        this.arenaSelect = this.add.text(centerX, centerY + 4*textSpacer, 'Arena: press 3', menuConfig).setOrigin(0.5, 0.5);
        this.startText = this.add.text(centerX, centerY + 5*textSpacer, 'Press ENTER to start selected', menuConfig).setOrigin(0.5, 0.5);

        this.input.keyboard.on('keydown-UP', function () {
            chaserConfig.health = 10;
            shooterConfig.health = 10;
            scene.difficultyText.setText('Press DOWN ARROW for EASY, Press UP ARROW for [NORMAL]')
        });
        this.input.keyboard.on('keydown-DOWN', function () {
            chaserConfig.health = 5;
            shooterConfig.health = 5;
            scene.difficultyText.setText('Press DOWN ARROW for [EASY], Press UP ARROW for NORMAL')
        });

        this.input.keyboard.on('keydown-ONE', function () {
            if(isGameOver || isPaused) {
                if(currScene != 'tutorialScene') {
                    nextScene = 'tutorialScene';
                }
                this.tutorialSelect.setText('[Tutorial]: press 1');
                this.playSelect.setText('Play: press 2');
                this.arenaSelect.setText('Arena: press 3');
            }
        }, this);

        this.input.keyboard.on('keydown-TWO', function () {
            if(isGameOver || isPaused) {
                if(currScene != 'playScene') {
                    nextScene = 'playScene';
                }
                this.tutorialSelect.setText('Tutorial: press 1');
                this.playSelect.setText('[Play]: press 2');
                this.arenaSelect.setText('Arena: press 3');
            }
        }, this);

        this.input.keyboard.on('keydown-THREE', function () {
            if(isGameOver || isPaused) {
                if(currScene != 'arenaScene') {
                    nextScene = 'arenaScene';
                }
                this.tutorialSelect.setText('Tutorial: press 1');
                this.playSelect.setText('Play: press 2');
                this.arenaSelect.setText('[Arena]: press 3');
            }
        }, this);

        this.cameras.main.fadeIn(2000, 0, 0, 0);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.keyInstructions)) {
            this.scene.run('instructionsScene');
            this.scene.pause('menuScene');
            this.scene.bringToTop('instructionsScene');
        }

        if(isPaused) {
            this.shadowBackground.setAlpha(pauseAlpha);
            this.startText.setText("Press ENTER to unpause");
        } else {
            this.shadowBackground.setAlpha(0);
            this.startText.setText("Press ENTER to start");
        }

        if (Phaser.Input.Keyboard.JustDown(this.keyStart) && nextScene != "next") {
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
                this.scene.run('hudScene');
                this.scene.setVisible(true, 'hudScene');
                this.scene.pause('menuScene');
                this.scene.setVisible(false, 'menuScene');

            } else if(isPaused) {
                isPaused = false;
                this.scene.run(currScene);
                this.scene.run('hudScene');
                this.scene.swapPosition('menuScene', currScene);
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