class Dummy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, oSpawnX, oSpawnY, state, redGroup, blueGroup, redBulletGroup, blueBulletGroup, flip, isShooter, shotX, shotY) {
        if(state == 0){
            super(scene, oSpawnX, oSpawnY, 'redChaser');
        } else {
            super(scene, oSpawnX, oSpawnY, 'blueChaser');
        }

        this.setTint(0x555555);
        this.setFlipX(flip);
        this.setOrigin(0.5, 0.5);

        // Scope parameters to this instance
        let enemy = this;
        this.enemy = enemy;
        this.scene = scene;
        this.oSpawnX = oSpawnX;
        this.oSpawnY = oSpawnY;
        this.state = state;
        this.redGroup = redGroup;
        this.blueGroup = blueGroup;
        this.redBulletGroup = redBulletGroup;
        this.blueBulletGroup = blueBulletGroup;
        this.isShooter = isShooter;
        this.shotX = shotX;
        this.shotY = shotY;

        // Enemy variables
        this.targetX = 0;
        this.targetY = 0;
        this.damage = 0;
        this.isDummy = true;
        this.shooting = false;
        this.switching = false;
        this.moving = false;
        this.exists = true;
        this.damaged = false;
        this.orbDamageInvuln = false;
        this.orbBlockInvuln = false
        this.damageTextDisappearing = false;
        this.maxHealth = 10;
        this.health = this.maxHealth;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setDrag(enemyDrag, enemyDrag);
        this.body.setMaxVelocity(chaserConfig.maxVel, chaserConfig.maxVel);

        this.healthTextConfig = {
            fontFamily: 'Courier',
            fontSize: '22px',
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
        if(this.state == 0) {
            this.healthTextConfig.color = '#DC143C';
        } else {
            this.healthTextConfig.color = '#4169E1';
        }
        this.damageTextConfig = {
            fontFamily: 'Courier',
            fontSize: '32px',
            align: 'center',
            stroke: '#8B008B',
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

        // Add enemy text
        this.damageText = scene.add.text(this.x, this.y - 40, "", this.damageTextConfig).setOrigin(0.5, 0.5).setDepth(1000);
        this.healthText = scene.add.text(this.x, this.y, this.health + "/" + this.maxHealth, this.healthTextConfig).setOrigin(0.5, 0.5).setDepth(1000);

        if(isShooter) {
            enemy.shooting = true;

            this.shootTimer = this.scene.time.addEvent({
                delay: 1000, 
                callback: () => {
                    if(enemy.shooting && inTutorial && !this.stunned) {
                        // Update shooting target
                        this.targetX = this.x + this.shotX * 5;
                        this.targetY = this.y + this.shotY * 5;
                        this.shoot();
                        
                    }
                }, 
                callbackContext: scene,
                loop: true,
            });
        }

        // Dummy moves back to its spawn point
        enemy.moving = true;
        enemy.moveTimer = scene.time.addEvent({
            delay: chaserConfig.moveDelay, 
            callback: () => {
                if(inTutorial && enemy.moving) {

                    // Calculate new accel vector
                    enemy.accelVector = scaleVectorMagnitude(chaserConfig.accel*2, enemy.x, enemy.y, enemy.oSpawnX, enemy.oSpawnY)
    
                    enemy.body.setAcceleration(enemy.accelVector.x, enemy.accelVector.y);
    
                }
            }, 
            callbackContext: scene,
            loop: true,
        });

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

        this.stun1 = scene.add.sprite(12, 0, 'stunParticle').setOrigin(0.5, 0.5).setScale(0.25);
        this.stun2 = scene.add.sprite(0, 12, 'stunParticle').setOrigin(0.5, 0.5).setScale(0.25);
        this.stun3 = scene.add.sprite(-12, 0, 'stunParticle').setOrigin(0.5, 0.5).setScale(0.25);
        this.stun4 = scene.add.sprite(0, -12, 'stunParticle').setOrigin(0.5, 0.5).setScale(0.25);
        this.stunStars = scene.add.container(0, 0, [ this.stun1, this.stun2, this.stun3, this.stun4 ]);
        this.stunStars.setSize(16, 16);
    }

    update() {
        if(!inTutorial){
            // this.damageTextTimer.destroy();
            this.healthText.destroy();
            this.damageText.destroy();
            this.corruptionBleed.remove();
            if(this.shooting) {
                this.shooting = false;
                this.shootTimer.destroy();
            }
            if(this.moving) {
                this.moveTimer.destroy();
            }
            this.stunStars.destroy();
            this.stun1.destroy();
            this.stun2.destroy();
            this.stun3.destroy();
            this.stun4.destroy();
            
            this.destroy();
        }

        // Stop moving if close enough to its spawn
        if(inTutorial && this.x < this.oSpawnX + 30 && this.x > this.oSpawnX - 30 &&
            this.y < this.oSpawnY + 30 && this.y > this.oSpawnY - 30 && !this.stunned) {
            this.body.stop();
        }
        // Pause shooting if switching or stunned
        if(inTutorial && this.isShooting) {
            if (!this.switching && !this.stunned) {
                this.shootTimer.paused = false;
            } else {
                this.shootTimer.paused = true;
            }
        }

        if(!this.stunned) {
            this.stun1.setAlpha(0);
            this.stun2.setAlpha(0);
            this.stun3.setAlpha(0);
            this.stun4.setAlpha(0);
        } else {
            this.stun1.setAlpha(1);
            this.stun2.setAlpha(1);
            this.stun3.setAlpha(1);
            this.stun4.setAlpha(1);
        }

        // Update text positions
        if(inTutorial) {
            this.healthText.x = this.body.x + 35;
            this.healthText.y = this.body.y - 10;
            this.damageText.x = this.body.x + 35;
            this.damageText.y = this.body.y - 35;

            this.stunStars.rotation += 0.1;
            this.stunStars.x = this.body.x + 35;
            this.stunStars.y = this.body.y + 5;
        }
    }

    takeDamage(damage, isCorrupt){
        this.health -= damage;
        this.healthText.setText(this.health + "/" + this.maxHealth);

        this.damaged = true;
        // Update text
        if(this.damageTextDisappearing){
            this.damageTextTimer.destroy();
        }
        this.damageText.setAlpha(0);
        this.damageTextTimer = this.scene.time.delayedCall(50, () => {
            this.damageText.setAlpha(1);
        }, null, this.scene);
        if(player.canUseCorruption && isCorrupt) {
            this.damageText.setFill('#8B008B');
            this.damageText.setStroke('#FF00FF', 3);
            this.damageText.setFontSize(38);
        } else {
            this.damageText.setFill('#000000');
            this.damageText.setStroke('#8B008B', 3);
            this.damageText.setFontSize(28);
        }
        this.damageText.setText(damage);
        this.damageTextDisappearing = true;
        this.damageTextTimer = this.scene.time.delayedCall(1000, () => {
            this.damageTextDisappearing = false;
            this.damageText.setAlpha(0);
        }, null, this.scene);    

        // Hurt but alive
        if(this.health > 0) {
            // Effects
            this.emitCircle.setPosition(this.x, this.y);
            this.corruptionBleed.explode(2 + 2*damage);
        // Dead
        } else {
            this.exists = false;
            this.moving = false;
            this.body.stop();
            this.emitCircle.setPosition(this.x, this.y);
            this.corruptionBleed.explode(8 + 2*damage);
            // Remove active timers & functions
            if(this.moving) {
                this.moveTimer.paused = true;
            }
            this.setAlpha(0.05);
            // Wait to remove enemy corpse & text 
            this.destroyTimer = this.scene.time.delayedCall(enemyDestroyDelay, () => {
                this.corruptionBleed.stop();
                if(inTutorial) {
                    this.scene.time.delayedCall(particleDestroy, () => {
                        this.corruptionBleed.remove();
                    }, null, this);
                    // Reset dummy position and revive
                    this.body.reset(this.oSpawnX, this.oSpawnY);
                    this.health = this.maxHealth;
                    this.healthText.setText(this.health + "/" + this.maxHealth);
                    this.moveTimer.paused = false;
                    this.moving = true;
                    this.exists = true;
                    this.setAlpha(1);
                }
            }, null, this);
        }
    }

    shoot() {
        // EnemyBulletGroup.addBullet(state, spawnX, spawnY, targetX, targetY)
        if(this.state == 0) {
            this.redBulletGroup.addBullet(this.state, this.x, this.y, this.targetX, this.targetY);
        }
        if(this.state == 1) {
            this.blueBulletGroup.addBullet(this.state, this.x, this.y, this.targetX, this.targetY);
        }
    }
}