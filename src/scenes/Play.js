class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }


    create() {

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
        this.cameras.main.setBackgroundColor('#696969');

        // Create player
        // Player(scene, pSpawnX, pSpawnY, state, health)
        this.player = new Player(this, centerX - 100, centerY);
        
        this.redGroup = new ColorGroup(this, 0);
        this.redGroup.addObstacle(centerX + 100, centerY);

        this.blueGroup = new ColorGroup(this, 1);
        this.blueGroup.addObstacle(centerX - 200, centerY + 200);
        // HUD boxes ---------------------------------------------------------------------------------
        // this.add.rectangle(centerX, centerY, gameWidth, centerY, 0x808080).setOrigin(0.5,0.5);
        // this.add.rectangle(centerX, playHUDY, gameWidth - 20, playHUDHeight - 20, 0xC0C0C0).setOrigin(0.5,0.5);
        
    }

    update() {
        this.player.update();
        

        if (Phaser.Input.Keyboard.JustDown(keyStart)) {
            // this.sound.play('buttonsound');
            this.scene.run('playScene');
        }
    }
}