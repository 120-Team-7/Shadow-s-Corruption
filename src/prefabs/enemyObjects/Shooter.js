class Shooter extends Enemy {
    constructor(scene, oSpawnX, oSpawnY, state, changeCondition, redGroup, blueGroup, redBulletGroup, blueBulletGroup) {
        // Enemy(scene, oSpawnX, oSpawnY, state, changeCondition, redGroup, blueGroup, redTexture, blueTexture, maxHealth, damage)
        super(scene, oSpawnX, oSpawnY, state, changeCondition, redGroup, blueGroup, 'redObstacle', 'blueObstacle', 
            shooterConfig.health, shooterConfig.damage);

        this.setOrigin(0.5, 0.5).setScale(0.25);

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
        this.startMoving = this.scene.time.delayedCall(shooterConfig.spawnPause, function () {
            enemy.shoot();
            enemy.moveTimer = scene.time.addEvent({
                delay: shooterConfig.moveDelay, 
                callback: () => {
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

        this.shooting = true;
        this.shootTimer = this.scene.time.addEvent({
            delay: shooterConfig.rof, 
            callback: () => {
                this.shoot();
            }, 
            callbackContext: scene,
            loop: true,
        });
    }

    update() {
        super.update();

        if (!this.switching && !this.stunned) {
            this.shootTimer.paused = false;
        } else {
            this.shootTimer.paused = true;
        }

        if(this.health <= 0 && this.shooting) {
            this.shooting = false;
            this.shootTimer.destroy();
        }
    }

    shoot() {
        // EnemyBulletGroup.addBullet(state, spawnX, spawnY, targetX, targetY)
        this.targetX = player.x + player.body.velocity.x * shooterConfig.shotPredictMult
        this.targetY = player.y + player.body.velocity.y * shooterConfig.shotPredictMult;
        this.enemyDistance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);

        // If predition goes off screen, target player directly
        if(this.targetX < 0 || this.targetX > screenWidth) {
            this.targetX = player.x;
            this.targetY = player.y;
        }
        if(this.targetY < 0 || this.targetY > screenHeight) {
            this.targetY = player.x;
            this.targetY = player.y;
        }

        // If player is close enough, target player directly
        if(this.enemyDistance > shooterConfig.closeDistance) {
            if(this.targetX > screenWidth || this.targetX < 0){
                this.targetX = player.x;
            }
            if(this.targetY > screenHeight || this.targetY < 0){
                this.targetY = player.y;
            }
        }

        // If target is in opposite direction from player, target player directly
        if(this.targetX < this.x && player.x > this.x) { 
            this.targetY = player.x;
            this.targetY = player.y;
        }
        if(this.targetX > this.x && player.x < this.x) { 
            this.targetY = player.x;
            this.targetY = player.y;
        }
        if(this.targetY < this.y && player.y > this.y) { 
            this.targetY = player.x;
            this.targetY = player.y;
        }
        if(this.targetY > this.y && player.y < this.y) { 
            this.targetY = player.x;
            this.targetY = player.y;
        }
        

        if(this.state == 0) {
            this.redBulletGroup.addBullet(this.state, this.x, this.y, this.targetX, this.targetY);
        }
        if(this.state == 1) {
            this.blueBulletGroup.addBullet(this.state, this.x, this.y, this.targetX, this.targetY);
        }
    }
}