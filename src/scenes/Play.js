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
        
        // Player(scene, pSpawnX, pSpawnY, redObjGroup, blueObjGroup)
        player = new Player(this, centerX - 100, centerY);

        // ColorGroup(scene, state)
        this.redGroup = new ObsColorGroup(this, 0);
        this.blueGroup = new ObsColorGroup(this, 1);

        this.redChaserGroup = new EnemyColorGroup(this, 0);
        this.blueChaserGroup = new EnemyColorGroup(this, 1);

        // BulletGroup(scene, state, redObjGroup, redEnemyGroup)
        this.bulletGroup = new BulletGroup(this, 0, this.redGroup, this.redChaserGroup);
        // WaveGroup(scene, state, blueObjGroup, blueEnemyGroup)
        this.waveGroup = new WaveGroup(this, 1, this.blueGroup, this.blueChaserGroup);

        // Add play objects ----------------------------------------------------------------------------------------------------
        
        // Add obstacles
        // this.redGroup.addObstacle(centerX, centerY + 200);
        // this.redGroup.addObstacle(centerX + 200, centerY);
        // this.redGroup.addObstacle(centerX - 200, centerY - 200);
        // this.blueGroup.addObstacle(centerX, centerY - 200);
        // this.blueGroup.addObstacle(centerX - 200, centerY);
        // this.blueGroup.addObstacle(centerX + 200, centerY + 200);


        // Add enemies
        // this.redChaserGroup.addEnemy(50, 50, 'chaser');
        // this.blueChaserGroup.addEnemy(centerX + 50, 50, 'chaser');

        this.spawnEnemyPair();
        this.infiniteEnemySpawner = this.time.addEvent({
            delay: 8000,
            callback: () => {
                this.spawnEnemyPair();
            },
            callbackContext: this,
            loop: true,
        });

    }

    update() {
        player.update();
        this.bulletGroup.update();

        if (Phaser.Input.Keyboard.JustDown(keyStart)) {
            console.log("return");
            // this.sound.play('buttonsound');
            this.scene.stop("hudScene");
            this.scene.run('menuScene');
        }
    }

    spawnEnemyPair(){
        console.log("spawning");
        let randNum1 = Math.random();
        let randNum2 = Math.random();
        let randNum3 = Math.random();
        if(randNum2 < 0.5) {
            this.rSpawnX = screenWidth - 50;
            this.bSpawnX = 50;
        } else {
            this.rSpawnX = 50;
            this.bSpawnX = screenWidth - 50;
        }

        if(randNum3 < 0.5) {
            this.rSpawnY = screenHeight - 50;
            this.bSpawnY = 50;
        } else {
            this.rSpawnY = 50;
            this.bSpawnY = screenHeight - 50;
        }
        this.redChaserGroup.addEnemy(this.rSpawnX, this.rSpawnY, 'chaser');
        this.blueChaserGroup.addEnemy(this.bSpawnX, this.bSpawnY, 'chaser');
    }
}