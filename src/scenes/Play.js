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

        this.waveGroup = new WaveGroup(this, this.blueGroup, 1);

        // Add play objects ----------------------------------------------------------------------------------------------------
        
        // Add obstacles
        this.redGroup.addObstacle(centerX + 100, centerY);
        this.blueGroup.addObstacle(centerX - 200, centerY + 200);

        // Add enemies
        this.redChaserGroup.addEnemy(50, 50, 'chaser');
        // this.blueChaserGroup.addEnemy(centerX + 50, 50, 'chaser');

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
}