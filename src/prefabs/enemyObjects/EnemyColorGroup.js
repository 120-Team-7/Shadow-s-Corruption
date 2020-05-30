class EnemyColorGroup extends Phaser.Physics.Arcade.Group {
    constructor(scene, state, obstacleGroup) {
        let groupConfig = {
            runChildUpdate: true,
            collideWorldBounds: true,
        }
        super(scene.physics.world, scene, groupConfig);

        let group = this;
        this.scene = scene;
        this.state = state;
        this.obstacleGroup = obstacleGroup;

        this.playerCollider = scene.physics.add.collider(group, player, function(player, enemy) {
            if(!enemy.isDummy && !enemy.stunned) {
                player.playerHit(enemy.damage);
            }
        }, function() {
            if(group.state == playerState){
                return true;
            } else {
                return false;
            }
        }, scene);

        this.obstacleCollider = scene.physics.add.collider(this, this.obstacleGroup, null, function() {
            if(group.state == group.obstacleGroup.state){
                return true;
            } else {
                return false;
            }
        }, scene);

        this.selfCollider = scene.physics.add.collider(this, this, null, function(first, second) {
          if(first.stunned || second.stunned) {
              return false;
          } else {
              return true;
          }
        }, scene);

        scene.physics.add.collider(this,  scene.wallsLayer);
    }

    update() {
        // Somehow needed to update children
        this.preUpdate();
    }


    addDummy(spawnX, spawnY, redGroup, blueGroup, redBulletGroup, blueBulletGroup, flip, isShooter, shotX, shotY) {
        // Dummy(scene, oSpawnX, oSpawnY, state, redGroup, blueGroup, redBulletGroup, blueBulletGroup, flip, isShooter, shotX, shotY) {
        this.add(new Dummy(this.scene, spawnX, spawnY, this.state, redGroup, blueGroup, redBulletGroup, blueBulletGroup, flip, isShooter, shotX, shotY));
    }

    addChaser(spawnX, spawnY, changeCondition, redGroup, blueGroup) {
        // Chaser(scene, oSpawnX, oSpawnY, state, changeCondition, redGroup, blueGroup)
        this.add(new Chaser(this.scene, spawnX, spawnY, this.state, changeCondition, redGroup, blueGroup));
    }
        
    addShooter(spawnX, spawnY, changeCondition, redGroup, blueGroup, redBulletGroup, blueBulletGroup) {
        // Shooter(scene, oSpawnX, oSpawnY, state, changeCondition, redGroup, blueGroup, redBulletGroup, blueBulletGroup)
        this.add(new Shooter(this.scene, spawnX, spawnY, this.state, changeCondition, redGroup, blueGroup, redBulletGroup, blueBulletGroup));
    }
}