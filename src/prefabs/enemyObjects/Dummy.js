class Dummy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, oSpawnX, oSpawnY, state, redGroup, blueGroup) {
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
        this.state = state;
        this.redGroup = redGroup;
        this.blueGroup = blueGroup;
        
        this.damage = 0;
        this.isDummy = true;

        // Enemy variables
        this.exists = true;
        this.damaged = false;
        this.orbDamageInvuln = false;
        this.orbBlockInvuln = false
        this.damageTextDisappearing = false;

        scene.add.existing(this);
        scene.physics.add.existing(this);
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
    }

    update() {
        this.damageText.x = this.body.x + 25;
        this.damageText.y = this.body.y + 25;
    }

    takeDamage(enemy, damage){
        this.health -= damage;
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
        this.damaged = true;
        this.setAlpha(0.5)
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
}