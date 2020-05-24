class HUD extends Phaser.Scene {
    constructor() {
        super('hudScene');
    }

    create() {

        let hudConfig = {
            fontFamily: 'Courier',
            fontSize: '40px',
            color: '#000000',
            align: 'center',
            padding: {
                // top: 10,
                // bottom: 10,
                // left: 10,
                // right: 10,
            },
            fixedWidth: 0
        }

        this.corruptionSize = '40px';

        // HUD ---------------------------------------------------------------------------------

        this.borderBox1 = this.add.rectangle(0, screenHeight - 72, 140, 72, black).setOrigin(0, 0).setAlpha(0.8);

        this.corruptionCooldownBox = this.add.rectangle(corruptionExpireX, corruptionExpireY, expireBoxWidth, expireBoxHeight, playerPurple).setOrigin(0.5, 0.5).setAlpha(0.5);
        this.corruptionBox = this.add.rectangle(corruptionExpireX, corruptionExpireY, expireBoxWidth, expireBoxHeight, playerPurple).setOrigin(0.5, 0.5).setAlpha(0.3);

        this.knifeCooldownBox = this.add.rectangle(weaponCooldownX, weaponCooldownY, cooldownBoxWidth, cooldownBoxHeight, playerRed).setOrigin(0, 0).setAlpha(cooldownAlpha);
        this.knifeBox = this.add.rectangle(weaponCooldownX, weaponCooldownY, cooldownBoxWidth, cooldownBoxHeight, playerRed).setOrigin(0, 0).setAlpha(boxAlpha);

        this.orbCooldownBox = this.add.rectangle(weaponCooldownX, weaponCooldownY, cooldownBoxWidth, cooldownBoxHeight, playerBlue).setOrigin(0, 0).setAlpha(cooldownAlpha);
        this.orbBox = this.add.rectangle(weaponCooldownX, weaponCooldownY, cooldownBoxWidth, cooldownBoxHeight, playerBlue).setOrigin(0, 0).setAlpha(boxAlpha);
        
        this.switchCooldownBox = this.add.rectangle(switchCooldownX, switchCooldownY, cooldownBoxWidth, cooldownBoxHeight, playerPurple).setOrigin(0, 0).setAlpha(cooldownAlpha);
        this.switchBox = this.add.rectangle(switchCooldownX, switchCooldownY, cooldownBoxWidth, cooldownBoxHeight, playerPurple).setOrigin(0, 0).setAlpha(boxAlpha);


        // this.orbCooldownImage = this.add.sprite(orbCooldownX + 20, orbCooldownY + 20, 'orb').setOrigin(0.5, 0.5);
        // this.knifeCooldownImage = this.add.sprite(knifeCooldownX,knifeCooldownY, 'knife').setOrigin(0, 0);
        // hudConfig.color = playerRed;

        this.healthText = this.add.text(screenWidth - 20, screenHeight - 50, '', hudConfig).setOrigin(1, 0);
        this.corruptionText = this.add.text(centerX, screenHeight - 60, '', hudConfig).setOrigin(0.5, 0);

        hudConfig.fontSize = '30px';
        this.knifeCooldownText = this.add.text(weaponCooldownX, cooldownTextY, '', hudConfig).setOrigin(0, 0);
        // hudConfig.color =  playerBlue;
        this.orbCooldownText = this.add.text(weaponCooldownX, cooldownTextY, '', hudConfig).setOrigin(0, 0);
        this.switchCooldownText = this.add.text(switchCooldownX, cooldownTextY, '', hudConfig).setOrigin(0, 0);
        hudConfig.fontSize = '40px';

        this.testText = this.add.text(centerX, 100, '', hudConfig).setOrigin(0.5, 0);

    }

    update() {
        
        this.healthText.setText('Health: ' + pCurrHealth + "/" + pMaxHealth);

        if(playerState == 0) {
            this.orbCooldownText.setAlpha(0);
            this.orbCooldownBox.setAlpha(0);
            this.orbBox.setAlpha(0);
            this.knifeCooldownText.setAlpha(1);
            this.knifeCooldownBox.setAlpha(cooldownAlpha);
            this.knifeBox.setAlpha(boxAlpha);
        } else {
            this.knifeCooldownText.setAlpha(0);
            this.knifeCooldownBox.setAlpha(0);
            this.knifeBox.setAlpha(0);
            this.orbCooldownText.setAlpha(1);
            this.orbCooldownBox.setAlpha(cooldownAlpha);
            this.orbBox.setAlpha(boxAlpha);
        }

        if(usingCorruption) {
            this.corruptionText.setStyle({
                color: '#FF00FF'
            });
        } else {
            this.corruptionText.setStyle({
                color: '#000000'
            });
        }
        if(corruption != 0) {
            this.corruptionSize = (40 + corruption).toString() + 'px';
            this.corruptionText.setStyle({
                fontSize: this.corruptionSize
            });
        } else {
            this.corruptionText.setStyle({
                fontSize: '40px'
            });
        }
        if(isInvuln) {
            this.healthText.setStyle({
                color: '#FF00FF'
            });
        } else {
            this.healthText.setStyle({
                color: '#000000'
            });
        }
        
        this.corruptionText.setText('Corruption: ' + corruption + "/" + maxCorruption);
        
        // this.testText.setText('expiring: ' + player.corruptionExpiring);
    }
}