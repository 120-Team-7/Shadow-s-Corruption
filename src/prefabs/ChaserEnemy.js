class ChaserEnemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, oSpawnX, oSpawnY, state, changeCondition, redGroup, blueGroup) {
        if(state == 0){
            super(scene, oSpawnX, oSpawnY, 'redObstacle').setOrigin(0.5, 0.5).setScale(0.25);
        } else {
            super(scene, oSpawnX, oSpawnY, 'blueObstacle').setOrigin(0.5, 0.5).setScale(0.25);
        }

        let enemy = this;
        this.scene = scene;
        this.state = state;
        this.changeCondition = changeCondition;
        this.redGroup = redGroup;
        this.blueGroup = blueGroup;

        this.health = chaserHealth;
        this.damage = 1;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setCollideWorldBounds(true);
        this.body.setBounce(chaserBounce, chaserBounce);
        this.body.setMaxVelocity(chaserMaxVel, chaserMaxVel);
        this.body.setImmovable(true);

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
        this.moveTimer = scene.time.addEvent({
            delay: chaserMoveDelay, 
            callback: () => {
                // Predict player movement if more than predictMinDist away from player
                if(Math.abs(player.x - this.x) > predictMinDist && Math.abs(player.y - this.y) > predictMinDist){
                    this.targetX = player.x + player.body.velocity.x * predictMult;
                    this.targetY = player.y + player.body.velocity.y * predictMult;
                    // If predict to go beyond game bound, set target to directly to player
                    if(this.targetX > screenWidth || this.targetX < 0){
                        this.targetX = player.x;
                    }
                    if(this.targetY > screenHeight || this.targetY < 0){
                        this.targetY = player.y;
                    }
                // If close enough, target player directly
                } else {
                    this.targetX = player.x;
                    this.targetY = player.y;
                }
                
                this.xComponent = this.targetX - this.x;
                this.yComponent = this.targetY - this.y;

                // Converts the xComponent, yComponent components into accel components in order to achieve given acceleration (diagonal speed) on combining components
                // Uses Pythagorean theorum to solve for scaleFactor given a, b, and c where c is acceleration and a, b are xDist, yDist
                this.scaleFactor = Math.sqrt(Math.pow(Math.abs(this.xComponent), 2) + 
                    Math.pow(Math.abs(this.yComponent), 2)) / chaserAccel;

                // Changes accel components to proper magnitudes
                this.xAccel = this.xComponent / this.scaleFactor;       
                this.yAccel = this.yComponent / this.scaleFactor;

                // Turn around faster
                if(this.x < player.x && this.body.acceleration.x < 0){
                    this.xAccel = this.xAccel*turnAroundMult;
                } else if(this.x > player.x && this.body.acceleration.x > 0){
                    this.xAccel = this.xAccel*turnAroundMult;
                }
                if(this.y < player.y && this.body.acceleration.y < 0){
                    this.uAccel = this.uAccel*turnAroundMult;
                }else if(this.y > player.y && this.body.acceleration.y > 0){
                    this.yAccel = this.yAccel*turnAroundMult;
                }

                this.body.setAcceleration(this.xAccel, this.yAccel);

                // this.slowDownTimer = scene.time.delayedCall(chaserSlowdownDelay, function () {
                //     // enemy.body.setAcceleration(0, 0);
                //     enemy.slowDown.play();

                // }, this, scene);
                
            }, 
            callbackContext: scene,
            loop: true,
        });
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
            this.moveTimer.remove();
            this.damagedTimer.remove();
            if(this.changeCondition == 'timed') {
                this.timedSwitch.destroy();
            }
            if(this.state == 0){
                this.redGroup.remove(this, true, true);
            } else {
                this.blueGroup.remove(this, true, true);
            }
            // this.body.destroy();
            this.setAlpha(0);
        }
    }

    timedSwitch(){
        this.timedSwitch = this.scene.time.addEvent({
            delay: timedSwitchDelay, 
            callback: () => {
                // If was red, change to blue
                if(this.state == 0){
                    this.redGroup.remove(this);
                    this.blueGroup.add(this);
                    this.state = 1;
                    this.setTexture('blueObstacle');
                // If was blue, change to red
                } else {
                    this.blueGroup.remove(this);
                    this.redGroup.add(this);
                    this.state = 0;
                    this.setTexture('redObstacle');
                }
            }, 
            callbackContext: this.scene,
            loop: true,
        });
    }
}