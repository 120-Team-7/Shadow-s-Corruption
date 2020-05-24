class Menu extends Phaser.Scene {
    constructor() {
        super('menuScene');
    }

    create() {
        keyStart = this.input.keyboard.addKey('ENTER');
        keyInstructions = this.input.keyboard.addKey('I');
        keyMute = this.input.keyboard.addKey('M');

        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '100px',
            color: '#FFFFFF',
            align: 'center',
            padding: {
                top: 10,
                bottom: 10,
                left: 10,
                right: 10,
            },
            fixedWidth: 0
        }

        let scene = this;

        // Add menu screen text
        this.add.text(centerX, centerY - textSpacer, 'Specter Shift', menuConfig).setOrigin(0.5, 0.5);
        menuConfig.fontSize = '35px';
        this.add.text(centerX, centerY + textSpacer, 'Press I for controls', menuConfig).setOrigin(0.5, 0.5);
        this.difficultyText = this.add.text(centerX, centerY + 2*textSpacer, 'Press DOWN ARROW for EASY, Press UP ARROW for NORMAL', menuConfig).setOrigin(0.5, 0.5);
        this.add.text(centerX, centerY + 3*textSpacer, 'Press ENTER to start', menuConfig).setOrigin(0.5, 0.5);

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
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyInstructions) && isPaused) {
            this.scene.setVisible(false, 'menuScene');
            this.scene.run('instructionsScene');
        }

        if (Phaser.Input.Keyboard.JustDown(keyStart)) {
            this.scene.setVisible(false, 'menuScene');
            if(isGameOver) {
                this.scene.stop('instructionsScene');
                this.scene.run('playScene');
                this.scene.run('hudScene');
                isGameOver = false;
                pCurrHealth = pMaxHealth;
                corruption = 0;
                isInvuln = false;
                usingCorruption = false;
            } else if(isPaused) {
                isPaused = false;
                this.scene.stop('instructionsScene');
                this.scene.run('playScene');
                this.scene.run('hudScene');
                this.scene.setVisible(true, 'playScene');
                this.scene.setVisible(true, 'hudScene');
            }
        }

        if (Phaser.Input.Keyboard.JustDown(keyMute)) {
            if(game.sound.mute == false){
                game.sound.mute = true;
            } else {
                game.sound.mute = false;
            }
        }
    }
}