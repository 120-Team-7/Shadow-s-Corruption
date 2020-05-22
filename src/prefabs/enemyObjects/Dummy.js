class Dummy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, oSpawnX, oSpawnY, state, redGroup, blueGroup, redBulletGroup, blueBulletGroup, isShooter, shotX, shotY) {
        if(state == 0){
            super(scene, oSpawnX, oSpawnY, 'redObstacle');
        } else {
            super(scene, oSpawnX, oSpawnY, 'blueObstacle');
        }

        this.setOrigin(0.5, 0.5).setScale(0.25);

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

        this.targetX = 0;
        this.targetY = 0;
        this.damage = 0;
        this.isDummy = true;
        this.shooting = false;
        this.switching = false;
        this.moving = false;

        // Enemy variables
        this.exists = true;
        this.damaged = false;
        this.orbDamageInvuln = false;
        this.orbBlockInvuln = false
        this.damageTextDisappearing = false;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setDrag(enemyDrag, enemyDrag);
        this.body.setMaxVelocity(chaserConfig.maxVel, chaserConfig.maxVel);

        // this.customBounds = new Phaser.Geom.Rectangle(100, 100, screenWidth - 200, screenHeight - 200)
        // console.log(this.customBounds);
        // this.body.setBoundsRectangle(this.customBounds);
        // this.body.setDrag(enemyDrag, enemyDrag);
        // console.log(this.body);

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
        this.damageText = scene.add.text(this.x, this.y - 40, "", this.damageTextConfig).setOrigin(0.5, 0.5).setDepth(1000);

        if(isShooter) {
            enemy.shooting = true;

            this.shootTimer = this.scene.time.addEvent({
                delay: 1000, 
                callback: () => {
                    if(enemy.shooting && inTutorial) {
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

        enemy.moveTimer = scene.time.addEvent({
            delay: chaserConfig.moveDelay, 
            callback: () => {
                enemy.moving = true;
                if(inTutorial) {

                    // Calculate new accel vector
                    enemy.accelVector = scaleVectorMagnitude(chaserConfig.accel, enemy.x, enemy.y, enemy.oSpawnX, enemy.oSpawnY)
    
                    enemy.body.setAcceleration(enemy.accelVector.x, enemy.accelVector.y);
    
                }

                // this.slowDownTimer = scene.time.delayedCall(chaserSlowdownDelay, function () {
                //     // enemy.body.setAcceleration(0, 0);
                //     enemy.slowDown.play();

                // }, this, scene);
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
    }

    update() {
        if(!inTutorial){
            this.corruptionBleed.remove();
            if(this.shooting) {
                this.shooting = false;
                this.shootTimer.destroy();
            }
            if(this.moving) {
                this.moveTimer.destroy();
            }
            this.destroy();
        }

        if(this.x < this.oSpawnX + 30 && this.x > this.oSpawnX - 30 &&
            this.y < this.oSpawnY + 30 && this.y > this.oSpawnY - 30 && !this.stunned) {
            this.body.stop();
        }
        // Pause shooting if switching or stunned
        if(this.isShooting) {
            if (!this.switching && !this.stunned) {
                this.shootTimer.paused = false;
            } else {
                this.shootTimer.paused = true;
            }
        }

        // Update damage text positions
        this.damageText.x = this.body.x + 25;
        this.damageText.y = this.body.y + 25;
    }

    takeDamage(enemy, damage){
        this.health -= damage;
        this.damaged = true;
        // Update text
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

        // Effects
        this.setAlpha(0.5)
        this.emitCircle.setPosition(this.x, this.y);
        this.corruptionBleed.explode(2 + 2*damage);
        this.damagedTimer = this.scene.time.delayedCall(500, function () {
            this.damaged = false;
            enemy.setAlpha(1);
        }, null, this.scene);
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
        } else {
            this.setTexture(this.blueTexture);
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