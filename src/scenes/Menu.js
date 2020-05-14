class Menu extends Phaser.Scene {
    constructor() {
        super('menuScene');
    }

    create() {
        keyStart = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        keyInstructions = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);

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
        // add menu screen text

        this.add.text(centerX, centerY - textSpacer, 'Switch', menuConfig).setOrigin(0.5, 0.5);
        menuConfig.fontSize = '40px';
        this.add.text(centerX, centerY + textSpacer, 'Press I for instructions', menuConfig).setOrigin(0.5, 0.5);
        this.add.text(centerX, centerY + 2*textSpacer, 'Press ENTER to start', menuConfig).setOrigin(0.5, 0.5);

    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyInstructions)) {
            // this.sound.play('buttonsound');
            this.scene.start('instructionsScene');
        }

        if (Phaser.Input.Keyboard.JustDown(keyStart)) {
            // this.sound.play('buttonsound');
            this.scene.stop('menuScene');
            this.scene.run('playScene');
            this.scene.run('hudScene');
            isGameOver = false;
            pCurrHealth = pMaxHealth;
            corruption = 0;
            isInvuln = false;
        }
    }
}