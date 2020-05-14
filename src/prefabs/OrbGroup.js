class OrbGroup extends Phaser.GameObjects.Group {
    constructor(scene, state, blueEnemyGroup) {
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

        // Orb x Enemy collider
        this.oxecollider = scene.physics.add.overlap(group, blueEnemyGroup, function(orb, enemy) {
            if(!enemy.orbDamageInvuln) {
                if(orb.shot){
                    enemy.orbDamageInvuln = true;
                    enemy.takeDamage(enemy, orb.damage);
                    enemy.orbInvulnTimer = group.scene.time.delayedCall(orbShotInvulnDuration, function () {
                        enemy.orbDamageInvuln = false;
                    }, null, this.scene);
                // Idle orb blocking
                } else if (!enemy.orbBlockInvuln) {
                    enemy.orbBlockInvuln = true;
                    // Stop enemy movement
                    enemy.moveTimer.paused = true;
                    enemy.body.stop();
                    // Calculate variables
                    this.xDist = enemy.x - orb.x;
                    this.yDist = enemy.y - orb.y;

                    // Converts the xDist, yDist components into target components in order to covert to orbKnockbackVelocity vector on combining components
                    // Uses Pythagorean theorum to solve for scaleFactor given a, b, and c where c is orbKnockbackVelocity and a, b are xDist, yDist
                    this.scaleFactor = Math.sqrt(Math.pow(Math.abs(this.xDist), 2) + Math.pow(Math.abs(this.yDist), 2)) / orbKnockbackVelocity;

                    // Changes components to proper magnitudes
                    this.accelX = this.xDist / this.scaleFactor;       
                    this.accelY = this.yDist / this.scaleFactor;

                    // Knockback enemy with calculated accel components
                    enemy.body.setVelocity(this.accelX , this.accelY);

                    // Allow enemy movement after short stun
                    enemy.stunTimer = group.scene.time.delayedCall(orbBlockStunDuration, function () {
                        enemy.moveTimer.paused = false;
                    }, null, this.scene);

                    // Allow ability to be blocked again after short invuln time
                    enemy.blockInvulnTimer = group.scene.time.delayedCall(orbBlockInvulnDuration, function () {
                        enemy.orbBlockInvuln = false;
                    }, null, this.scene);
                }
            }
        }, function() {
            if(group.state == blueEnemyGroup.state){
                return true;
            } else {
                return false;
            }
        }, scene)

        // Shoot the orb
        scene.input.on('pointerdown', function(pointer) {
            if(!isGameOver && playerState == 1){
                if(!this.isOnCooldown){
                    // On cooldown
                    this.isOnCooldown = true;
                    // Stop updating idleWeapon, store the current idleWeapon, remove its reference
                    idleWeaponExists = false;
                    this.orb = player.idleWeapon;
                    player.idleWeapon = null;
                    // Update orb variables
                    this.orb.targetX = pointer.x;
                    this.orb.targetY = pointer.y;
                    this.orb.shotX = this.orb.x;
                    this.orb.shotY = this.orb.y;
                    this.orb.damage = orbShootDamage;
                    // Triggers orb shot
                    this.orb.shot = true;
                    // Start shot cooldown
                    group.orbCooldown = this.scene.time.delayedCall(orbShootROF, function () {
                        group.isOnCooldown = false;
                    }, null, this.scene);
                }
            }
        }, this);
    }

    update() {
        // Somehow needed to update children
        this.preUpdate();
        // Adds idle weapon orb whenever there isn't an idleWeapon
        if(playerState == 1 && !idleWeaponExists && !isGameOver) {
            idleWeaponExists = true;
            // Orb(scene, group, oSpawnX, oSpawnY, targetX, targetY, state)
            player.idleWeapon = new Orb(this.scene, this, idleWeaponX, idleWeaponY, 0);
            this.add(player.idleWeapon);
        }
    }
}