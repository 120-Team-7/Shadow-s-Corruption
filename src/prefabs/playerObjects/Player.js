class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, hudScene, pSpawnX, pSpawnY) {
        super(scene, pSpawnX, pSpawnY, 'redPlayer').setOrigin(0.5, 0.5);

        playerState = 0;

        let player = this;
        this.scene = scene;
        this.hudScene = hudScene;

        var hudScene = game.scene.keys.hudScene;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        this.setDepth(999);

        this.body.setSize(30, 50);
        this.body.setMaxVelocity(maxMoveVelocity, maxMoveVelocity);

        keyLeft = scene.input.keyboard.addKey('A');
        keyRight = scene.input.keyboard.addKey('D');
        keyUp = scene.input.keyboard.addKey('W');
        keyDown = scene.input.keyboard.addKey('S');
        keySwitch = scene.input.keyboard.addKey('SHIFT');
        keyDebug = scene.input.keyboard.addKey('B');
        keySuicide = scene.input.keyboard.addKey('K');
        keyGodmode = scene.input.keyboard.addKey('PLUS');
        
        this.corruptionExpiring = false;

        this.idleWeapon;
        idleWeaponExists = false;

        this.weaponMine;
        this.weaponMineExists = false;

        this.playerAccel = playerAccel;

        this.originalKROF = knifeThrowROF;
        this.originalOROF = orbShootROF;
        this.originalSCD = switchCooldown;

        scene.corruptionDecayTimer = scene.time.addEvent({
            delay: corruptionDecayDelay,
            callback: () => {
                if(corruption != 0 && !gainingCorruption){
                    corruption--;
                }
            },
            callbackContext: scene,
            loop: true,
        });

        this.damageTextConfig = {
            fontFamily: 'Courier',
            fontSize: '35px',
            color: "#FF00FF",
            align: 'center',
            padding: {
                top: 10,
                bottom: 10,
                left: 10,
                right: 10,
            },
            fixedWidth: 0
        }

        this.damageText = scene.add.text(this.x, this.y - 40, "", this.damageTextConfig).setOrigin(0.5, 0.5).setDepth(1000);


        // this.corruptionSiphon = corruptionParticles.createGravityWell({
        //     x: this.x,
        //     y: this.y,
        //     power: 1,       // strength of grav force (larger = stronger)
        //     epsilon: screenWidth,   // min. distance for which grav force is calculated
        //     gravity: 3000,    // grav. force of this well (creates "whipping" effect)
        // });

        this.emitCircle = new Phaser.Geom.Circle(this.x, this.y, 20);

        this.corruptionBleed = corruptionParticles.createEmitter({
            emitZone: { source: this.emitCircle },
            alpha: { start: 1, end: 0 },
            scale: { start: 1, end: 0 },
            lifespan: { min: 1000, max: 1500 },
            speedX: { min: -playerExplodeVel, max: playerExplodeVel },
            speedY: { min: -playerExplodeVel, max: playerExplodeVel },
        });
        this.corruptionBleed.stop();
        this.particleTrail = corruptionParticles.createEmitter({
            emitZone: { source: this.emitCircle },
            alpha: { start: 1, end: 0 },
            scale: { start: 0.5, end: 0 },
            speed: { min: 0, max: 20 },
            lifespan: { min: 500, max: 1000 },
            frequency: 50,
            quantity: 2,
        });
        this.particleTrail.stop();

        scene.shiftCircle = scene.add.ellipse(this.x, this.y, 2*screenWidth, 2*screenWidth);
        scene.shiftCircle.setAlpha(0);
        this.shiftCircleShrink = this.scene.tweens.add({
            targets: scene.shiftCircle,
            paused: true,
            scale: { from: 0, to: 1},
            alpha: { from: 0.05, to: 0},
            ease: 'Sine.easeIn',
            duration: switchEffectsDuration,
            onComplete: function() {
                this.shiftCircle.setActive(false);
            },
            onCompleteScope: scene
        });
    }


    update() {
        this.scene.shiftCircle.setPosition(this.x, this.y);
        if(!isGameOver){
            // Player movement
            if(keyLeft.isDown || keyRight.isDown || keyUp.isDown || keyDown.isDown){
                if(keyLeft.isDown || keyRight.isDown){
                    if(keyLeft.isDown) {
                        this.body.velocity.x -= this.playerAccel;
                    } else if(keyRight.isDown) {
                        this.body.velocity.x += this.playerAccel;
                    } else {
                        this.body.setDragX(playerStopDrag);
                    }
                }
                if(keyUp.isDown || keyDown.isDown){
                    if(keyUp.isDown) {
                        this.body.velocity.y -= this.playerAccel;
                    }
                    if(keyDown.isDown) {
                        this.body.velocity.y += this.playerAccel;
                    } else {
                        this.body.setDragY(playerStopDrag);
                    }
                }
            } else {
                this.body.setDrag(playerStopDrag);
            }

            // Player color switch
            if(!switchOnCooldown && Phaser.Input.Keyboard.JustDown(keySwitch)){
                switchOnCooldown = true;
                // Change state and body appearance
                if(playerState == 0){
                    playerState = 1;
                    this.setTexture('bluePlayer');
                } else {
                    playerState = 0;
                    this.setTexture('redPlayer');
                }
                
                // Remove current idleWeapon
                if(idleWeaponExists) {
                    this.idleWeapon.resetCooldown();
                    this.weaponMineExists = true;
                    this.weaponMine = this.idleWeapon;
                    delete this.idleWeapon;
                    this.weaponMine.exists = false;
                    this.weaponMine.disapate.resume();
                    if(this.weaponMine.corrupted) {
                        this.weaponMine.particleTrail.remove();
                    }
                    idleWeaponExists = false;                    
                }
                // Start corruption shot window
                if(corruption != 0 && !usingCorruption) {
                    // Increase player speed 
                    this.body.setMaxVelocity(playerCorruptMaxVelocity, playerCorruptMaxVelocity);
                    this.playerAccel = playerCorruptAccel;
                    this.particleTrail.start();

                    usingCorruption = true;
                    this.scene.corruptionDecayTimer.paused = true;
                    this.corruptionExpiring = true;
                    // Start timer for corruption charges to expire after not being used
                    this.corruptionExpireTimer = this.scene.time.delayedCall(corruptionExpireDelay, function () {
                        this.corruptionExpiring = false;
                        corruption = 0;
                        usingCorruption = false;
                        player.scene.corruptionDecayTimer.paused = false;
                        // Change to regular orb if corruption time expires
                        if(playerState == 1 && idleWeaponExists && !usingCorruption){
                            player.idleWeapon.setTexture('orb');
                        }
                        // Change to regular knife if corruption time expires
                        if(playerState == 0 && idleWeaponExists && !usingCorruption){
                            player.idleWeapon.setTexture('knife');
                        }
                        player.scene.sound.play('corruptionExpire');
                    }, null, this.scene);
                }

                this.switchCooldown = this.scene.time.delayedCall(switchCooldown, function () {
                    switchOnCooldown = false;
                }, null, this.scene);

                // Switch effects
                this.scene.cameras.main.shake(switchEffectsDuration, switchScreenShake);
                this.scene.shiftCircle.setActive(true);
                if(playerState == 0) { 
                    this.scene.shiftCircle.setFillStyle(playerRed);
                } else {
                    this.scene.shiftCircle.setFillStyle(playerBlue);
                }
                this.shiftCircleShrink.play();
            }
                
            if(!usingCorruption) {
                this.body.setMaxVelocity(maxMoveVelocity, maxMoveVelocity);
                this.playerAccel = this.playerAccel;
                this.particleTrail.stop();
            }

            this.emitCircle.setPosition(this.x, this.y);

            // Calculate angle to set on idleWeapon sprite (toward pointer)
            this.weaponAngle =  Phaser.Math.RadToDeg(Phaser.Math.Angle.Between(player.x, player.y, pointer.x, pointer.y));
            // Calculate x, y idleWeapon position relative to player
            this.idleWeaponVector = scaleVectorMagnitude(idleWeaponDistance, player.x, player.y, pointer.x, pointer.y);

            idleWeaponX = player.x + this.idleWeaponVector.x;
            idleWeaponY = player.y + this.idleWeaponVector.y;

            if(idleWeaponExists){
                // Player idle weapon update position & angle
                if(!player.idleWeapon.isStuck){
                    player.idleWeapon.setAngle(this.weaponAngle);
                }
                player.idleWeapon.setPosition(idleWeaponX, idleWeaponY);
                // if(player.idleWeapon.x < player.x){
                //     player.idleWeapon.body.setOffset(player.idleWeapon.width/2 - 15, player.idleWeapon.height/2 - 5);
                // }
                // if(player.idleWeapon.x > player.x){
                //     player.idleWeapon.body.setOffset(player.idleWeapon.width/2 + 10, player.idleWeapon.height/2 - 5);
                // }
                // player.idleWeapon.body.setOffset(player.idleWeapon.width/2, player.idleWeapon.height/2);
            }

            // this.corruptionSiphon.x = this.x;
            // this.corruptionSiphon.y = this.y;

            this.damageText.x = this.body.x + 15;
            this.damageText.y = this.body.y - 40;

            // Player flip sprite when mouse on left/right of player character
            if(pointer.x < player.x){
                this.setFlipX(true);
            } else {
                this.setFlipX(false);
            }

            // Pause corruption decay timer when corruption is 0
            if(corruption == 0){
                this.scene.corruptionDecayTimer.pause = true;
            } else {
                this.scene.corruptionDecayTimer.pause = false;
            }

            this.displayCorruptionExpire();

            // displayCooldown(cooldownText, cooldownBox, cooldownTimer, cooldownTime)
            if(switchOnCooldown) {
                displayCooldown(this.hudScene.switchCooldownText, this.hudScene.switchCooldownBox, this.switchCooldown, this.switchCooldown.delay, this.hudScene.switchCDImage);
            } else {
                this.hudScene.switchCDImage.setAlpha(1);
                this.hudScene.switchCooldownText.setText("");
                this.hudScene.switchCooldownBox.setSize(cooldownBoxWidth, cooldownBoxHeight);
            }

            if (Phaser.Input.Keyboard.JustDown(keyDebug)) {
                if(this.scene.physics.world.debugGraphic.alpha == 1){
                    this.scene.physics.world.debugGraphic.setAlpha(0);
                } else {
                    this.scene.physics.world.debugGraphic.setAlpha(1);
                }
            }

            if(Phaser.Input.Keyboard.JustDown(keySuicide)) {
                this.playerHit(pMaxHealth);
            }
            if(Phaser.Input.Keyboard.JustDown(keyGodmode)) {
                if(!isGodmode) {
                    isGodmode = true;
                    pCurrHealth += 100;
                    knifeThrowROF = 1;
                    orbShootROF = 1;
                    switchCooldown = 1;
                } else {
                    isGodmode = false;
                    pCurrHealth = pMaxHealth;
                    knifeThrowROF = this.originalKROF;
                    orbShootROF = this.originalOROF;
                    switchCooldown = this.originalSCD;
                }
            }
        }
    }

    playerHit(damage) {
        if(!isInvuln) {
            isInvuln = true;
            pCurrHealth -= damage;

            if(this.damageTextDisappearing){
                this.damageTextTimer.destroy();
            }
            this.damageText.setAlpha(0);
            this.damageTextTimer = this.scene.time.delayedCall(50, () => {
                this.damageText.setAlpha(1);
            }, null, this.scene);
            this.damageText.setText(damage);
            this.damageTextDisappearing = true;
            this.damageTextTimer = this.scene.time.delayedCall(2000, () => {
                this.damageTextDisappearing = false;
                this.damageText.setAlpha(0);
            }, null, this.scene);

            // Player dead
            if(pCurrHealth <= 0) {
                if(idleWeaponExists) {
                    this.idleWeapon.destroy();
                }
                if(usingCorruption) {
                    this.corruptionExpireTimer.destroy();
                }
                // Effects
                this.particleTrail.stop();
                this.corruptionBleed.explode(20 + 2*damage);
                this.scene.cameras.main.flash(1000, 218, 112, 214);
                this.scene.cameras.main.shake(1000, 0.01);
                this.scene.sound.play('playerDeath');

                isGameOver = true;
                this.setImmovable(true);
                this.setAlpha(0);
                this.gameOverTimer = this.scene.time.delayedCall(deathFadeDelay, function () {
                    this.hudScene.cameras.main.fadeOut(deathFadeDuration, 0, 0, 0);
                    this.gameOverTimer = this.scene.time.delayedCall(deathFadeDuration, function () {
                        player.particleTrail.remove();
                        this.scene.scene.stop('playScene');
                        this.scene.scene.stop('hudScene');
                        this.scene.scene.stop('menuScene');
                        this.scene.scene.start('gameOverScene');
                    }, this, this);
                }, this, this);
            // Player hit, but not dead
            } else {
                // Effects
                this.randHurt = Math.random();
                if(this.randHurt < 0.5) {
                    this.scene.sound.play('playerHurt1');
                } else {
                    this.scene.sound.play('playerHurt2');
                }
                this.corruptionBleed.explode(4 + 2*damage);
                this.setAlpha(0.2);
                // this.scene.cameras.main.flash(100, 218, 112, 214);
                this.scene.cameras.main.shake(500, 0.005);
                // Set invuln timer
                this.invulnTimer = this.scene.time.delayedCall(invulnDuration, function () {
                    isInvuln = false;
                    player.setAlpha(1);
                }, null, this.scene);
            }
        }
    }

    displayCorruptionExpire() {
        if(corruption == 0) {
            this.corruptionExpiring = false;
        }
        if(this.corruptionExpiring) {
            this.cooldownBoxDecrease = expireBoxWidth * this.corruptionExpireTimer.getElapsed() / corruptionExpireDelay;
            this.hudScene.corruptionCooldownBox.setSize(expireBoxWidth - this.cooldownBoxDecrease, expireBoxHeight);
            this.hudScene.corruptionCooldownBox.setPosition(corruptionExpireX + this.cooldownBoxDecrease/2, corruptionExpireY);
        } else {
            this.hudScene.corruptionCooldownBox.setPosition(corruptionExpireX, corruptionExpireY);
            this.hudScene.corruptionCooldownBox.setSize(0, 0);
        }
        
    }
}