class ChaserEnemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, oSpawnX, oSpawnY, state, changeCondition, redGroup, blueGroup) {
        if(state == 0){
            super(scene, oSpawnX, oSpawnY, 'redObstacle').setOrigin(0.5, 0.5).setScale(0.25);
        } else {
            super(scene, oSpawnX, oSpawnY, 'blueObstacle').setOrigin(0.5, 0.5).setScale(0.25);
        }

        let enemy = this;
        this.enemy = enemy;
        this.scene = scene;
        this.state = state;
        this.changeCondition = changeCondition;
        this.redGroup = redGroup;
        this.blueGroup = blueGroup;

        this.health = chaserHealth;
        this.damage = 1;
        this.switching = false;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setCollideWorldBounds(true);
        this.body.setBounce(chaserBounce, chaserBounce);
        this.body.setMaxVelocity(chaserMaxVel, chaserMaxVel);

        if(changeCondition == 'timed') {
            this.timedSwitch();
        }

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

    }

    takeDamage(enemy, damage){
        this.health -= damage;
        // If alive show got hit
        if(this.health > 0){
            this.setAlpha(0.5)
            this.damagedTimer = this.scene.time.delayedCall(500, function () {
                enemy.setAlpha(1);
            }, null, this.scene);
        // If dead show got hit, stop everything, destroy, show death
        } else {
            this.startMoving.remove();
            this.moveTimer.remove();
            this.damagedTimer.remove();
            if(this.changeCondition == 'timed') {
                this.timedSwitch.destroy();
                // this.switchPause.destroy();
            }
            if(this.state == 0){
                this.redGroup.remove(this, true, true);
            } else {
                this.blueGroup.remove(this, true, true);
            }
            // Sometimes not destroyed from removes? Redundancy makes sure
            this.destroy();
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