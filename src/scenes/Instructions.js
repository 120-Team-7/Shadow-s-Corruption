class Instructions extends Phaser.Scene {
    constructor() {
        super('instructionsScene');
    }

    create() {
        keyInstructions = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);

        this.cameras.main.setBackgroundColor('#000000');

        let instructionsConfig = {
            fontFamily: 'Courier',
            fontSize: '40px',
            color: '#8B008B',
            stroke: '#000000',
            strokeThickness: 10,
            align: 'center',
            padding: {
                top: 15,
                bottom: 15,
                left: 10,
                right: 10,
            },
            fixedWidth: 0,
            wordWrap: {
                width: screenWidth - 30,
                useAdvancedWrap: true,
            }
        }

        // Images
        // this.titleSplash = this.add.sprite(0, 0, 'titleSplash').setOrigin(0, 0).setAlpha(0.3);
        // Red
        this.redPlayerImage = this.add.sprite(centerX - 50, imagesY, 'redPlayer').setOrigin(0.5, 0.5).setFlipX(true);
        this.knifeImage = this.add.sprite(centerX - (50 + idleWeaponDistance), imagesY, 'knife').setOrigin(0.5, 0.5).setFlipX(true);
        this.corruptKnifeImage = this.add.sprite(screenWidth/4 - 20, imagesY, 'corruptKnife').setOrigin(0.5, 0.5).setFlipX(true);
        this.redEnemy = this.add.sprite(50, imagesY, 'redChaser').setOrigin(0.5, 0.5).setFlipX(true);
        // Blue
        this.bluePlayerImage = this.add.sprite(centerX + 50, imagesY, 'bluePlayer').setOrigin(0.5, 0.5);
        this.orbImage = this.add.sprite(centerX + (50 + idleWeaponDistance), imagesY, 'orb').setOrigin(0.5, 0.5);
        this.corruptOrbImage = this.add.sprite(3*screenWidth/4 + 20, imagesY, 'corruptOrb').setOrigin(0.5, 0.5);
        this.blueEnemy = this.add.sprite(screenWidth - 50, imagesY, 'blueChaser').setOrigin(0.5, 0.5);

        // Text
        this.instructionText = this.add.text(centerX, centerY - 2*textSpacer, 'WASD to move', instructionsConfig).setOrigin(0.5, 0.5);
        this.instructionText = this.add.text(centerX, centerY - textSpacer, 'SHIFT to change color state & equipped weapon', instructionsConfig).setOrigin(0.5, 0.5);
        this.instructionText = this.add.text(centerX, centerY, 'MOUSE to aim, LEFT MOUSE BUTTON to shoot', instructionsConfig).setOrigin(0.5, 0.5);

        // Phaser.GameObjects.Text.advancedWordWrap(this.instructionText, this, screenWidth - 20);
        // Red
        instructionsConfig.color = '#FF0000';
        instructionsConfig.fontSize = '70px';
        this.add.text(300, 60, 'Red State', instructionsConfig).setOrigin(0.5, 0.5);
        // Blue
        instructionsConfig.color = '#0000FF';
        this.add.text(screenWidth - 300, 60, 'Blue State', instructionsConfig).setOrigin(0.5, 0.5);
        // White bottom
        instructionsConfig.color = '#000000';
        instructionsConfig.fontSize = '40px';
        this.add.text(centerX, screenHeight - 80, 'Press I to return to menu, ESC or ENTER to pause during play, M to toggle mute, K to reset', instructionsConfig).setOrigin(0.5, 0.5);

    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyInstructions)) {
            this.scene.stop('instructionsScene');
            this.scene.run('menuScene');
        }
    }
}