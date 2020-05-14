class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }


    create() {

        keyStart = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

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

        this.redChaserGroup = new EnemyColorGroup(this, 0);
        this.blueChaserGroup = new EnemyColorGroup(this, 1);
        this.collideChaserGroups = this.physics.add.collider(this.redChaserGroup, this.blueChaserGroup);

        // KnifeGroup(scene, state, redEnemyGroup)
        this.knifeGroup = new KnifeGroup(this, 0, this.redChaserGroup);
        // OrbGroup(scene, state, blueEnemyGroup)
        this.orbGroup = new OrbGroup(this, 1, this.blueChaserGroup);

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
        this.redChaserGroup.update();
        this.blueChaserGroup.update();

        if (Phaser.Input.Keyboard.JustDown(keyStart)) {
            this.scene.stop('playScene');
            this.scene.stop('hudScene');
            this.scene.start('menuScene');
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
        // if(randNum2 < 0.5){
        //     // EnemyColorGroup.addEnemy(spawnX, spawnY, type, changeCondition, redGroup, blueGroup)
        //     this.redChaserGroup.addEnemy(this.randSpawnX, centerY, 'chaser', 'timed', this.redChaserGroup, this.blueChaserGroup);
        // } else {
        //     this.blueChaserGroup.addEnemy(this.randSpawnX, centerY, 'chaser', 'timed', this.redChaserGroup, this.blueChaserGroup);
        // }
        // this.redChaserGroup.addEnemy(this.rSpawnX, this.rSpawnY, 'chaser', 'timed', this.redChaserGroup, this.blueChaserGroup);
        this.blueChaserGroup.addEnemy(this.bSpawnX, this.bSpawnY, 'chaser', 'timed', this.redChaserGroup, this.blueChaserGroup);
    }
}