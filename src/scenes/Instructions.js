class Instructions extends Phaser.Scene {
    constructor() {
        super('instructionsScene');
    }

    create() {
        keyInstructions = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);

        this.cameras.main.setBackgroundColor('#000000');

        let instructionsConfig = {
            fontFamily: 'Courier',
            fontSize: '35px',
            color: '#000000',
            stroke: '#8B008B',
            strokeThickness: strokeThickness,
            align: 'center',
            padding: {
                top: 15,
                bottom: 15,
                left: 10,
                right: 10,
            },
            fixedWidth: 0,
            wordWrap: {
                width: screenWidth - 30,
                useAdvancedWrap: true,
            }
        }

        // Images
        // Red
        this.redPlayerImage = this.add.sprite(centerX - 50, imagesY, 'redPlayer').setOrigin(0.5, 0.5).setFlipX(true);
        this.knifeImage = this.add.sprite(centerX - (50 + idleWeaponDistance), imagesY, 'knife').setOrigin(0.5, 0.5).setFlipX(true);
        this.corruptKnifeImage = this.add.sprite(screenWidth/4 - 20, imagesY, 'corruptKnife').setOrigin(0.5, 0.5).setFlipX(true);
        this.redEnemy = this.add.sprite(50, imagesY, 'redChaser').setOrigin(0.5, 0.5).setFlipX(true);
        // Blue
        this.bluePlayerImage = this.add.sprite(centerX + 50, imagesY, 'bluePlayer').setOrigin(0.5, 0.5);
        this.orbImage = this.add.sprite(centerX + (50 + idleWeaponDistance), imagesY, 'orb').setOrigin(0.5, 0.5);
        this.corruptOrbImage = this.add.sprite(3*screenWidth/4 + 20, imagesY, 'corruptOrb').setOrigin(0.5, 0.5);
        this.blueEnemy = this.add.sprite(screenWidth - 50, imagesY, 'blueChaser').setOrigin(0.5, 0.5);

        // Controls text
        this.add.text(centerX, centerY - 20 - 2*textSpacer, 'WASD to move        SHIFT to phase between realms', instructionsConfig).setOrigin(0.5, 0.5);
        this.add.text(centerX, centerY - 20 - textSpacer, 'MOUSE to aim, LEFT MOUSE BUTTON to shoot', instructionsConfig).setOrigin(0.5, 0.5);
        this.add.text(centerX, centerY - 20, 'I return to menu, ESC or ENTER to pause', instructionsConfig).setOrigin(0.5, 0.5);
        this.add.text(centerX, centerY - 20 + textSpacer, 'M to toggle mute, K to reset', instructionsConfig).setOrigin(0.5, 0.5);

        // HUD 
        this.borderBox1 = this.add.rectangle(0, screenHeight - 72, 140, 72, black).setOrigin(0, 0).setAlpha(0.8);

        this.corruptionCooldownBox = this.add.rectangle(corruptionExpireX, corruptionExpireY, expireBoxWidth - 200, expireBoxHeight, playerPurple).setOrigin(0.5, 0.5).setAlpha(1);
        this.corruptionBox = this.add.rectangle(corruptionExpireX, corruptionExpireY, expireBoxWidth, expireBoxHeight, playerPurple).setOrigin(0.5, 0.5).setAlpha(0.2);

        this.healProgress = this.add.rectangle(screenWidth - 25 - 200, screenHeight, healWidth - 200, healHeight, darkMagenta).setOrigin(1, 1).setAlpha(1);
        this.healBox = this.add.rectangle(screenWidth - 25, screenHeight, healWidth, healHeight, playerPurple).setOrigin(1, 1).setAlpha(0.2);

        this.knifeCooldownBox = this.add.rectangle(weaponCooldownX, weaponCooldownY, cooldownBoxWidth, cooldownBoxHeight, playerRed).setOrigin(0, 0).setAlpha(cooldownAlpha);
        this.knifeBox = this.add.rectangle(weaponCooldownX, weaponCooldownY, cooldownBoxWidth, cooldownBoxHeight, playerRed).setOrigin(0, 0).setAlpha(boxAlpha);

        this.orbCooldownBox = this.add.rectangle(weaponCooldownX, weaponCooldownY, cooldownBoxWidth, cooldownBoxHeight, playerBlue).setOrigin(0, 0).setAlpha(cooldownAlpha);
        this.orbBox = this.add.rectangle(weaponCooldownX, weaponCooldownY, cooldownBoxWidth, cooldownBoxHeight, playerBlue).setOrigin(0, 0).setAlpha(boxAlpha);
        
        this.switchCooldownBox = this.add.rectangle(switchCooldownX, switchCooldownY, cooldownBoxWidth, cooldownBoxHeight, playerPurple).setOrigin(0, 0).setAlpha(cooldownAlpha);
        this.switchBox = this.add.rectangle(switchCooldownX, switchCooldownY, cooldownBoxWidth, cooldownBoxHeight, playerPurple).setOrigin(0, 0).setAlpha(boxAlpha);

        this.orbCDImage = this.add.sprite(weaponCooldownX + 32, weaponCooldownY + 32, 'orb').setOrigin(0.5, 0.5).setScale(0.4);
        this.knifeCDImage = this.add.sprite(weaponCooldownX + 5, weaponCooldownY + 10, 'knife').setOrigin(0, 0);
        this.switchCDImage = this.add.sprite(switchCooldownX + 2, cooldownTextY - 18, 'switchCD').setOrigin(0, 0);

        this.hearts = this.add.group();
        this.heart1 = this.add.sprite(0, 0, 'heart').setOrigin(0.5, 0.5);
        this.heart2 = this.add.sprite(0, 0, 'heart').setOrigin(0.5, 0.5);
        this.heart3 = this.add.sprite(0, 0, 'heart').setOrigin(0.5, 0.5).setAlpha(healthMissingAlpha);;
        this.heart4 = this.add.sprite(0, 0, 'heart').setOrigin(0.5, 0.5).setAlpha(healthMissingAlpha);;
        this.heart5 = this.add.sprite(0, 0, 'heart').setOrigin(0.5, 0.5).setAlpha(healthMissingAlpha);;

        this.hearts.addMultiple([this.heart1, this.heart2, this.heart3, this.heart4, this.heart5]);

        let heartPlacementLine = new Phaser.Geom.Line(screenWidth - 330, screenHeight - 40, screenWidth + 20, screenHeight - 40);
        Phaser.Actions.PlaceOnLine(this.hearts.getChildren(), heartPlacementLine);

        this.corruptionLevels = this.add.group();
        this.corruption1 = this.add.sprite(0, 0, 'essCorruptionGlow').setOrigin(0.5, 0.5);
        this.corruption2 = this.add.sprite(0, 0, 'essCorruptionGlow').setOrigin(0.5, 0.5);
        this.corruption3 = this.add.sprite(0, 0, 'essCorruptionGlow').setOrigin(0.5, 0.5);
        this.corruption4 = this.add.sprite(0, 0, 'essCorruptionDim').setOrigin(0.5, 0.5);
        this.corruption5 = this.add.sprite(0, 0, 'essCorruptionDim').setOrigin(0.5, 0.5);

        this.corruptionLevels.addMultiple([this.corruption1, this.corruption2, this.corruption3, this.corruption4, this.corruption5]);

        let levelPlacementLine = new Phaser.Geom.Line(centerX - 180, screenHeight - 40, centerX + 270, screenHeight - 40);
        Phaser.Actions.PlaceOnLine(this.corruptionLevels.getChildren(), levelPlacementLine);

        // HUD text
        instructionsConfig.fontSize = '20px';
        this.add.text(70, screenHeight - 80, 'Cooldowns', instructionsConfig).setOrigin(0.5, 0.5);
        this.add.text(centerX, screenHeight - 80, 'Corruption level', instructionsConfig).setOrigin(0.5, 0.5);
        this.add.text(centerX, screenHeight - 10, 'Corruption expire time', instructionsConfig).setOrigin(0.5, 0.5);
        this.add.text(screenWidth - 190, screenHeight - 80, 'Health', instructionsConfig).setOrigin(0.5, 0.5);
        this.add.text(screenWidth - 190, screenHeight - 10, 'Heal progress', instructionsConfig).setOrigin(0.5, 0.5);

        // Red
        instructionsConfig.color = '#FF0000';
        instructionsConfig.fontSize = '60px';
        this.add.text(300, 60, 'Physical Realm', instructionsConfig).setOrigin(0.5, 0.5);
        // Blue
        instructionsConfig.color = '#0000FF';
        this.add.text(screenWidth - 300, 60, 'Spirit Realm', instructionsConfig).setOrigin(0.5, 0.5);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyInstructions)) {
            this.scene.stop('instructionsScene');
            this.scene.run('menuScene');
        }
    }
}