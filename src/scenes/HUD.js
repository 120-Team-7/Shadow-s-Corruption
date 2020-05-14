class HUD extends Phaser.Scene {
    constructor() {
        super('hudScene');
    }

    create() {

        let hudConfig = {
            fontFamily: 'Courier',
            fontSize: '30px',
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
        this.stateText = this.add.text(20, 20, '', hudConfig).setOrigin(0, 0);

        this.healthText = this.add.text(200, 20, '', hudConfig).setOrigin(0, 0);

        this.corruptionText = this.add.text(450, 20, '', hudConfig).setOrigin(0, 0);

        // this.pointerText = this.add.text(20, 20, '', hudConfig).setOrigin(0, 0);
        // pointer = this.input.activePointer;

    }

    update() {
        this.stateText.setText('State: ' + playerState);
        this.healthText.setText('Health: ' + pCurrHealth + "/" + pMaxHealth);
        this.corruptionText.setText('Corruption: ' + corruption + "/" + maxCorruption + " " + usingCorruption);

        
        // this.pointerText.setText([
        //     'pointer.x: ' + pointer.worldX,
        //     'pointer.y: ' + pointer.worldY,
        //     'isDown: ' + pointer.isDown,
        // ]);
    }
}