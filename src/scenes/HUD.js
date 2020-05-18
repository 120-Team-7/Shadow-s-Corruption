class HUD extends Phaser.Scene {
    constructor() {
        super('hudScene');
    }

    create() {

        let hudConfig = {
            fontFamily: 'Courier',
            fontSize: '30px',
            color: '#000000',
            align: 'left',
            padding: {
                top: 10,
                bottom: 10,
                left: 10,
                right: 10,
            },
            fixedWidth: 0
        }

        // HUD ---------------------------------------------------------------------------------
        this.healthText = this.add.text(screenWidth - 50, screenHeight - 50, '', hudConfig).setOrigin(1, 0);
        this.corruptionText = this.add.text(centerX, 10, '', hudConfig).setOrigin(0.5, 0);
        
        this.knifeCooldownBox = this.add.rectangle(knifeCooldownX, knifeCooldownY, cooldownBoxWidth, cooldownBoxHeight, playerRed).setOrigin(0, 0).setAlpha(0.25);
        this.knifeBox = this.add.rectangle(knifeCooldownX, knifeCooldownY, cooldownBoxWidth, cooldownBoxHeight, playerRed).setOrigin(0, 0).setAlpha(0.25);
        this.orbCooldownBox = this.add.rectangle(orbCooldownX, orbCooldownY, cooldownBoxWidth, cooldownBoxHeight, playerBlue).setOrigin(0, 0).setAlpha(0.25);
        this.orbBox = this.add.rectangle(orbCooldownX, orbCooldownY, cooldownBoxWidth, cooldownBoxHeight, playerBlue).setOrigin(0, 0).setAlpha(0.25);
        this.switchCooldownBox = this.add.rectangle(switchCooldownX, switchCooldownY, cooldownBoxWidth, cooldownBoxHeight, playerPurple).setOrigin(0, 0).setAlpha(0.25);
        this.switchBox = this.add.rectangle(switchCooldownX, switchCooldownY, cooldownBoxWidth, cooldownBoxHeight, playerPurple).setOrigin(0, 0).setAlpha(0.25);
        // this.orbCooldownImage = this.add.sprite(orbCooldownX + 20, orbCooldownY + 20, 'orb').setOrigin(0.5, 0.5);
        // this.knifeCooldownImage = this.add.sprite(knifeCooldownX,knifeCooldownY, 'knife').setOrigin(0, 0);
        // hudConfig.color = playerRed;
        this.knifeCooldownText = this.add.text(knifeCooldownX, knifeCooldownY, '', hudConfig).setOrigin(0, 0);
        // hudConfig.color =  playerBlue;
        this.orbCooldownText = this.add.text(orbCooldownX, orbCooldownY, '', hudConfig).setOrigin(0, 0);
        this.switchCooldownText = this.add.text(switchCooldownX, switchCooldownY, '', hudConfig).setOrigin(0, 0);
    }

    update() {
        this.healthText.setText('Health: ' + pCurrHealth + "/" + pMaxHealth);
        this.corruptionText.setText('Corruption: ' + corruption + "/" + maxCorruption + "   Using Corruption: " + usingCorruption);
    }
}