class ObsColorGroup extends Phaser.Physics.Arcade.Group {
    constructor(scene, state) {
        // https://photonstorm.github.io/phaser3-docs/Phaser.Types.Physics.Arcade.html#.PhysicsGroupConfig__anchor
        let groupConfig = {
            runChildUpdate: true,
            collideWorldBounds: true,
            immovable: true,
        }
        // Phaser.Physics.Arcade.Group(world, scene [, children] [, config])
        super(scene.physics.world, scene, groupConfig);

        let group = this;
        this.scene = scene;
        this.state = state;

        this.collider = scene.physics.add.collider(this, player, null, function() {
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
        // Obstacle(scene, group, oSpawnX, oSpawnY, state, health)
        this.add(new Obstacle(this.scene, this, spawnX, spawnY, this.state, obsHealth))
    }
}