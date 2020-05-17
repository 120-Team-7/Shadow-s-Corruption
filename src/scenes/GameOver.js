class GameOver extends Phaser.Scene {
    constructor() {
        super('gameOverScene');
    }

    create() {

        keyStart = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);


        let gameOverConfig = {
            fontFamily: 'Courier',
            fontSize: '40px',
            color: '#FFFFFF',
            // strokeThickness: 5,
            // stroke: '#4682B4',
            align: 'center',
            padding: {
                top: 10,
                bottom: 10,
                left: 10,
                right: 10,
            },
            fixedWidth: 0
        }

        // Add text
        this.add.text(centerX, centerY, 'You died!', gameOverConfig).setOrigin(0.5, 0.5);
        this.add.text(centerX, centerY + textSpacer, 'Press ENTER to return to menu', gameOverConfig).setOrigin(0.5, 0.5);

        isPaused = true;

    }

    update() {
        // Input to return to menu
        if (Phaser.Input.Keyboard.JustDown(keyStart)) {
            // this.sound.play('buttonsound');
            this.scene.start('menuScene');
        }
    }
}