class Door extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, oSpawnX, oSpawnY, isOpen) {
        super(scene, oSpawnX, oSpawnY, 'door').setOrigin(0.5, 0.5);
        
        this.scene = scene;
        this.spawnX = oSpawnX;
        this.spawnY = oSpawnY;
        this.isOpen = isOpen;
                    
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setImmovable(true);

        this.collider = scene.physics.add.collider(this, player, null, function() {
            if(!isGodmode){
                return true;
            } else {
                return false;
            }
        }, scene)

        scene.physics.add.collider(this, scene.redEnemyGroup);
        scene.physics.add.collider(this, scene.blueEnemyGroup);

        this.corruptionBleed = corruptionParticles.createEmitter({
            x: this.x,
            y: this.y,
            alpha: { start: 1, end: 0 },
            scale: { start: 1, end: 0 },
            lifespan: { min: 2000, max: 3000 },
            speedX: { min: -80, max: 80 },
            speedY: { min: -80, max: 80 },
        });
        this.corruptionBleed.stop();
        this.explodeNum = 15;

        // Closed by default, if set to isOpen true, open door
        if(!this.isOpen) {
            this.enableBody(true, this.spawnX, this.spawnY, true, true);
        }
        if(this.isOpen) {
            this.disableBody(false, true);
        }
    }

    toggleOpen() {
        this.corruptionBleed.explode(this.explodeNum);
        if(!this.isOpen) {
            this.isOpen = true;
            this.disableBody(false, true);
        } else {
            this.isOpen = false;
            this.enableBody(true, this.spawnX, this.spawnY, true, true);
        }
    }

    close() {
        if(this.isOpen) {
            this.corruptionBleed.explode(this.explodeNum);
            this.isOpen = false;
            this.enableBody(true, this.spawnX, this.spawnY, true, true);
        }
    }
    open() {
        if(!this.isOpen) {
            this.corruptionBleed.explode(this.explodeNum);
            this.isOpen = true;
            this.disableBody(false, true);
        }
    }
}