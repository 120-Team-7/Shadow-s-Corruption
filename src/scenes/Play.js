class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }


    create() {
        keyStart = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        this.physics.world.debugGraphic.setAlpha(0);

        let playConfig = {
            fontFamily: 'Courier',
            fontSize: '40px',
            color: '#00000',
            align: 'center',
            padding: {
                top: 10,
                bottom: 10,
                left: 10,
                right: 10,
            },
            fixedWidth: 0
        }
        this.cameras.main.setBackgroundColor('#696969');

        // Initialize play objects ----------------------------------------------------------------------------------------------------
        
        // Pointer
        pointer = this.input.activePointer;

        // Player(scene, pSpawnX, pSpawnY, redObjGroup, blueObjGroup)
        player = new Player(this, centerX, centerY);

        // ColorGroup(scene, state)
        this.redGroup = new ObsColorGroup(this, 0);
        this.blueGroup = new ObsColorGroup(this, 1);

        // EnemyColorGroup(scene, state)
        this.redEnemyGroup = new EnemyColorGroup(this, 0);
        this.blueEnemyGroup = new EnemyColorGroup(this, 1);
        this.collideEnemyGroups = this.physics.add.collider(this.redEnemyGroup, this.blueEnemyGroup, null, function(red, blue) {
            if(red.stunned || blue.stunned) {
                return false;
            } else {
                return true;
            }
        }, this);

        // EnemyBulletGroup(scene, state)
        this.redEnemyBulletGroup = new EnemyBulletGroup(this, 0);
        this.blueEnemyBulletGroup = new EnemyBulletGroup(this, 1);

        // KnifeGroup(scene, state, redEnemyGroup)
        this.knifeGroup = new KnifeGroup(this, 0, this.redEnemyGroup);
        // OrbGroup(scene, state, blueEnemyGroup)
        this.orbGroup = new OrbGroup(this, 1, this.blueEnemyGroup);

        // Add play objects ----------------------------------------------------------------------------------------------------
        
        // Add obstacles
        // this.redGroup.addObstacle(centerX, centerY + 200);
        // this.redGroup.addObstacle(centerX + 200, centerY);
        // this.redGroup.addObstacle(centerX - 200, centerY - 200);
        // this.blueGroup.addObstacle(centerX, centerY - 200);
        // this.blueGroup.addObstacle(centerX - 200, centerY);
        // this.blueGroup.addObstacle(centerX + 200, centerY + 200);

        // Add enemies
        this.spawnEnemies();
        this.infiniteEnemySpawner = this.time.addEvent({
            delay: infiniteSpawnerDelay,
            callback: () => {
                this.spawnEnemies();
            },
            callbackContext: this,
            loop: true,
        });
    }

    update() {
        pointer = this.input.activePointer;
        player.update();
        this.knifeGroup.update();
        this.orbGroup.update();
        this.redEnemyGroup.update();
        this.blueEnemyGroup.update();
        this.redEnemyBulletGroup.update();
        this.blueEnemyBulletGroup.update();

        console.log(player);

        if (Phaser.Input.Keyboard.JustDown(keyStart)) {
            isPaused = true;
            this.scene.pause('playScene');
            this.scene.pause('hudScene');
            this.scene.setVisible(false, 'playScene');
            this.scene.setVisible(false, 'hudScene');
            this.scene.run('menuScene');
            this.scene.setVisible(true, 'menuScene');
        }
    }

    spawnEnemies(){
        let screenBuffer = 20;
        let randNum1 = Math.random();
        let randNum2 = Math.random();
        let randNum3 = Math.random();
        let randNum4 = Math.random();
        if(randNum3 < 0.5) {
            this.rSpawnX = screenWidth - screenBuffer;
            this.bSpawnX = screenBuffer;
        } else {
            this.rSpawnX = screenBuffer;
            this.bSpawnX = screenWidth - screenBuffer;
        }
        if(randNum4 < 0.5) {
            this.rSpawnY = screenHeight - screenBuffer;
            this.bSpawnY = screenBuffer;
        } else {
            this.rSpawnY = screenBuffer;
            this.bSpawnY = screenHeight - screenBuffer;
        }
        if(randNum1 < 0.5){
            this.randSpawnX = screenWidth - screenBuffer;
        } else {
            this.randSpawnX = screenBuffer;
        }
        if(randNum2 < 0.5){
            // EnemyColorGroup.addShooter(spawnX, spawnY, changeCondition, redGroup, blueGroup, redBulletGroup, blueBulletGroup)
            this.redEnemyGroup.addShooter(this.randSpawnX, centerY, 'timed', this.redEnemyGroup, this.blueEnemyGroup, this.redEnemyBulletGroup, this.blueEnemyBulletGroup)
        } else {
            this.blueEnemyGroup.addShooter(this.randSpawnX, centerY, 'timed', this.redEnemyGroup, this.blueEnemyGroup, this.redEnemyBulletGroup, this.blueEnemyBulletGroup)
        }
        // EnemyColorGroup.addChaser(spawnX, spawnY, changeCondition, redGroup, blueGroup)
        this.redEnemyGroup.addChaser(this.rSpawnX, this.rSpawnY, 'timed', this.redEnemyGroup, this.blueEnemyGroup);
        this.blueEnemyGroup.addChaser(this.bSpawnX, this.bSpawnY, 'chaser', 'timed', this.redEnemyGroup, this.blueEnemyGroup);
    }
}