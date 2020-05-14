class ChaserEnemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, oSpawnX, oSpawnY, state, changeCondition, redGroup, blueGroup) {
        if(state == 0){
            super(scene, oSpawnX, oSpawnY, 'redObstacle').setOrigin(0.5, 0.5).setScale(0.25);
        } else {
            super(scene, oSpawnX, oSpawnY, 'blueObstacle').setOrigin(0.5, 0.5).setScale(0.25);
        }

        this.enemyTextConfig = {
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

        let enemy = this;
        this.enemy = enemy;
        this.scene = scene;
        this.state = state;
        this.changeCondition = changeCondition;
        this.redGroup = redGroup;
        this.blueGroup = blueGroup;

        this.exists = true;
        this.health = chaserHealth;
        this.damage = 1;
        this.damaged = false;
        this.switching = false;
        this.orbDamageInvuln = false;
        this.orbBlockInvuln = false

        this.damageTextDisappearing = false;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setCollideWorldBounds(true);
        this.body.setBounce(chaserBounce, chaserBounce);
        this.body.setMaxVelocity(chaserMaxVel, chaserMaxVel);

        if(changeCondition == 'timed') {
            this.timedSwitch();
        }

        // Add health text
        this.healthText = scene.add.text(this.x, this.y, this.health + "/" + chaserHealth, this.enemyTextConfig).setOrigin(0.5, 0.5);
        this.damageText = scene.add.text(this.x, this.y - 40, "", this.enemyTextConfig).setOrigin(0.5, 0.5);
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

        this.startMoving = this.scene.time.delayedCall(chaserSpawnPause, function () {
            enemy.moveTimer = scene.time.addEvent({
                delay: chaserMoveDelay, 
                callback: () => {
                    // Predict player movement if more than predictMinDist away from player
                    if(Math.abs(player.x - enemy.x) > predictMinDist && Math.abs(player.y - enemy.y) > predictMinDist){
                        enemy.targetX = player.x + player.body.velocity.x * predictMult;
                        enemy.targetY = player.y + player.body.velocity.y * predictMult;
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
                    
                    enemy.xComponent = enemy.targetX - enemy.x;
                    enemy.yComponent = enemy.targetY - enemy.y;
    
                    // Converts the xComponent, yComponent components into accel components in order to achieve given acceleration (diagonal speed) on combining components
                    // Uses Pythagorean theorum to solve for scaleFactor given a, b, and c where c is acceleration and a, b are xDist, yDist
                    enemy.scaleFactor = Math.sqrt(Math.pow(Math.abs(enemy.xComponent), 2) + 
                        Math.pow(Math.abs(enemy.yComponent), 2)) / chaserAccel;
    
                    // Changes accel components to proper magnitudes
                    enemy.xAccel = enemy.xComponent / enemy.scaleFactor;       
                    enemy.yAccel = enemy.yComponent / enemy.scaleFactor;
    
                    // Turn around faster
                    if(enemy.x < player.x && enemy.body.acceleration.x < 0){
                        enemy.xAccel = enemy.xAccel*turnAroundMult;
                    } else if(enemy.x > player.x && enemy.body.acceleration.x > 0){
                        enemy.xAccel = enemy.xAccel*turnAroundMult;
                    }
                    if(enemy.y < player.y && enemy.body.acceleration.y < 0){
                        enemy.uAccel = enemy.uAccel*turnAroundMult;
                    }else if(enemy.y > player.y && enemy.body.acceleration.y > 0){
                        enemy.yAccel = enemy.yAccel*turnAroundMult;
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
        this.healthText.x = this.body.x + 25;
        this.healthText.y = this.body.y + 25;
        this.damageText.x = this.body.x + 25;
        this.damageText.y = this.body.y - 20;
    }

    takeDamage(enemy, damage){
        this.health -= damage;
        // this.totalDamage += damage;
        this.healthText.setText(this.health + "/" + chaserHealth);
        this.damageText.setAlpha(1);
        if(this.damageTextDisappearing){
            this.damageTextTimer.destroy();
        }
        this.damageText.setText("-" + damage);
        this.damageTextDisappearing = true;
        this.damageTextTimer = this.scene.time.delayedCall(500, () => {
            this.damageTextDisappearing = false;
            this.damageText.setAlpha(0);
        }, null, this.scene);
        // If alive show got hit
        if(this.health > 0){
            this.damaged = true;
            this.setAlpha(0.5)
            this.damagedTimer = this.scene.time.delayedCall(500, function () {
                this.damaged = false;
                enemy.setAlpha(1);
            }, null, this.scene);
        // If dead show got hit, stop everything, destroy, show death
        } else {
            this.exists = false;
            this.startMoving.remove();
            this.moveTimer.remove();
            if(this.damaged){
                this.damagedTimer.remove();
            }
            if(this.changeCondition == 'timed') {
                this.timedSwitch.destroy();
            }
            this.body.destroy();
            this.setAlpha(0.2);
            this.destroyTimer = this.scene.time.delayedCall(enemyDamageTextDestoryDelay, () => {
                this.healthText.destroy();
                this.damageText.destroy();
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

    timedSwitch(){
        this.timedSwitch = this.scene.time.addEvent({
            delay: timedSwitchDelay, 
            callback: () => {
                // Stop enemy->enemy collisions
                // this.switching = true;
                this.body.setImmovable(true);
                // If was red, change to blue
                if(this.state == 0){
                    // Pause movement before switching
                    this.body.stop();
                    this.moveTimer.paused = true;
                    this.timedSwitch.paused = true;
                    this.switchPause = this.scene.time.delayedCall(enemySwitchPause, () => {
                        if(this.health > 0){
                            // eSwitchColor(originalGroup, newGroup)
                            this.eSwitchColor(this.redGroup, this.blueGroup);
                            this.timedSwitch.paused = false;
                        }
                    }, this.enemy, this.scene);
                // If was blue, change to red
                } else {
                    // Pause movement before switching
                    this.body.stop();
                    this.moveTimer.paused = true;
                    this.timedSwitch.paused = true;
                    this.switchPause = this.scene.time.delayedCall(enemySwitchPause, () => {
                        if(this.health > 0){
                            // eSwitchColor(originalGroup, newGroup)
                            this.eSwitchColor(this.blueGroup, this.redGroup);
                            this.timedSwitch.paused = false;
                        }
                    }, this.enemy, this.scene);
                }
            }, 
            callbackContext: this.scene,
            loop: true,
        });
    }

    // Switch enemy color & everything else related
    eSwitchColor(originalGroup, newGroup) {
        let originalState = this.state;
        originalGroup.remove(this); 
        this.moveTimer.paused = false
        this.body.setImmovable(false);
        if(originalState == 0){
            this.state = 1;
        } else {
            this.state = 0;
        }
        newGroup.add(this);
        if(this.state == 0){
            this.setTexture('redObstacle');
        } else {
            this.setTexture('blueObstacle');
        }
        
    }
}