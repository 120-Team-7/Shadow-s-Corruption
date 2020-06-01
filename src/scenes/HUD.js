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
        this.highlightBox = this.add.rectangle(0, 0, 0, 0, orchid).setOrigin(0, 0).setAlpha(0);
        this.borderBox1 = this.add.rectangle(0, screenHeight - 72, 140, 72, black).setOrigin(0, 0).setAlpha(0.8);

        this.corruptionCooldownBox = this.add.rectangle(corruptionExpireX, corruptionExpireY, expireBoxWidth, expireBoxHeight, playerPurple).setOrigin(0.5, 0.5).setAlpha(1);
        this.corruptionBox = this.add.rectangle(corruptionExpireX, corruptionExpireY, expireBoxWidth, expireBoxHeight, playerPurple).setOrigin(0.5, 0.5).setAlpha(0.2);

        this.healProgress = this.add.rectangle(screenWidth - 25, screenHeight, healWidth, healHeight, darkMagenta).setOrigin(1, 1).setAlpha(1);
        this.healBox = this.add.rectangle(screenWidth - 25, screenHeight, healWidth, healHeight, playerPurple).setOrigin(1, 1).setAlpha(0.2);

        this.knifeCooldownBox = this.add.rectangle(weaponCooldownX, weaponCooldownY, cooldownBoxWidth, cooldownBoxHeight, playerRed).setOrigin(0, 0).setAlpha(cooldownAlpha);
        this.knifeBox = this.add.rectangle(weaponCooldownX, weaponCooldownY, cooldownBoxWidth, cooldownBoxHeight, playerRed).setOrigin(0, 0).setAlpha(boxAlpha);

        this.orbCooldownBox = this.add.rectangle(weaponCooldownX, weaponCooldownY, cooldownBoxWidth, cooldownBoxHeight, playerBlue).setOrigin(0, 0).setAlpha(cooldownAlpha);
        this.orbBox = this.add.rectangle(weaponCooldownX, weaponCooldownY, cooldownBoxWidth, cooldownBoxHeight, playerBlue).setOrigin(0, 0).setAlpha(boxAlpha);
        
        this.switchCooldownBox = this.add.rectangle(switchCooldownX, switchCooldownY, cooldownBoxWidth, cooldownBoxHeight, playerPurple).setOrigin(0, 0).setAlpha(cooldownAlpha);
        this.switchBox = this.add.rectangle(switchCooldownX, switchCooldownY, cooldownBoxWidth, cooldownBoxHeight, playerPurple).setOrigin(0, 0).setAlpha(boxAlpha);

        // this.healthText = this.add.text(screenWidth - 5, screenHeight - 45, '', hudConfig).setOrigin(1, 0);

        hudConfig.fontSize = '30px';
        this.knifeCooldownText = this.add.text(weaponCooldownX, cooldownTextY, '', hudConfig).setOrigin(0, 0);
        // hudConfig.color =  playerBlue;
        this.orbCooldownText = this.add.text(weaponCooldownX, cooldownTextY, '', hudConfig).setOrigin(0, 0);
        this.switchCooldownText = this.add.text(switchCooldownX, cooldownTextY, '', hudConfig).setOrigin(0, 0);

        this.orbCDImage = this.add.sprite(weaponCooldownX + 32, weaponCooldownY + 32, 'orb').setOrigin(0.5, 0.5).setScale(0.4);
        this.knifeCDImage = this.add.sprite(weaponCooldownX + 5, weaponCooldownY + 10, 'knife').setOrigin(0, 0);
        this.switchCDImage = this.add.sprite(switchCooldownX + 2, cooldownTextY - 18, 'switchCD').setOrigin(0, 0);

        this.hearts = this.add.group();
        this.heart1 = this.add.sprite(0, 0, 'heart').setOrigin(0.5, 0.5);
        this.heart2 = this.add.sprite(0, 0, 'heart').setOrigin(0.5, 0.5);
        this.heart3 = this.add.sprite(0, 0, 'heart').setOrigin(0.5, 0.5);
        this.heart4 = this.add.sprite(0, 0, 'heart').setOrigin(0.5, 0.5);
        this.heart5 = this.add.sprite(0, 0, 'heart').setOrigin(0.5, 0.5);

        this.hearts.addMultiple([this.heart1, this.heart2, this.heart3, this.heart4, this.heart5]);

        let heartPlacementLine = new Phaser.Geom.Line(screenWidth - 330, screenHeight - 40, screenWidth + 20, screenHeight - 40);
        Phaser.Actions.PlaceOnLine(this.hearts.getChildren(), heartPlacementLine);

        this.corruptionLevels = this.add.group();
        this.corruption1 = this.add.sprite(0, 0, 'essCorruptionDim').setOrigin(0.5, 0.5);
        this.corruption2 = this.add.sprite(0, 0, 'essCorruptionDim').setOrigin(0.5, 0.5);
        this.corruption3 = this.add.sprite(0, 0, 'essCorruptionDim').setOrigin(0.5, 0.5);
        this.corruption4 = this.add.sprite(0, 0, 'essCorruptionDim').setOrigin(0.5, 0.5);
        this.corruption5 = this.add.sprite(0, 0, 'essCorruptionDim').setOrigin(0.5, 0.5);

        this.corruptionLevels.addMultiple([this.corruption1, this.corruption2, this.corruption3, this.corruption4, this.corruption5]);

        let levelPlacementLine = new Phaser.Geom.Line(centerX - 180, screenHeight - 40, centerX + 270, screenHeight - 40);
        Phaser.Actions.PlaceOnLine(this.corruptionLevels.getChildren(), levelPlacementLine);

        this.testText1 = this.add.text(centerX, 50, '', hudConfig).setOrigin(0.5, 0);
        this.testText2 = this.add.text(centerX, 100, '', hudConfig).setOrigin(0.5, 0);

        this.highlightBox = this.add.rectangle(screenWidth, screenHeight, 0, 0, orange).setOrigin(0.5, 0.5).setAlpha(0);

        this.cameras.main.fadeIn(1000, 0, 0, 0);

        this.activeFlash = false;
        this.corruptionActiveFlash = this.time.addEvent({
            delay: 100,
            callback: () => {
                if(usingCorruption) {
                    if(this.activeFlash) {
                        this.activeFlash = false;
                        this.corruptionCooldownBox.setAlpha(1)
                    } else {
                        this.activeFlash = true;
                        this.corruptionCooldownBox.setAlpha(healthFlashAlpha)
                    }
                }
                
            },
            callbackContext: this,
            loop: true,
        });
        this.healthFlash = false;
        this.invulnFlashing = this.time.addEvent({
            delay: 100,
            callback: () => {
                if(this.healthFlash) {
                    this.healthFlash = false;
                    if(pCurrHealth >= 1) {
                        this.heart1.setAlpha(1);
                    } else {
                        this.heart1.setAlpha(healthMissingAlpha);
                    } 
                    if(pCurrHealth >= 2) {
                        this.heart2.setAlpha(1)
                    } else {
                        this.heart2.setAlpha(healthMissingAlpha);
                    } 
                    if(pCurrHealth >= 3) {
                        this.heart3.setAlpha(1);
                    } else {
                        this.heart3.setAlpha(healthMissingAlpha);
                    } 
                    if(pCurrHealth >= 4) {
                        this.heart4.setAlpha(1);
                    } else {
                        this.heart4.setAlpha(healthMissingAlpha);
                    } 
                    if(pCurrHealth >= 5) {
                        this.heart5.setAlpha(1);
                    } else {
                        this.heart5.setAlpha(healthMissingAlpha);
                    } 
                } else {
                    this.healthFlash = true;
                    if(pCurrHealth >= 1) {
                        this.heart1.setAlpha(healthFlashAlpha);
                    } else {
                        this.heart1.setAlpha(healthMissingAlpha);
                    } 
                    if(pCurrHealth >= 2) {
                        this.heart2.setAlpha(healthFlashAlpha);
                    } else {
                        this.heart2.setAlpha(healthMissingAlpha);
                    } 
                    if(pCurrHealth >= 3) {
                        this.heart3.setAlpha(healthFlashAlpha);
                    } else {
                        this.heart3.setAlpha(healthMissingAlpha);
                    } 
                    if(pCurrHealth >= 4) {
                        this.heart4.setAlpha(healthFlashAlpha);
                    } else {
                        this.heart4.setAlpha(healthMissingAlpha);
                    } 
                    if(pCurrHealth >= 5) {
                        this.heart5.setAlpha(healthFlashAlpha);
                    } else {
                        this.heart5.setAlpha(healthMissingAlpha);
                    } 
                }
            },
            callbackContext: this,
            loop: true,
        });
        this.invulnFlashing.paused = true;
    }

    update() {
        this.displayHealProgress();
        if(player.canUseCorruption) {
            this.corruption1.setVisible(true);
            this.corruption2.setVisible(true);
            this.corruption3.setVisible(true);
            this.corruption4.setVisible(true);
            this.corruption5.setVisible(true);
            this.corruptionBox.setVisible(true);
            this.corruptionCooldownBox.setVisible(true);
            this.healBox.setVisible(true);
            this.healProgress.setVisible(true);
        } else {
            this.corruption1.setVisible(false);
            this.corruption2.setVisible(false);
            this.corruption3.setVisible(false);
            this.corruption4.setVisible(false);
            this.corruption5.setVisible(false);
            this.corruptionBox.setVisible(false);
            this.corruptionCooldownBox.setVisible(false);
            this.healBox.setVisible(false);
            this.healProgress.setVisible(false);
        }
        if(player.canUseCorruption && corruption == 0) {
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

        if(isInvuln && !isGodmode) {
            this.invulnFlashing.paused = false;
        } else {
            this.healthFlash = false;
            this.invulnFlashing.paused = true;
            if(pCurrHealth == 0) {
                this.heart1.setAlpha(healthMissingAlpha);
                this.heart2.setAlpha(healthMissingAlpha);
                this.heart3.setAlpha(healthMissingAlpha);
                this.heart4.setAlpha(healthMissingAlpha);
                this.heart5.setAlpha(healthMissingAlpha);
            }
            if(pCurrHealth == 1) {
                this.heart1.setAlpha(1);
                this.heart2.setAlpha(healthMissingAlpha);
                this.heart3.setAlpha(healthMissingAlpha);
                this.heart4.setAlpha(healthMissingAlpha);
                this.heart5.setAlpha(healthMissingAlpha);
            }
            if(pCurrHealth == 2) {
                this.heart1.setAlpha(1);
                this.heart2.setAlpha(1);
                this.heart3.setAlpha(healthMissingAlpha);
                this.heart4.setAlpha(healthMissingAlpha);
                this.heart5.setAlpha(healthMissingAlpha);
            }
            if(pCurrHealth == 3) {
                this.heart1.setAlpha(1);
                this.heart2.setAlpha(1);
                this.heart3.setAlpha(1);
                this.heart4.setAlpha(healthMissingAlpha);
                this.heart5.setAlpha(healthMissingAlpha);
            }
            if(pCurrHealth == 4) {
                this.heart1.setAlpha(1);
                this.heart2.setAlpha(1);
                this.heart3.setAlpha(1);
                this.heart4.setAlpha(1);
                this.heart5.setAlpha(healthMissingAlpha);
            }
            if(pCurrHealth == 5) {
                this.heart1.setAlpha(1);
                this.heart2.setAlpha(1);
                this.heart3.setAlpha(1);
                this.heart4.setAlpha(1);
                this.heart5.setAlpha(1);
            }
        }
        
        if(playerState == 0) {
            this.orbCooldownText.setAlpha(0);
            this.orbCooldownBox.setAlpha(0);
            this.orbBox.setAlpha(0);
            this.orbCDImage.setAlpha(0);
            this.knifeCooldownText.setAlpha(0);
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

        // this.testText.setText('x: ' + Math.round(player.scene.cameras.main.worldView.x) + " y: " + Math.round(player.scene.cameras.main.worldView.y));
        // this.testText1.setText('x: ' + Math.round(pointer.worldX) + " y: " + Math.round(pointer.worldY));
        // this.testText2.setText('knife: ' + pStats.knifeCorruptedDamage + ' orb: ' + pStats.orbCorruptedDamage);

    }

    displayHealProgress() {
        this.currHealProgress = (pStats.knifeCorruptedDamage + pStats.orbCorruptedDamage) % healBenchmark;
        
        this.cooldownBoxIncrease = healWidth*(this.currHealProgress / healBenchmark);
        this.healProgress.setSize(this.cooldownBoxIncrease, healHeight);
    }

    checkHealProgress(damage) {
        this.lastHealProgress = (pStats.knifeCorruptedDamage + pStats.orbCorruptedDamage) % healBenchmark;
        if(this.lastHealProgress + damage >= healBenchmark) {
            player.playerHeal(1);
            this.gainedHeart = pCurrHealth;
            if(this.gainedHeart == 2) {
                this.heart2.setScale(healedHeartScale, healedHeartScale);
            }
            if(this.gainedHeart == 3) {
                this.heart3.setScale(healedHeartScale, healedHeartScale);
            }
            if(this.gainedHeart == 4) {
                this.heart4.setScale(healedHeartScale, healedHeartScale);
            }
            if(this.gainedHeart == 5) {
                this.heart5.setScale(healedHeartScale, healedHeartScale);
            }
            this.healthGainVisual = this.time.delayedCall(2000, function () {
                this.heart1.setScale(1, 1);
                this.heart2.setScale(1, 1);
                this.heart3.setScale(1, 1);
                this.heart4.setScale(1, 1);
                this.heart5.setScale(1, 1);
            }, null, this);
        }
    }

    highlightHudElement(elementX, elementY, elementWidth, elementHeight, holdDuration) {
        this.highlightBox.setActive(true);
        this.elementHiglight = this.tweens.add({
            targets: this.highlightBox,
            x: { from: 0, to: elementX},
            y: { from: 0, to: elementY},
            width: { from: screenWidth, to: elementWidth},
            height: { from: screenHeight, to: elementHeight},
            alpha: { from: 0, to: 0.4},
            ease: 'Quart.easeOut',
            duration: 2000,
            hold: holdDuration,
            yoyo: true,
            onComplete: function() {
                this.highlightBox.setActive(false);
                this.highlightBox.setAlpha(0);
            },
            onCompleteScope: this
        });
    }
}