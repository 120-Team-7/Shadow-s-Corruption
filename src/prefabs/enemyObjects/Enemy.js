class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, oSpawnX, oSpawnY, state, changeCondition, redGroup, blueGroup, redTexture, blueTexture, maxHealth, damage) {
        if(state == 0){
            super(scene, oSpawnX, oSpawnY, redTexture);
        } else {
            super(scene, oSpawnX, oSpawnY, blueTexture);
            this.setAlpha(0.4);
        }

        // Scope parameters to this instance
        let enemy = this;
        this.enemy = enemy;
        this.scene = scene;
        this.state = state;
        this.changeCondition = changeCondition;
        this.redGroup = redGroup;
        this.blueGroup = blueGroup;
        this.redTexture = redTexture;
        this.blueTexture = blueTexture;
        this.maxHealth = maxHealth;
        this.damage = damage;

        this.health = this.maxHealth;
        this.isDummy = false;

        // Enemy variables
        this.firstMoved = false;
        this.moving = false;
        this.exists = true;
        this.stunned = false;
        this.damaged = false;
        this.switching = false;
        this.orbDamageInvuln = false;
        this.orbBlockInvuln = false
        this.damageTextDisappearing = false;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setDrag(enemyDrag, enemyDrag);

        if(changeCondition == 'timed') {
            this.timedSwitch();
        }
        if(changeCondition == 'damaged') {
            this.damagedNum = 0;
        }

        this.healthTextConfig = {
            fontFamily: 'Courier',
            fontSize: '18px',
            color: '#000000',
            align: 'center',
            padding: {
                top: 10,
                bottom: 10,
                left: 10,
                right: 10,
            },
            fixedWidth: 0
        }
        this.damageTextConfig = {
            fontFamily: 'Courier',
            fontSize: '25px',
            color: '#000000',
            align: 'center',
            padding: {
                top: 10,
                bottom: 10,
                left: 10,
                right: 10,
            },
            fixedWidth: 0
        }

        // Add enemy text
        this.healthText = scene.add.text(this.x, this.y, this.health + "/" + this.maxHealth, this.healthTextConfig).setOrigin(0.5, 0.5).setDepth(1000);
        this.damageText = scene.add.text(this.x, this.y - 40, "", this.damageTextConfig).setOrigin(0.5, 0.5).setDepth(1000);
    
        this.emitCircle = new Phaser.Geom.Circle(this.x, this.y, 25);

        this.corruptionBleed = corruptionParticles.createEmitter({
            emitZone: { source: this.emitCircle },
            alpha: { start: 1, end: 0 },
            scale: { start: 0.5, end: 0 },
            lifespan: { min: 1000, max: 1500 },
            speedX: { min: -enemyExplodeVel, max: enemyExplodeVel },
            speedY: { min: -enemyExplodeVel, max: enemyExplodeVel },
        });
        this.corruptionBleed.stop();

    }

    update() {
        // this.siphonVector = scaleVectorMagnitude(1000, this.x, this.y, player.x + siphonPredictMult*player.body.velocity.x, player.y + siphonPredictMult*player.body.velocity.y);
        // this.corruptionBleed.forEachAlive(function(particle, emitter) {
        //     particle.accelerationX = this.siphonVector.x;
        //     particle.accelerationY = this.siphonVector.y;
        // }, this)
        // this.corruptionBleed.setSpeedX(this.siphonVector.x);
        // this.corruptionBleed.setSpeedY(this.siphonVector.y);
        this.healthText.x = this.body.x + 25;
        this.healthText.y = this.body.y + 25;
        this.damageText.x = this.body.x + 25;
        this.damageText.y = this.body.y - 20;
    }

    takeDamage(enemy, damage){
        this.health -= damage;
        this.healthText.setText(this.health + "/" + this.maxHealth);

        if(this.changeCondition == 'damaged' && !this.switching && this.moving) {
            this.damageSwitch();
        }
        if(this.damageTextDisappearing){
            this.damageTextTimer.destroy();
        }
        this.damageText.setAlpha(0);
        this.damageTextTimer = this.scene.time.delayedCall(50, () => {
            this.damageText.setAlpha(1);
        }, null, this.scene);
        this.damageText.setText(damage);
        this.damageTextDisappearing = true;
        this.damageTextTimer = this.scene.time.delayedCall(500, () => {
            this.damageTextDisappearing = false;
            this.damageText.setAlpha(0);
        }, null, this.scene);
        // If alive show got hit
        if(this.health > 0){
            this.damaged = true;
            // this.setAlpha(0.2)

            this.emitCircle.setPosition(this.x, this.y);
            this.corruptionBleed.explode(2 + 2*damage);

            // this.damagedTimer = this.scene.time.delayedCall(500, function () {
            //     if(this.exists){
            //         this.damaged = false;
            //         if(this.state == 0) {
            //             this.setAlpha(1);
            //         } else {
            //             this.setAlpha(0.4);
            //         }
            //     }
            // }, null, this);
        // If dead show got hit, stop everything, destroy, show death
        } else {
            this.emitCircle.setPosition(this.x, this.y);
            this.corruptionBleed.explode(8 + 2*damage);
            this.exists = false;
            // Remove active timers & functions
            if(this.moving) {
                this.moveTimer.remove();
                this.startMoving.remove();
            }
            // if(this.damaged) {
            //     this.damagedTimer.remove();
            // }
            if(this.switching) {
                this.switchPause.destroy();
            }
            if(this.changeCondition == 'timed') {
                this.timedSwitch.destroy();
            }
            // Remove physics interactability
            this.body.destroy();
            this.setAlpha(0.05);
            // Wait to remove enemy corpse & text 
            this.destroyTimer = this.scene.time.delayedCall(enemyDestroyDelay, () => {
                this.healthText.destroy();
                this.damageText.destroy();
                this.corruptionBleed.stop();
                this.scene.time.delayedCall(particleDestroy, () => {
                    this.corruptionBleed.remove();
                }, null, this);
                if(this.state == 0){
                    this.redGroup.remove(this, true, true);
                } else {
                    this.blueGroup.remove(this, true, true);
                }
                // Sometimes not destroyed from removes? Redundancy makes sure
                this.destroy();
            }, null, this.scene);
        }
    }

    timedSwitch() {
        this.timedSwitch = this.scene.time.addEvent({
            delay: timedSwitchDelay, 
            callback: () => {
                if(!this.stunned){
                    // Stop enemy->enemy collisions
                    this.body.setImmovable(true);
                    // If was red, change to blue
                    if(this.state == 0){
                        // Pause movement before switching
                        this.switching = true;
                        this.body.stop();
                        this.moveTimer.paused = true;
                        this.timedSwitch.paused = true;
                        this.switchPause = this.scene.time.delayedCall(enemySwitchPause, () => {
                            if(this.health > 0){
                                // eSwitchColor(originalGroup, newGroup)
                                this.eSwitchColor(this.redGroup, this.blueGroup);
                                this.timedSwitch.paused = false;
                                this.switching = false;
                            }
                        }, this.enemy, this.scene);
                    // If was blue, change to red
                    } else {
                        // Pause movement before switching
                        this.switching = true;
                        this.body.stop();
                        this.moveTimer.paused = true;
                        this.timedSwitch.paused = true;
                        this.switchPause = this.scene.time.delayedCall(enemySwitchPause, () => {
                            if(this.health > 0){
                                // eSwitchColor(originalGroup, newGroup)
                                this.eSwitchColor(this.blueGroup, this.redGroup);
                                this.timedSwitch.paused = false;
                                this.switching = false;
                            }
                        }, null, this.scene);
                    }
                }
            }, 
            callbackContext: this.scene,
            loop: true,
        });
    }

    damageSwitch() {
        this.damagedNum++;
        if(this.health > 0 && this.damagedNum == damageSwitchNum) {
            this.damagedNum = 0;
            if(this.state == 0) {
                // Pause movement before switching
                this.switching = true;
                this.body.stop();
                this.moveTimer.paused = true;
                this.switchPause = this.scene.time.delayedCall(enemySwitchPause, () => {
                    if(this.health > 0){
                        // eSwitchColor(originalGroup, newGroup)
                        this.eSwitchColor(this.redGroup, this.blueGroup);
                        this.switching = false;
                    }
                }, this.enemy, this.scene);
            } else {
                // Pause movement before switching
                this.switching = true;
                this.body.stop();
                this.moveTimer.paused = true;
                this.switchPause = this.scene.time.delayedCall(enemySwitchPause, () => {
                    if(this.health > 0){
                        // eSwitchColor(originalGroup, newGroup)
                        this.eSwitchColor(this.blueGroup, this.redGroup);
                        this.switching = false;
                    }
                }, this.enemy, this.scene);
            }
        }
    }

    // Switch enemy color & everything else related
    eSwitchColor(originalGroup, newGroup) {
        let originalState = this.state;
        originalGroup.remove(this); 
        if(this.moving) {
            this.moveTimer.paused = false
        }
        this.body.setImmovable(false);
        if(originalState == 0){
            this.state = 1;
        } else {
            this.state = 0;
        }
        newGroup.add(this);
        if(this.state == 0){
            this.setTexture(this.redTexture);
            this.setAlpha(1);
        } else {
            this.setAlpha(0.4);
            this.setTexture(this.blueTexture);
        }
    }
}