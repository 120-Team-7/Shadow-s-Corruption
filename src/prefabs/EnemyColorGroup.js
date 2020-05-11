class EnemyColorGroup extends Phaser.GameObjects.Group {
    constructor(scene, state) {
        let groupConfig = {
            runChildUpdate: true,
        }
        super(scene, null, groupConfig);

        let group = this;
        this.scene = scene;
        this.state = state;

        this.collider = scene.physics.add.collider(group, player, function(enemy, player) {
            player.playerHit(enemy.damage);
        }, function() {
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

    addEnemy(spawnX, spawnY, type, changeCondition, redGroup, blueGroup){
        // ChaserEnemy(scene, oSpawnX, oSpawnY, state, changeCondition, redGroup, blueGroup)
        if(type == 'chaser'){
            this.add(new ChaserEnemy(this.scene, spawnX, spawnY, this.state, changeCondition, redGroup, blueGroup))
        }
    }
}