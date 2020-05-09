class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, pSpawnX, pSpawnY) {
        super(scene, pSpawnX, pSpawnY, 'redPlayer').setOrigin(0.5, 0.5).setScale(0.5);

        playerState = 0;

        this.scene = scene;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        this.setDepth(999);

        this.body.setMaxVelocity(maxMoveVelocity, maxMoveVelocity);

        keyLeft = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyRight = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyUp = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyDown = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keySwitch = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
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
            if(Phaser.Input.Keyboard.JustDown(keySwitch)){
                if(playerState == 0){
                    playerState = 1;
                    this.setTexture('bluePlayer');
                } else {
                    this.setTexture('redPlayer');
                    playerState = 0;
                }
            }
        }
    }

    playerHit(damage) {
        if(!isInvuln){
            isInvuln = true;
            pCurrHealth -= damage;
            // Player dead
            if(pCurrHealth <= 0){
                isGameOver = true;
                this.setImmovable(true);
                this.setAlpha(0);
                // this.gameOverTimer = this.scene.time.delayedCall(1000, function () {
                //     this.scene.start('gameOverScene');
                // }, this, this.scene);
                
                
            } else {
                // Set invuln timer
                this.invulnTimer = this.scene.time.delayedCall(invulnTime, function () {
                    isInvuln = false;
                }, null, this.scene);
            }
        }
    }
}