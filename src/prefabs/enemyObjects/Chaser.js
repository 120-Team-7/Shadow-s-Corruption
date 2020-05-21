class Chaser extends Enemy {
    constructor(scene, oSpawnX, oSpawnY, state, changeCondition, redGroup, blueGroup) {
        // Enemy(scene, oSpawnX, oSpawnY, state, changeCondition, redGroup, blueGroup, redTexture, blueTexture, maxHealth, damage)
        super(scene, oSpawnX, oSpawnY, state, changeCondition, redGroup, blueGroup, 'redObstacle', 'blueObstacle', 
            chaserConfig.health, chaserConfig.damage);

        this.setOrigin(0.5, 0.5).setScale(0.25);

        // Scope parameters to this instance
        let enemy = this;
        this.enemy = enemy;
        this.scene = scene;
        this.state = state;
        this.changeCondition = changeCondition;
        this.redGroup = redGroup;
        this.blueGroup = blueGroup;

        this.body.setCollideWorldBounds(true);
        this.body.setBounce(chaserConfig.bounce, chaserConfig.bounce);
        this.body.setMaxVelocity(chaserConfig.maxVel, chaserConfig.maxVel);

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


        // Chaser movement
        this.body.setEnable(false);
        this.startMoving = this.scene.time.delayedCall(chaserConfig.spawnPause, function () {
            enemy.moveTimer = scene.time.addEvent({
                delay: chaserConfig.moveDelay, 
                callback: () => {
                    if(enemy.firstMoved) {
                        this.body.setEnable(true);
                        enemy.firstMoved = false;
                    }
                    enemy.moving = true;
                    // Predict player movement if more than predictMinDist away from player
                    this.enemyDistance = Phaser.Math.Distance.Between(enemy.x, enemy.y, player.x, player.y);
                    if(this.enemyDistance > chaserConfig.predictMinDist){
                        enemy.targetX = player.x + player.body.velocity.x * chaserConfig.predictMult;
                        enemy.targetY = player.y + player.body.velocity.y * chaserConfig.predictMult;
                        // If predict to go beyond game bound, set target to directly to player
                        if(enemy.targetX > screenWidth || enemy.targetX < 0){
                            enemy.targetX = player.x;
                        }
                        if(enemy.targetY > screenHeight || enemy.targetY < 0){
                            enemy.targetY = player.y;
                        }
                    // If close enough, target player directly
                    } else {
                        enemy.targetX = player.x;
                        enemy.targetY = player.y;
                    }
                    
                    // Calculate new accel vector
                    enemy.accelVector = scaleVectorMagnitude(chaserConfig.accel, enemy.x, enemy.y, enemy.targetX, enemy.targetY)
                    enemy.xAccel = enemy.accelVector.x
                    enemy.yAccel = enemy.accelVector.y
    
                    // Turn around faster
                    if(enemy.x < player.x && enemy.body.acceleration.x < 0){
                        enemy.xAccel = enemy.xAccel * chaserConfig.turnAroundMult;
                    } else if(enemy.x > player.x && enemy.body.acceleration.x > 0){
                        enemy.xAccel = enemy.xAccel * chaserConfig.turnAroundMult;
                    }
                    if(enemy.y < player.y && enemy.body.acceleration.y < 0){
                        enemy.uAccel = enemy.uAccel * chaserConfig.turnAroundMult;
                    }else if(enemy.y > player.y && enemy.body.acceleration.y > 0){
                        enemy.yAccel = enemy.yAccel * chaserConfig.turnAroundMult;
                    }
    
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
    }

    update() {
        super.update();
    }

}