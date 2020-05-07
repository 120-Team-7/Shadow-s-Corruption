class HUD extends Phaser.Scene {
    constructor() {
        super('hudScene');
    }

    create() {

        let hudConfig = {
            fontFamily: 'Courier',
            fontSize: '20px',
            color: '#FFFFFF',
            align: 'left',
            padding: {
                top: 10,
                bottom: 10,
                left: 10,
                right: 10,
            },
            fixedWidth: 0
        }

        // Create player
        // Player(scene, pSpawnX, pSpawnY, state, health)
        // this.player = new Player(this, centerX, centerY);
        
        // HUD boxes ---------------------------------------------------------------------------------
        // this.add.rectangle(centerX, centerY, gameWidth, centerY, 0x808080).setOrigin(0.5,0.5);
        // this.add.rectangle(centerX, playHUDY, gameWidth - 20, playHUDHeight - 20, 0xC0C0C0).setOrigin(0.5,0.5);
        this.stateText = this.add.text(100, 50, 'State: ' + playerState, hudConfig).setOrigin(0.5, 0.5);
    }

    update() {
        this.stateText.setText('State: ' + playerState);
    }
}