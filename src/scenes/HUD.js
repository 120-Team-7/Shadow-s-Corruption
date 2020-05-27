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

       
        // hudConfig.color = playerRed;

        this.healthText = this.add.text(screenWidth - 10, screenHeight - 45, '', hudConfig).setOrigin(1, 0);

        hudConfig.fontSize = '30px';
        this.knifeCooldownText = this.add.text(weaponCooldownX, cooldownTextY, '', hudConfig).setOrigin(0, 0);
        // hudConfig.color =  playerBlue;
        this.orbCooldownText = this.add.text(weaponCooldownX, cooldownTextY, '', hudConfig).setOrigin(0, 0);
        this.switchCooldownText = this.add.text(switchCooldownX, cooldownTextY, '', hudConfig).setOrigin(0, 0);
        hudConfig.fontSize = '40px';

        this.orbCDImage = this.add.sprite(weaponCooldownX + 32, weaponCooldownY + 32, 'orb').setOrigin(0.5, 0.5).setScale(0.4);
        this.knifeCDImage = this.add.sprite(weaponCooldownX + 5, weaponCooldownY + 10, 'knife').setOrigin(0, 0);
        this.switchCDImage = this.add.sprite(switchCooldownX + 2, cooldownTextY - 18, 'switchCD').setOrigin(0, 0);

        this.corruptionLevels = this.add.group();
        this.corruption1 = this.add.sprite(0, 0, 'essCorruptionDim').setOrigin(0.5, 0.5);
        this.corruption2 = this.add.sprite(0, 0, 'essCorruptionDim').setOrigin(0.5, 0.5);
        this.corruption3 = this.add.sprite(0, 0, 'essCorruptionDim').setOrigin(0.5, 0.5);
        this.corruption4 = this.add.sprite(0, 0, 'essCorruptionDim').setOrigin(0.5, 0.5);
        this.corruption5 = this.add.sprite(0, 0, 'essCorruptionDim').setOrigin(0.5, 0.5);

        this.corruptionLevels.addMultiple([this.corruption1, this.corruption2, this.corruption3, this.corruption4, this.corruption5]);

        let levelPlacementLine = new Phaser.Geom.Line(centerX - 180, screenHeight - 40, centerX + 270, screenHeight - 50);
        Phaser.Actions.PlaceOnLine(this.corruptionLevels.getChildren(), levelPlacementLine);

        this.testText = this.add.text(centerX, 100, '', hudConfig).setOrigin(0.5, 0);

        this.cameras.main.fadeIn(1000, 0, 0, 0);
    }

    update() {
        if(corruption == 0) {
            this.corruption1.setAlpha(corruptionLevelAlpha);
            this.corruption2.setAlpha(corruptionLevelAlpha);
            this.corruption3.setAlpha(corruptionLevelAlpha);
            this.corruption4.setAlpha(corruptionLevelAlpha);
            this.corruption5.setAlpha(corruptionLevelAlpha);
            this.corruption1.setTexture('essCorruptionDim');
            this.corruption2.setTexture('essCorruptionDim');
            this.corruption3.setTexture('essCorruptionDim');
            this.corruption4.setTexture('essCorruptionDim');
            this.corruption5.setTexture('essCorruptionDim');
        } else {
            if(corruption == 1) {
                this.corruption1.setAlpha(1);
                this.corruption2.setAlpha(corruptionLevelAlpha);
                this.corruption3.setAlpha(corruptionLevelAlpha);
                this.corruption4.setAlpha(corruptionLevelAlpha);
                this.corruption5.setAlpha(corruptionLevelAlpha);
                this.corruption1.setTexture('essCorruptionGlow');
                this.corruption2.setTexture('essCorruptionDim');
                this.corruption3.setTexture('essCorruptionDim');
                this.corruption4.setTexture('essCorruptionDim');
                this.corruption5.setTexture('essCorruptionDim');
            }
            if(corruption == 2) {
                this.corruption1.setAlpha(1);
                this.corruption2.setAlpha(1);
                this.corruption3.setAlpha(corruptionLevelAlpha);
                this.corruption4.setAlpha(corruptionLevelAlpha);
                this.corruption5.setAlpha(corruptionLevelAlpha);
                this.corruption1.setTexture('essCorruptionGlow');
                this.corruption2.setTexture('essCorruptionGlow');
                this.corruption3.setTexture('essCorruptionDim');
                this.corruption4.setTexture('essCorruptionDim');
                this.corruption5.setTexture('essCorruptionDim');
            }
            if(corruption == 3) {
                this.corruption1.setAlpha(1);
                this.corruption2.setAlpha(1);
                this.corruption3.setAlpha(1);
                this.corruption4.setAlpha(corruptionLevelAlpha);
                this.corruption5.setAlpha(corruptionLevelAlpha);
                this.corruption1.setTexture('essCorruptionGlow');
                this.corruption2.setTexture('essCorruptionGlow');
                this.corruption3.setTexture('essCorruptionGlow');
                this.corruption4.setTexture('essCorruptionDim');
                this.corruption5.setTexture('essCorruptionDim');
            }
            if(corruption == 4) {
                this.corruption1.setAlpha(1);
                this.corruption2.setAlpha(1);
                this.corruption3.setAlpha(1);
                this.corruption4.setAlpha(1);
                this.corruption5.setAlpha(corruptionLevelAlpha);
                this.corruption1.setTexture('essCorruptionGlow');
                this.corruption2.setTexture('essCorruptionGlow');
                this.corruption3.setTexture('essCorruptionGlow');
                this.corruption4.setTexture('essCorruptionGlow');
                this.corruption5.setTexture('essCorruptionDim');
            }
            if(corruption == 5) {
                this.corruption1.setAlpha(1);
                this.corruption2.setAlpha(1);
                this.corruption3.setAlpha(1);
                this.corruption4.setAlpha(1);
                this.corruption5.setAlpha(1);
                this.corruption1.setTexture('essCorruptionGlow');
                this.corruption2.setTexture('essCorruptionGlow');
                this.corruption3.setTexture('essCorruptionGlow');
                this.corruption4.setTexture('essCorruptionGlow');
                this.corruption5.setTexture('essCorruptionGlow');
            }
        }
        
        
        this.healthText.setText('Health: ' + pCurrHealth + "/" + pMaxHealth);

        if(playerState == 0) {
            this.orbCooldownText.setAlpha(0);
            this.orbCooldownBox.setAlpha(0);
            this.orbBox.setAlpha(0);
            this.orbCDImage.setAlpha(0);
            this.knifeCooldownText.setAlpha(1);
            this.knifeCooldownBox.setAlpha(cooldownAlpha);
            this.knifeBox.setAlpha(boxAlpha);
            this.knifeCDImage.setAlpha(1);
        } else {
            this.knifeCooldownText.setAlpha(0);
            this.knifeCooldownBox.setAlpha(0);
            this.knifeBox.setAlpha(0);
            this.knifeCDImage.setAlpha(0);
            this.orbCooldownText.setAlpha(1);
            this.orbCooldownBox.setAlpha(cooldownAlpha);
            this.orbBox.setAlpha(boxAlpha);
            this.orbCDImage.setAlpha(1);
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
                
        // this.testText.setText('idleWeapon: ' + idleWeaponExists);
    }
}