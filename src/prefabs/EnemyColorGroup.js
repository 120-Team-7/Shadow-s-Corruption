class EnemyColorGroup extends Phaser.Physics.Arcade.Group {
    constructor(scene, state) {
        let groupConfig = {
            runChildUpdate: true,
            collideWorldBounds: true,
        }
        super(scene.physics.world, scene, groupConfig);

        let group = this;
        this.scene = scene;
        this.state = state;

        this.playerCollider = scene.physics.add.collider(group, player, function(player, enemy) {
            player.playerHit(enemy.damage);
        }, function() {
            if(group.state == playerState){
                return true;
            } else {
                return false;
            }
        }, scene)

        this.selfCollider = scene.physics.add.collider(this, this);
    }

    update() {
        // Somehow needed to update children
        this.preUpdate();
    }

    addEnemy(spawnX, spawnY, type, changeCondition, redGroup, blueGroup){
        // ChaserEnemy(scene, oSpawnX, oSpawnY, state, changeCondition, redGroup, blueGroup)
        if(type == 'chaser'){
            this.add(new ChaserEnemy(this.scene, spawnX, spawnY, this.state, changeCondition, redGroup, blueGroup))
        }
    }
}