class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, pSpawnX, pSpawnY) {
        super(scene, pSpawnX, pSpawnY, 'player').setOrigin(0.5, 0.5);

        // this.scene = scene;
        // this.state = state;
        // this.health = health;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);

        this.body.setMaxVelocity(maxMoveVelocity, maxMoveVelocity);


        keyLeft = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyRight = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyUp = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyDown = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
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
        }
    }
}