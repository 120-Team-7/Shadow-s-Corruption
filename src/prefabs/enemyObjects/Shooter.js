class Shooter extends Enemy {
    constructor(scene, oSpawnX, oSpawnY, state, changeCondition, redGroup, blueGroup, redBulletGroup, blueBulletGroup) {
        // Enemy(scene, oSpawnX, oSpawnY, state, changeCondition, redGroup, blueGroup, redTexture, blueTexture, maxHealth, damage)
        super(scene, oSpawnX, oSpawnY, state, changeCondition, redGroup, blueGroup, 'redChaser', 'blueChaser', 
            shooterConfig.health, shooterConfig.damage);

        this.setOrigin(0.5, 0.5);

        // Scope parameters to this instance
        let enemy = this;
        this.enemy = enemy;
        this.scene = scene;
        this.state = state;
        this.changeCondition = changeCondition;
        this.redGroup = redGroup;
        this.blueGroup = blueGroup;
        this.redBulletGroup = redBulletGroup;
        this.blueBulletGroup = blueBulletGroup;

        this.shooting;
        this.targetX;
        this.targetY;

        this.body.setCollideWorldBounds(true);
        this.body.setBounce(chaserConfig.bounce, shooterConfig.bounce);
        this.body.setMaxVelocity(chaserConfig.maxVel, shooterConfig.maxVel);

        // this.slowDown = scene.tweens.add({
        //     paused: true,
        //     targets: enemy.body,
        //     // delay: chaserSlowdownDelay,
        //     duration: 500,
        //     ease: 'Linear',
        //     props: {
        //         x: { to: 0, duration: 250, ease: 'Linear' },
        //         y: { to: 0, duration: 250, ease: 'Linear' }
        //     },
        // });

        // Shooter movement
        this.body.setEnable(false);
        this.startMoving = this.scene.time.delayedCall(shooterConfig.spawnPause, function () {
            enemy.moveTimer = scene.time.addEvent({
                delay: shooterConfig.moveDelay, 
                callback: () => {
                    if(enemy.firstMoved) {
                        this.body.setEnable(true);
                        enemy.firstMoved = false;
                    }
                    enemy.moving = true;
                    
                    this.enemyDistance = Phaser.Math.Distance.Between(enemy.x, enemy.y, player.x, player.y);

                    if(this.enemyDistance < shooterConfig.closeDistance) {
                        enemy.xComponent = enemy.x - player.x;
                        enemy.yComponent = enemy.y - player.y;
                    } else if (this.enemyDistance > shooterConfig.farDistance) {
                        enemy.xComponent = player.x - enemy.x;
                        enemy.yComponent = player.y - enemy.y;
                    } else {
                        enemy.xComponent = 0;
                        enemy.yComponent = 0;
                    }
                    
                    // Converts the xComponent, yComponent components into accel components in order to achieve given acceleration (diagonal speed) on combining components
                    // Uses Pythagorean theorum to solve for scaleFactor given a, b, and c where c is acceleration and a, b are xDist, yDist
                    enemy.scaleFactor = Math.sqrt(Math.pow(Math.abs(enemy.xComponent), 2) + 
                        Math.pow(Math.abs(enemy.yComponent), 2)) / shooterConfig.accel;
    
                    // Changes accel components to proper magnitudes
                    enemy.xAccel = enemy.xComponent / enemy.scaleFactor;       
                    enemy.yAccel = enemy.yComponent / enemy.scaleFactor;
    
                    enemy.body.setAcceleration(enemy.xAccel, enemy.yAccel);
    
                    // this.slowDownTimer = scene.time.delayedCall(chaserSlowdownDelay, function () {
                    //     // enemy.body.setAcceleration(0, 0);
                    //     enemy.slowDown.play();
    
                    // }, this, scene);
                }, 
                callbackContext: scene,
                loop: true,
            });
        }, null, this.scene);


        this.targetLaser = scene.add.line(0, 0, 0, 0, 0, 0, playerRed);
        this.targetLaser.setLineWidth(3, 0.5);
        this.targetLaser.setAlpha(0);

        this.fadeIn = this.scene.tweens.add({
            targets: this.targetLaser,
            alpha: { from: 0, to: 1 },
            ease: 'Quart.easeIn',
            duration: shooterConfig.rof/2,
            onComplete: function() {
                this.targeting = false;
                if(!this.stunned) {
                    this.shoot();
                }
                this.targetLaser.setAlpha(0);
            },
            onCompleteScope: this
        });
        this.fadeIn.stop();

        this.shooting = true;
        this.targetTimer = this.scene.time.addEvent({
            delay: shooterConfig.rof/2, 
            callback: () => {
                this.targeting = true;
                this.fadeIn.play();
            }, 
            callbackContext: scene,
            loop: true,
        });

    }

    update() {
        super.update();

        if (!this.switching && !this.stunned) {
            this.targetTimer.paused = false;
        } else {
            this.targetTimer.paused = true;
        }

        if(this.stunned && this.targeting) {
            this.fadeIn.remove();
            this.targetLaser.setAlpha(0);
        }

        if(this.health <= 0 && this.shooting) {
            this.shooting = false;
            this.fadeIn.remove();
            this.targetTimer.destroy();
            this.targetLaser.destroy();
        }
        this.playerX = player.x - this.scene.cameras.main.worldView.x;
        this.playerY = player.y - this.scene.cameras.main.worldView.y;
        this.shooterX = this.x - this.scene.cameras.main.worldView.x;
        this.shooterY = this.y - this.scene.cameras.main.worldView.y;

        this.enemyDistance = Phaser.Math.Distance.Between(this.shooterX, this.shooterY, this.playerX, this.playerY);

        // If player is close enough, target player directly
        if(this.enemyDistance < shooterConfig.closeTargetDist) {
            this.targetX = player.x;
            this.targetY = player.y;
        } else {
            this.enemyRange = this.enemyDistance/shooterConfig.farTargetDist;
            this.targetX = player.x + player.body.velocity.x * this.enemyRange * shooterConfig.shotPredictMult
            this.targetY = player.y + player.body.velocity.y * this.enemyRange * shooterConfig.shotPredictMult;

            // // If predition goes off screen, target player directly
            // if(this.targetX < 0 || this.targetX > screenWidth) {
            //     this.targetX = player.x;
            //     this.targetY = player.y;
            // }
            // if(this.targetY < 0 || this.targetY > screenHeight) {
            //     this.targetY = player.x;
            //     this.targetY = player.y;
            // }

            // If predition is in opposite direction from player, target player directly
            if(this.targetX < this.x && player.x > this.x) { 
                this.targetX = player.x;
                this.targetY = player.y;
            }
            if(this.targetX > this.x && player.x < this.x) { 
                this.targetX = player.x;
                this.targetY = player.y;
            }
            if(this.targetY < this.y && player.y > this.y) { 
                this.targetX = player.x;
                this.targetY = player.y;
            }
            if(this.targetY > this.y && player.y < this.y) { 
                this.targetX = player.x;
                this.targetY = player.y;
            }
    
        }


        if(this.health > 0) {
            this.targetVector = scaleVectorMagnitude(shooterConfig.targetLaserLength, this.x, this.y, this.targetX, this.targetY)
            this.targetLaser.setTo(this.x, this.y, this.x + this.targetVector.x, this.y + this.targetVector.y);
            if(this.state == 0) {
                this.targetLaser.strokeColor = playerRed;
            } else {
                this.targetLaser.strokeColor = playerBlue;
            }
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