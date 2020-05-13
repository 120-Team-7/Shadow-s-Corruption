class KnifeGroup extends Phaser.GameObjects.Group {
    constructor(scene, state, redEnemyGroup) {
        // https://photonstorm.github.io/phaser3-docs/Phaser.Types.Physics.Arcade.html#.PhysicsGroupConfig__anchor
        let groupConfig = {
            runChildUpdate: true,
        }
        // Group(scene [, children] [, config])
        super(scene, null, groupConfig);

        let group = this;
        this.scene = scene;
        this.state = state;

        this.isOnCooldown = false;

        // Knife x Enemy collider
        this.kxeCollider = scene.physics.add.overlap(group, redEnemyGroup, function(knife, enemy) {
            knife.destroy();
            enemy.takeDamage(enemy, knife.damage);
            if(!group.isOnCooldown && !knife.shooting){
                group.isOnCooldown = true;
                group.knifeCooldown = group.scene.time.delayedCall(knifeMeleeROF, function () {
                    console.log("offCooldown melee");
                    group.isOnCooldown = false;
                    idleWeaponExists = false;
                    group.knifeCooldown.destroy();
                }, null, group.scene);
            }
        }, function() {
            if(group.state == redEnemyGroup.state){
                return true;
            } else {
                return false;
            }
        }, scene)

        

        scene.input.on('pointerdown', function(pointer) {
            if(!isGameOver && playerState == 0){
                if(!this.isOnCooldown){
                    this.isOnCooldown = true;
                    idleWeaponExists = false;
                    this.knife = player.idleWeapon;
                    player.idleWeapon = null;
                    this.knife.shooting = true;
                    this.knife.targetX = pointer.x;
                    this.knife.targetY = pointer.y;
                    this.knife.damage = knifeThrowDamage;
                    this.knife.first = true;
                    group.knifeCooldown = this.scene.time.delayedCall(knifeROF, function () {
                        console.log("offCooldown ranged");
                        group.isOnCooldown = false;
                        group.knifeCooldown.destroy();
                    }, null, this.scene);
                }
            }
        }, this);
    }

    update() {
        if(!this.isOnCooldown && !idleWeaponExists && !isGameOver) {
            idleWeaponExists = true;
            // Knife(scene, group, oSpawnX, oSpawnY, targetX, targetY, state)
            player.idleWeapon = new Knife(this.scene, this, idleWeaponX, idleWeaponY, 0);
            this.add(player.idleWeapon);
        }
        // Somehow needed to update children
        this.preUpdate();
    }
}