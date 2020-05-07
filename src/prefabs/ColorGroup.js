class ColorGroup extends Phaser.Physics.Arcade.Group {
    constructor(scene, state) {
        // https://photonstorm.github.io/phaser3-docs/Phaser.Types.Physics.Arcade.html#.PhysicsGroupConfig__anchor
        let pysGroupConfig = {
            runChildUpdate: true,
            collideWorldBounds: true,
            dragX: obstacleDrag,
            dragY: obstacleDrag,
        }
        // Phaser.Physics.Arcade.Group(world, scene [, children] [, config])
        super(Phaser.Physics.Arcade.World, scene, pysGroupConfig);

        let group = this;
        this.scene = scene;
        this.state = state;

        this.collider = scene.physics.add.collider(this, scene.player, null, function() {
            if(group.state == playerState){
                return true;
            } else {
                return false;
            }
        }, scene)

    }

    update() {
        
        // Somehow needed to update children
        // this.preUpdate();
    }

    addObstacle(spawnX, spawnY){
        this.add(new Obstacle(this.scene, spawnX, spawnY, this.state))
    }
}