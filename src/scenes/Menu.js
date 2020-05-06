class Menu extends Phaser.Scene {
    constructor() {
        super('menuScene');
    }

    create() {
        keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyJump = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keySlowmo = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        keyStart = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        keyMute = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);

        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '100px',
            color: '#FF00FF',
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

    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyStart)) {
            this.sound.play('buttonsound');
            this.scene.run('playScene');
        }
    }
}