class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }

    create() {
        keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyJump = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keySlowmo = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        keyStart = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        keyMute = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);

        let playConfig = {
            fontFamily: 'Courier',
            fontSize: '40px',
            color: '#00000',
            align: 'center',
            padding: {
                top: 10,
                bottom: 10,
                left: 10,
                right: 10,
            },
            fixedWidth: 0
        }

        // Create player
        player = this.physics.add.sprite(centerX, centerY, 'player').setOrigin(0.5, 0.5);
        player.setCollideWorldBounds(true);
        
        // HUD boxes ---------------------------------------------------------------------------------
        this.add.rectangle(centerX, centerY, gameWidth, centerY, 0x808080).setOrigin(0.5,0.5);
        // this.add.rectangle(centerX, playHUDY, gameWidth - 20, playHUDHeight - 20, 0xC0C0C0).setOrigin(0.5,0.5);
        
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyStart)) {
            this.sound.play('buttonsound');
            this.scene.run('playScene');
        }
    }
}