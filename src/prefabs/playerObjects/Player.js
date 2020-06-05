class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, hudScene, pSpawnX, pSpawnY) {
        super(scene, pSpawnX, pSpawnY, 'redPlayer').setOrigin(0.5, 0.5);

        playerState = 0;

        let player = this;
        this.scene = scene;
        this.hudScene = hudScene;

        var hudScene = game.scene.keys.hudScene;

        this.canUseCorruption = true;
        this.isSceneTransfer = false;

        this.currentRoom = 1;
        this.previousRoom = null;
        this.roomChange = false;
        this.canMove = true;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        scene.physics.add.collider(player,  scene.wallsLayer);
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

        this.keyStart = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.keyPause = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        
        this.corruptionExpiring = false;

        this.idleWeapon;
        idleWeaponExists = false;

        this.weaponMine;
        this.weaponMineExists = false;

        this.playerAccel = playerAccel;

        this.originalKROF = knifeThrowROF;
        this.originalOROF = orbShootROF;
        this.originalSCD = switchCooldown;
        this.originalMMV = maxMoveVelocity;
        this.originalPA = playerAccel;
        this.originalPSD = playerStopDrag;

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
            fontSize: '40px',
            color: "#8B008B",
            stroke: '#000000',
            strokeThickness: enemyStrokeThickness,
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

        this.emitCircle = new Phaser.Geom.Circle(this.x, this.y, 20);

        this.corruptionBleed = corruptionParticles.createEmitter({
            emitZone: { source: this.emitCircle },
            alpha: { start: 1, end: 0 },
            scale: { start: 1, end: 0 },
            lifespan: { min: 1500, max: 2000 },
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
        scene.corruptCircle = scene.add.ellipse(this.x, this.y, 400, 400);
        scene.corruptCircle.setFillStyle(darkMagenta);
        scene.corruptCircle.setAlpha(0);

        let outerRadius = 80;
        let innerRadius = 40;
        let cornerReduce = 1.25
        this.outerRotation = 0.05;
        this.innerRotation = 0.1;

        this.corrupt1 = scene.add.sprite(outerRadius, 0, 'corruptionParticle').setOrigin(0.5, 0.5).setScale(1);
        this.corrupt2 = scene.add.sprite(0, outerRadius, 'corruptionParticle').setOrigin(0.5, 0.5).setScale(1);
        this.corrupt3 = scene.add.sprite(-outerRadius, 0, 'corruptionParticle').setOrigin(0.5, 0.5).setScale(1);
        this.corrupt4 = scene.add.sprite(0, -outerRadius, 'corruptionParticle').setOrigin(0.5, 0.5).setScale(1);
        this.corrupt5 = scene.add.sprite(innerRadius, innerRadius, 'corruptionParticle').setOrigin(0.5, 0.5).setScale(1);
        this.corrupt6 = scene.add.sprite(-innerRadius, -innerRadius, 'corruptionParticle').setOrigin(0.5, 0.5).setScale(1);
        this.corrupt7 = scene.add.sprite(-innerRadius, innerRadius, 'corruptionParticle').setOrigin(0.5, 0.5).setScale(1);
        this.corrupt8 = scene.add.sprite(innerRadius, -innerRadius, 'corruptionParticle').setOrigin(0.5, 0.5).setScale(1);
        this.corrupt9 = scene.add.sprite(-innerRadius, -innerRadius, 'corruptionParticle').setOrigin(0.5, 0.5).setScale(1);
        this.corrupt10 = scene.add.sprite(innerRadius, -innerRadius, 'corruptionParticle').setOrigin(0.5, 0.5).setScale(1);
        this.corrupt11 = scene.add.sprite(-innerRadius, innerRadius, 'corruptionParticle').setOrigin(0.5, 0.5).setScale(1);
        this.corrupt12 = scene.add.sprite(innerRadius, innerRadius, 'corruptionParticle').setOrigin(0.5, 0.5).setScale(1);
        this.corrupt13 = scene.add.sprite(0, -outerRadius/cornerReduce, 'corruptionParticle').setOrigin(0.5, 0.5).setScale(1);
        this.corrupt14 = scene.add.sprite(-outerRadius/cornerReduce, 0, 'corruptionParticle').setOrigin(0.5, 0.5).setScale(1);
        this.corrupt15 = scene.add.sprite(0, outerRadius/cornerReduce, 'corruptionParticle').setOrigin(0.5, 0.5).setScale(1);
        this.corrupt16 = scene.add.sprite(outerRadius/cornerReduce, 0, 'corruptionParticle').setOrigin(0.5, 0.5).setScale(1);
        this.corruptContainer1 = scene.add.container(0, 0, [ this.corrupt1, this.corrupt2, this.corrupt3, this.corrupt4, this.corrupt5, this.corrupt6, this.corrupt7, this.corrupt8 ]);
        this.corruptContainer2 = scene.add.container(0, 0, [ this.corrupt9, this.corrupt10, this.corrupt11, this.corrupt12, this.corrupt13, this.corrupt14, this.corrupt15, this.corrupt16 ]);
        this.corruptContainer1.setSize(10, 10);
        this.corruptContainer2.setSize(10, 10);

        this.corrupt1.setAlpha(0);
        this.corrupt2.setAlpha(0);
        this.corrupt3.setAlpha(0);
        this.corrupt4.setAlpha(0);
        this.corrupt5.setAlpha(0);
        this.corrupt6.setAlpha(0);
        this.corrupt7.setAlpha(0);
        this.corrupt8.setAlpha(0);
        this.corrupt9.setAlpha(0);
        this.corrupt10.setAlpha(0);
        this.corrupt11.setAlpha(0);
        this.corrupt12.setAlpha(0);
        this.corrupt13.setAlpha(0);
        this.corrupt14.setAlpha(0);
        this.corrupt15.setAlpha(0);
        this.corrupt16.setAlpha(0);

        this.shiftCircleBurst = this.scene.tweens.add({
            targets: scene.shiftCircle,
            paused: true,
            scale: { from: 0, to: 1},
            alpha: { from: 0.2, to: 0},
            ease: 'Sine.easeIn',
            duration: switchEffectsDuration,
            onComplete: function() {
                this.shiftCircle.setActive(false);
            },
            onCompleteScope: scene
        });

        this.corruptCircleBloom = this.scene.tweens.add({
            targets: scene.corruptCircle,
            paused: true,
            scale: { from: 0.5, to: 1},
            alpha: { from: 1, to: 0},
            ease: 'Quart.easeOut',
            duration: 1000,
            onComplete: function() {
                // this.corruptCircle.setActive(false);
                this.corruptCircle.setAlpha(0);
            },
            onCompleteScope: scene
        });
        this.corruptContainerFade = this.scene.tweens.add({
            targets: [ this.corrupt1, this.corrupt2, this.corrupt3, this.corrupt4, this.corrupt5, this.corrupt6, this.corrupt7, this.corrupt8, this.corrupt9, this.corrupt10, this.corrupt11, this.corrupt12, this.corrupt13, this.corrupt14, this.corrupt15, this.corrupt16 ],
            paused: true,
            alpha: { from: 1, to: 0},
            ease: 'Quart.easeOut',
            duration: 500,
            onComplete: function() {
                this.corrupt1.setAlpha(0);
                this.corrupt2.setAlpha(0);
                this.corrupt3.setAlpha(0);
                this.corrupt4.setAlpha(0);
                this.corrupt5.setAlpha(0);
                this.corrupt6.setAlpha(0);
                this.corrupt7.setAlpha(0);
                this.corrupt8.setAlpha(0);
                this.corrupt9.setAlpha(0);
                this.corrupt10.setAlpha(0);
                this.corrupt11.setAlpha(0);
                this.corrupt12.setAlpha(0);
                this.corrupt13.setAlpha(0);
                this.corrupt14.setAlpha(0);
                this.corrupt15.setAlpha(0);
                this.corrupt16.setAlpha(0);
            },
            onCompleteScope: this
        });

        this.playerCursor = scene.add.sprite(0, 0, 'redReticle').setOrigin(0.5, 0.5).setDepth(10000);
    }


    update() {
        this.playerCursor.setPosition(pointer.worldX, pointer.worldY);
        if(playerState == 0) {
            if(usingCorruption) {
                this.playerCursor.setTexture('corruptRedRet');
                // this.scene.input.setDefaultCursor('url(assets/images/corruptRedRet.png), pointer');
            } else {
                this.playerCursor.setTexture('redReticle');
                // this.scene.input.setDefaultCursor('url(assets/images/redReticle.png), pointer');
            }
        } else {
            if(usingCorruption) {
                this.playerCursor.setTexture('corruptBlueRet');
                // this.scene.input.setDefaultCursor('url(assets/images/corruptBlueRet.png), pointer');
            } else {
                this.playerCursor.setTexture('blueReticle');
                // this.scene.input.setDefaultCursor('url(assets/images/blueReticle.png), pointer');
            }
        }

        this.getRoom();
        this.scene.shiftCircle.setPosition(this.x, this.y);
        this.scene.corruptCircle.setPosition(this.x, this.y);
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
                // this.scene.sound.play('switch');
                pStats.switchNum++;
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
                    idleWeaponExists = false;                    
                }
                // Start corruption shot window
                if(this.canUseCorruption && corruption != 0 && !usingCorruption) {
                    // Increase player speed 
                    this.body.setMaxVelocity(playerCorruptMaxVelocity, playerCorruptMaxVelocity);
                    this.playerAccel = playerCorruptAccel;
                    this.particleTrail.start();

                    this.corrupt1.setAlpha(1);
                    this.corrupt2.setAlpha(1);
                    this.corrupt3.setAlpha(1);
                    this.corrupt4.setAlpha(1);
                    this.corrupt5.setAlpha(1);
                    this.corrupt6.setAlpha(1);
                    this.corrupt7.setAlpha(1);
                    this.corrupt8.setAlpha(1);
                    this.corrupt9.setAlpha(1);
                    this.corrupt10.setAlpha(1);
                    this.corrupt11.setAlpha(1);
                    this.corrupt12.setAlpha(1);
                    this.corrupt13.setAlpha(1);
                    this.corrupt14.setAlpha(1);
                    this.corrupt15.setAlpha(1);
                    this.corrupt16.setAlpha(1);
                    // this.scene.corruptCircle.setActive(true);
                    // this.corruptCircleBloom.play();

                    usingCorruption = true;
                    this.scene.corruptionDecayTimer.paused = true;
                    this.corruptionExpiring = true;
                    // Start timer for corruption charges to expire after not being used
                    this.corruptionExpireTimer = this.scene.time.delayedCall(corruptionExpireDelay, function () {
                        this.corruptionExpiring = false;
                        player.corruptContainerFade.play();
                        corruption = 0;
                        usingCorruption = false;
                        player.scene.corruptionDecayTimer.paused = false;
                        if(idleWeaponExists) {
                            player.idleWeapon.corrupted = false;
                        }
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

                switchOnCooldown = true;
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
                this.shiftCircleBurst.play();
            }
                
            if(!usingCorruption) {
                this.body.setMaxVelocity(maxMoveVelocity, maxMoveVelocity);
                this.playerAccel = this.playerAccel;
                this.particleTrail.stop();
            }

            this.emitCircle.setPosition(this.x, this.y);

            this.playerX = player.x;
            this.playerY = player.y;


            // Calculate angle to set on idleWeapon sprite (toward pointer)
            this.weaponAngle =  Phaser.Math.RadToDeg(Phaser.Math.Angle.Between(this.playerX, this.playerY, pointer.worldX, pointer.worldY));
            // Calculate x, y idleWeapon position relative to player
            this.idleWeaponVector = scaleVectorMagnitude(idleWeaponDistance, this.playerX, this.playerY, pointer.worldX, pointer.worldY);
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
            if(pointer.worldX < player.x){
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

            this.corruptContainer1.rotation += this.outerRotation;
            this.corruptContainer1.x = this.body.x + 15;
            this.corruptContainer1.y = this.body.y + 20;
            this.corruptContainer2.rotation -= this.innerRotation;
            this.corruptContainer2.x = this.body.x + 15;
            this.corruptContainer2.y = this.body.y + 20;

            // displayCooldown(cooldownText, cooldownBox, cooldownTimer, cooldownTime)
            if(switchOnCooldown) {
                displayCooldown(this.hudScene.switchCooldownText, this.hudScene.switchCooldownBox, this.switchCooldown, this.switchCooldown.delay, this.hudScene.switchCDImage);
            } else {
                this.hudScene.switchCDImage.setAlpha(1);
                this.hudScene.switchCooldownText.setText("");
                this.hudScene.switchCooldownBox.setSize(cooldownBoxWidth, cooldownBoxHeight);
            }

            if (Phaser.Input.Keyboard.JustDown(this.keyStart) || Phaser.Input.Keyboard.JustDown(this.keyPause)) {
                if(!isGameOver) {
                    gameplayBGM.pause();
                    this.playerCursor.setVisible(false);
                    isPaused = true;
                    this.scene.scene.pause(currScene);
                    this.scene.scene.pause('hudScene');
                    this.scene.scene.setVisible(false, 'hudScene');
                    this.scene.scene.run('menuScene');
                    this.scene.scene.bringToTop('menuScene');
                    this.scene.scene.setVisible(true, 'menuScene');
                }
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
                    isInvuln = true;
                    this.playerHeal(pMaxHealth);
                    knifeThrowROF = 1;
                    orbShootROF = 1;
                    switchCooldown = 1;
                    maxMoveVelocity = 1000;
                    playerAccel = 2000;
                    playerStopDrag = 1200;
                    this.setTint(darkMagenta);
                } else {
                    isInvuln = false;
                    isGodmode = false;
                    pCurrHealth = pMaxHealth;
                    knifeThrowROF = this.originalKROF;
                    orbShootROF = this.originalOROF;
                    switchCooldown = this.originalSCD;
                    maxMoveVelocity = this.originalMMV;
                    playerAccel = this.originalPA;
                    playerStopDrag = this.originalPSD;
                    this.clearTint();
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
                this.scene.tweens.add({
                    targets: gameplayBGM,
                    volume: 0,
                    ease: 'Linear',
                    duration: 3000,
                });
                // gameplayBGM.stop();
                this.corrupt1.setAlpha(0);
                this.corrupt2.setAlpha(0);
                this.corrupt3.setAlpha(0);
                this.corrupt4.setAlpha(0);
                this.corrupt5.setAlpha(0);
                this.corrupt6.setAlpha(0);
                this.corrupt7.setAlpha(0);
                this.corrupt8.setAlpha(0);
                this.corrupt9.setAlpha(0);
                this.corrupt10.setAlpha(0);
                this.corrupt11.setAlpha(0);
                this.corrupt12.setAlpha(0);
                this.corrupt13.setAlpha(0);
                this.corrupt14.setAlpha(0);
                this.corrupt15.setAlpha(0);
                this.corrupt16.setAlpha(0);
                this.particleTrail.stop();
                this.corruptionBleed.explode(20 + 2*damage);
                this.scene.cameras.main.flash(500, 218, 112, 214);
                this.scene.cameras.main.shake(500, 0.01);
                this.scene.sound.play('playerDeath');

                isGameOver = true;
                this.setImmovable(true);
                this.setAlpha(0);
                this.gameOverTimer = this.scene.time.delayedCall(deathFadeDelay, function () {
                    this.hudScene.cameras.main.fadeOut(deathFadeDuration, 0, 0, 0);
                    this.gameOverTimer = this.scene.time.delayedCall(deathFadeDuration, function () {
                        player.particleTrail.remove();
                        this.scene.scene.stop(currScene);
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

    playerHeal(healNum) {
        if(pCurrHealth + healNum <= pMaxHealth) {
            pCurrHealth += healNum;
        } else {
            pCurrHealth = pMaxHealth;
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

    getRoom() {

        // place holder for current room.
        let roomNumber;

        // loop through rooms in this level.
        for (let room in this.scene.rooms) {
            let roomLeft   = this.scene.rooms[room].x;
            let roomRight  = this.scene.rooms[room].x + this.scene.rooms[room].width;
            let roomTop    = this.scene.rooms[room].y;
            let roomBottom = this.scene.rooms[room].y + this.scene.rooms[room].height;

            // console.log(roomLeft + " " + roomRight + " " + roomTop + " " + roomBottom);

            // Player is within the boundaries of this room.
            if (this.x > roomLeft && this.x < roomRight &&
                this.y > roomTop  && this.y < roomBottom) {

                roomNumber = room;
            }
        }

        // Update player room variables.
        if (roomNumber != this.currentRoom) {
            this.previousRoom = this.currentRoom;
            this.currentRoom = roomNumber;
            this.roomChange = true;
        } else {
            this.roomChange = false;
        }
    }

    sceneTransfer(destinationKey) {
        this.isSceneTransfer = true;
        if(idleWeaponExists) {
            this.idleWeapon.destroy();
        }
        if(usingCorruption) {
            this.corruptionExpireTimer.destroy();
        }
        isInvuln = false;
        isGodmode = false;
        pCurrHealth = pMaxHealth;
        knifeThrowROF = this.originalKROF;
        orbShootROF = this.originalOROF;
        switchCooldown = this.originalSCD;
        maxMoveVelocity = this.originalMMV;
        playerAccel = this.originalPA;
        // Effects
        game.scene.keys.hudScene.cameras.main.fadeOut(deathFadeDuration, 0, 0, 0);

        this.setImmovable(true);
        this.cleanUpTimer = this.scene.time.delayedCall(deathFadeDelay, function () {
            this.gameOverTimer = this.scene.time.delayedCall(deathFadeDuration, function () {
                player.particleTrail.remove();
                this.scene.scene.stop(currScene);
                this.scene.scene.stop('hudScene');
                this.scene.scene.stop('menuScene');
                this.scene.scene.start(destinationKey);
            }, this, this);
        }, this, this);
    }
}