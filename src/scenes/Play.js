class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }


    create() {

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

        // Player(scene, pSpawnX, pSpawnY, redObjGroup, blueObjGroup)
        player = new Player(this, centerX - 100, centerY);

        // ColorGroup(scene, state)
        this.redGroup = new ObsColorGroup(this, 0);
        this.blueGroup = new ObsColorGroup(this, 1);

        this.redGroup.addObstacle(centerX + 100, centerY);
        this.blueGroup.addObstacle(centerX - 200, centerY + 200);

        // BulletGroup(scene, redObjGroup, state)
        this.bulletGroup = new BulletGroup(this, this.redGroup, 0);

        this.waveGroup = new WaveGroup(this, this.blueGroup, 1);

        this.redChaserGroup = new EnemyColorGroup(this, 1);
        this.blueChaserGroup = new EnemyColorGroup(this, 0);

        this.redChaserGroup.addEnemy(0, 0, 'chaser');
        this.blueChaserGroup.addEnemy(centerX, 0, 'chaser');


        // Create players
        // Player(scene, pSpawnX, pSpawnY, redObjGroup, blueObjGroup) {
        // this.player = new Player(this, centerX - 100, centerY, this.redGroup, this.blueGroup);

        // HUD boxes ---------------------------------------------------------------------------------
        // this.add.rectangle(centerX, centerY, gameWidth, centerY, 0x808080).setOrigin(0.5,0.5);
        // this.add.rectangle(centerX, playHUDY, gameWidth - 20, playHUDHeight - 20, 0xC0C0C0).setOrigin(0.5,0.5);
        
    }

    update() {
        player.update();
        this.bulletGroup.update();

        if (Phaser.Input.Keyboard.JustDown(keyStart)) {
            // this.sound.play('buttonsound');
            this.scene.run('playScene');
        }
    }
}