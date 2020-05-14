class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, pSpawnX, pSpawnY) {
        super(scene, pSpawnX, pSpawnY, 'redPlayer').setOrigin(0.5, 0.5);

        playerState = 0;

        let player = this;
        this.scene = scene;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        this.setDepth(999);

        this.body.setSize(30, 50);
        this.body.setMaxVelocity(maxMoveVelocity, maxMoveVelocity);

        keyLeft = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyRight = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyUp = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyDown = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keySwitch = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        
        // this.idleWeapon = scene.add.sprite(centerX, centerY, 'redObstacle').setScale(0.1, 0.1);
        this.idleWeapon;
        idleWeaponExists = false;

        scene.corruptionDecayTimer = scene.time.addEvent({
            delay: corruptionDecayDelay,
            callback: () => {
                if(corruption != 0){
                    corruption--;
                }
            },
            callbackContext: scene,
            loop: true,
        });
    }


    update() {
        if(!isGameOver){
            // Player movement
            if(keyLeft.isDown || keyRight.isDown || keyUp.isDown || keyDown.isDown){
                if(keyLeft.isDown || keyRight.isDown){
                    if(keyLeft.isDown) {
                        this.body.velocity.x -= playerRunAccel;
                    } else if(keyRight.isDown) {
                        this.body.velocity.x += playerRunAccel;
                    } else {
                        this.body.setDragX(playerStopDrag);
                    }
                }
                if(keyUp.isDown || keyDown.isDown){
                    if(keyUp.isDown) {
                        this.body.velocity.y -= playerRunAccel;
                    }
                    if(keyDown.isDown) {
                        this.body.velocity.y += playerRunAccel;
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
                if(idleWeaponExists){
                    this.idleWeapon.destroy();
                    idleWeaponExists = false;
                    this.idleWeapon = null;
                }
                // Start corruption shot window
                if(corruption != 0 && !usingCorruption) {
                    usingCorruption = true;
                    this.scene.corruptionDecayTimer.paused = true;
                    // Start timer for corruption charges to expire after not being used
                    this.corruptionExpireTimer = this.scene.time.delayedCall(corruptionExpireDelay, function () {
                        corruption = 0;
                        usingCorruption = false;
                        player.scene.corruptionDecayTimer.paused = false;
                    }, null, this.scene);
                // Remove corruption if switch again
                } else if(usingCorruption) {
                    corruption = 0;
                    usingCorruption = false;
                    this.scene.corruptionDecayTimer.paused = false;
                    this.corruptionExpireTimer.destroy();
                }

                this.switchCooldown = this.scene.time.delayedCall(switchCooldown, function () {
                    switchOnCooldown = false;
                }, null, this.scene);
            }

            // Calculate angle to set on idleWeapon sprite (toward pointer)
            this.weaponAngle =  Phaser.Math.RadToDeg(Phaser.Math.Angle.Between(player.x, player.y, pointer.x, pointer.y));
            // Calculate x, y idleWeapon position relative to player
            this.idleWeaponVector = scaleVectorMagnitude(idleWeaponDistance, player.x, player.y, pointer.x, pointer.y);

            idleWeaponX = player.x + this.idleWeaponVector.x;
            idleWeaponY = player.y + this.idleWeaponVector.y;

            if(idleWeaponExists){
                // Player idle weapon update position & angle
                player.idleWeapon.setAngle(this.weaponAngle);
                player.idleWeapon.setPosition(idleWeaponX, idleWeaponY);
                // if(player.idleWeapon.x < player.x){
                //     player.idleWeapon.body.setOffset(player.idleWeapon.width/2 - 15, player.idleWeapon.height/2 - 5);
                // }
                // if(player.idleWeapon.x > player.x){
                //     player.idleWeapon.body.setOffset(player.idleWeapon.width/2 + 10, player.idleWeapon.height/2 - 5);
                // }
                // player.idleWeapon.body.setOffset(player.idleWeapon.width/2, player.idleWeapon.height/2);
            }

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
        }
    }

    playerHit(damage) {
        if(!isInvuln){
            isInvuln = true;
            pCurrHealth -= damage;
            // Player dead
            if(pCurrHealth <= 0){
                // Camera effects
                this.scene.cameras.main.flash(1000);
                this.scene.cameras.main.shake(1000, 0.01);
                isGameOver = true;
                this.setImmovable(true);
                this.setAlpha(0.2);
                this.gameOverTimer = this.scene.time.delayedCall(pDeathDelay, function () {
                    this.scene.stop('playScene');
                    this.scene.stop('hudScene');
                    this.scene.start('gameOverScene');
                }, this, this.scene);

            } else {
                // Set invuln timer
                this.setAlpha(0.5);
                // Camera effects
                this.scene.cameras.main.flash(200);
                this.invulnTimer = this.scene.time.delayedCall(invulnDuration, function () {
                    isInvuln = false;
                    player.setAlpha(1);
                }, null, this.scene);
            }
        }
    }
}