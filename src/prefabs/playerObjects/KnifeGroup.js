class KnifeGroup extends Phaser.GameObjects.Group {
    constructor(scene, hudScene, state, redEnemyGroup) {
        let groupConfig = {
            runChildUpdate: true,
        }
        super(scene, null, groupConfig);

        let group = this;
        this.scene = scene;
        this.hudScene = hudScene;
        this.state = state;

        this.isOnCooldown = false;

        // Knife x Enemy collider
        this.kxeCollider = scene.physics.add.overlap(group, redEnemyGroup, function(knife, enemy) {
            if(enemy.exists) {
                // Stick knife to enemy
                knife.body.stop();
                knife.body.destroy();
                knife.firstStuck = true;
                knife.isStuck = true;
                knife.stuckOffsetX = 4.5*(knife.x - enemy.x) / 10;
                knife.stuckOffsetY = 4.5*(knife.y - enemy.y) / 10;
                knife.stuckEnemy = enemy;

                if(knife.corrupted) {
                    knife.scene.sound.play('corruptKnifeHitmarker');
                } else {
                    knife.scene.sound.play('knifeHitmarker');
                }

                // Stop corruption trail if knife is corrupted
                if(knife.particlesActive && knife.shooting) {
                    knife.particleTrail.stop();
                    knife.scene.time.delayedCall(particleDestroy, function () {
                        knife.particleTrail.active = false;
                        knife.particleTrail.remove();
                    }, null, knife);
                }
                if(knife.shooting) {
                    if(knife.corrupted) {
                        game.scene.keys.hudScene.checkHealProgress(knife.damage);
                        pStats.knifeCorruptedDamage += knife.damage;
                    } else {
                        knife.damage = knifeThrowDamage;
                    }
                    enemy.takeDamage(knife.damage, knife.corrupted);
                    increaseCorruption(knife.damage);
                }
                // Corruption handling: increase corruption, check if gaining
                gainingCorruption = true;
                if(player.canUseCorruption && gainingActive) {
                    group.scene.gainingCorruptionTimer.destroy();
                }
                gainingActive = true;
                group.scene.gainingCorruptionTimer = group.scene.time.delayedCall(gainingCorruptionDuration, function () {
                    gainingActive = false;
                    gainingCorruption = false;
                }, null, this.scene);
                if(enemy.health <= 0) {
                    pStats.knifeKilled++;
                }

                // If it is a melee hit
                if(!group.isOnCooldown && !knife.shooting){
                    pStats.knifeStabbed++;
                    knife.damage = knifeMeleeDamage;
                    if(knife.corrupted) {
                        player.corruptCircleBloom.play();
                        knife.damage += corruption;
                        pStats.knifeCorruptedDamage += knife.damage;
                        enemy.scene.cameras.main.shake(500, corruptionScreenShake);
                    }
                    enemy.takeDamage(knife.damage, knife.corrupted);
                    if(enemy.health <= 0) {
                        pStats.knifeKilled++;
                    }
                    increaseCorruption(knife.damage);

                    idleWeaponExists = false;
                    group.isOnCooldown = true;
                    
                    // Stun enemy on melee stab
                    if(enemy.exists && enemy.moving){
                        enemy.moveTimer.paused = true;
                        enemy.body.stop();
                        if(enemy.stunned) {
                            enemy.stunTimer.destroy();
                        }
                        enemy.stunned = true;
                        // Allow enemy movement after short stun
                        enemy.stunTimer = group.scene.time.delayedCall(knifeMeleeStunDuration, function () {
                            enemy.moveTimer.paused = false;
                            enemy.stunned = false;
                        }, null, this.scene);
                    }

                    // If enemy killed set no cooldown, increase corruption to max, don't reset corruption
                    if(knife == player.weaponMine) {
                        group.isOnCooldown = false;
                    } else if(enemy.health <= 0) {
                        increaseCorruption(maxCorruption);
                        group.isOnCooldown = false;
                    // Start longer melee cooldown if didn't kill
                    } else {
                        if(usingCorruption) {
                            player.corruptContainerFade.play();
                            corruption = 0;
                            usingCorruption = false;
                            enemy.scene.corruptionDecayTimer.paused = false;
                            player.corruptionExpireTimer.destroy();
                            // enemy.scene.sound.play('corruptionExpire');
                        }
                        group.knifeCooldown = group.scene.time.delayedCall(knifeMeleeROF, function () {
                            group.isOnCooldown = false;
                            // idleWeaponExists = false;
                            // Make sure both cooldowns are gone
                            group.knifeCooldown.destroy();
                        }, null, group.scene);
                    }
                    group.knifeStreak(knife);
                }
            } else {
                if(knife.corrupted) {
                    knife.particleTrail.remove();
                }
            }
        }, function() {
            if(group.state == redEnemyGroup.state){
                return true;
            } else {
                return false;
            }
        }, scene)

        

        // Throw the knife
        scene.input.on('pointerdown', function(pointer) {
            if(!isGameOver && playerState == 0){
                if(!this.isOnCooldown){
                    pStats.knifeThrown++;
                    // On cooldown
                    this.isOnCooldown = true;
                    // Stop updating idleWeapon, store the current idleWeapon, remove its reference
                    idleWeaponExists = false;
                    this.knife = player.idleWeapon;
                    
                    // Target x Player distance to check if clicking too close to player 
                    // (prevent backwards shooting of knife)
                    this.playerX = player.x - this.scene.cameras.main.worldView.x;
                    this.playerY = player.y - this.scene.cameras.main.worldView.y;
                    this.pointerX = pointer.worldX- this.scene.cameras.main.worldView.x;
                    this.pointerY = pointer.worldY - this.scene.cameras.main.worldView.y;
                    this.pxtDist = Phaser.Math.Distance.Between(this.playerX, this.playerY, this.pointerX, this.pointerY);
                    if(this.pxtDist > minPXTDist) {
                        this.knife.targetX = pointer.worldX;
                        this.knife.targetY = pointer.worldY;
                    } else {
                        this.forwardShootVector = scaleVectorMagnitude(1, player.x, player.y, this.knife.x, this.knife.y);
                        this.knife.targetX = this.knife.x + this.forwardShootVector.x;
                        this.knife.targetY = this.knife.y + this.forwardShootVector.y;
                    }
                    if(usingCorruption) {
                        this.knife.corrupted = true;
                    }
                    // Triggers knife first throwing state
                    this.knife.shot = true;
                    this.knife.shooting = true;
                    if(this.knife.corrupted) {
                        this.scene.sound.play('corruptedKnife');
                    } else {
                        this.scene.sound.play('knifeThrow');
                    }
                    // Start throw cooldown
                    group.knifeCooldown = this.scene.time.delayedCall(knifeThrowROF, function () {
                        group.isOnCooldown = false;
                        // Make sure both cooldowns are gone
                        group.knifeCooldown.destroy();
                    }, null, this.scene);
                    player.idleWeapon = null;
                }
            }
        }, this);
    }

    update() {
        // Somehow needed to update children
        this.preUpdate();

        // Destroy cooldowns upon switching
        if(playerState == 1 && switchOnCooldown && this.isOnCooldown) {
            this.knifeCooldown.destroy();
            this.isOnCooldown = false;
        }

        // Adds idle weapon knife when cooldowns are over
        if(playerState == 0 && !this.isOnCooldown && !idleWeaponExists && !isGameOver) {
            idleWeaponExists = true;
            // Knife(scene, group, oSpawnX, oSpawnY, targetX, targetY, state)
            player.idleWeapon = new Knife(this.scene, this, idleWeaponX, idleWeaponY, 0);
            this.add(player.idleWeapon);
        }

        // displayCooldown(cooldownText, cooldownBox, cooldownTimer, cooldownTime)
        if(this.isOnCooldown) {
            displayCooldown(this.hudScene.knifeCooldownText, this.hudScene.knifeCooldownBox, this.knifeCooldown, this.knifeCooldown.delay, this.hudScene.knifeCDImage);
        } else {
            // this.hudScene.knifeCooldownImage.setAlpha(1);
            this.hudScene.knifeCooldownText.setText("");
            this.hudScene.knifeCooldownBox.setSize(cooldownBoxWidth, cooldownBoxHeight);
        }
    }

    knifeStreak(knife) {
        let finalStuckX = knife.stuckEnemy.x + knife.stuckOffsetX + 12.5;
        let finalStuckY = knife.stuckEnemy.y + knife.stuckOffsetY + 12.5;

        let meleeStartX = idleWeaponX + 12.5;
        let meleeStartY = idleWeaponY + 12.5;

        let outVector = scaleVectorMagnitude(50, meleeStartX, meleeStartY, finalStuckX, finalStuckY);
        let offsetVector = scaleVectorMagnitude(30, meleeStartX, meleeStartY, finalStuckX, finalStuckY);
        let meleeStreak = this.scene.add.line(0, 0, meleeStartX  - offsetVector.x, meleeStartY - offsetVector.y, finalStuckX + outVector.x, finalStuckY + outVector.y, playerRed).setAlpha(0.6);
        meleeStreak.setLineWidth(4, 1);
        this.fadeAway = this.scene.tweens.add({
            targets: meleeStreak,
            alpha: 0,
            ease: 'Quart.easeIn',
            duration: 1000,
            onComplete: function() {
                meleeStreak.destroy();
            },
            onCompleteScope: this
        });
    }
}