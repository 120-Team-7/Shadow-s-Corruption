class Door extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, oSpawnX, oSpawnY, room1, room2, isOpen) {
        super(scene, oSpawnX, oSpawnY, 'door').setOrigin(0.5, 0.5);
        
        this.scene = scene;
        this.spawnX = oSpawnX;
        this.spawnY = oSpawnY;
        this.room1 = room1;
        this.room2 = room2;
        this.isOpen = isOpen;

        this.exists = true;
            
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

        this.corruptionBleed = corruptionParticles.createEmitter({
            x: this.x,
            y: this.y,
            alpha: { start: 1, end: 0 },
            scale: { start: 1, end: 0 },
            lifespan: { min: 1500, max: 2000 },
            speedX: { min: -50, max: 200 },
            speedY: { min: -50, max: 200 },
        });
        this.corruptionBleed.stop();

        // Closed by default, if set to isOpen true, open door
        if(!this.isOpen) {
            this.enableBody(true, this.spawnX, this.spawnY, true, true);
        }
        if(this.isOpen) {
            this.disableBody(false, true);
        }
    }

    toggleOpen() {
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
            this.isOpen = false;
            this.enableBody(true, this.spawnX, this.spawnY, true, true);
        }
    }
    open() {
        if(!this.isOpen) {
            this.isOpen = true;
            this.disableBody(false, true);
        }
    }
}