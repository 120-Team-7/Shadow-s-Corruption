class Instructions extends Phaser.Scene {
    constructor() {
        super('instructionsScene');
    }

    // preload() {
    //     this.load.image('redPlayer', './assets/redPlayer.png');
    //     this.load.image('bluePlayer', './assets/bluePlayer.png');
    // }

    create() {
        keyInstructions = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);

        this.cameras.main.setBackgroundColor('#FFFFFF');

        let instructionsConfig = {
            fontFamily: 'Courier',
            fontSize: '20px',
            color: '#000000',
            align: 'center',
            padding: {
                top: 10,
                bottom: 10,
                left: 10,
                right: 10,
            },
            fixedWidth: 0
        }

        // Images
        // Red
        this.redPlayerImage = this.add.sprite(centerX - 50, screenHeight - 80, 'redPlayer').setOrigin(0.5, 0.5).setFlipX(true);
        this.knifeImage = this.add.sprite(centerX - 120, screenHeight - 80, 'knife').setOrigin(0.5, 0.5).setFlipX(true);
        this.redEnemy = this.add.sprite(50, screenHeight - 80, 'redObstacle').setOrigin(0.5, 0.5).setScale(0.25);
        // Blue
        this.bluePlayerImage = this.add.sprite(centerX + 50, screenHeight - 80, 'bluePlayer').setOrigin(0.5, 0.5);
        this.orbImage = this.add.sprite(centerX + 120, screenHeight - 80, 'orb').setOrigin(0.5, 0.5);
        this.blueEnemy = this.add.sprite(screenWidth - 50, screenHeight - 80, 'blueObstacle').setOrigin(0.5, 0.5).setScale(0.25);



        // Text
        // Black
        this.add.text(centerX, screenHeight - 10, 'Press I to return to menu', instructionsConfig).setOrigin(0.5, 0.5);
        this.add.text(centerX, textSpacer, 'WASD to move.    MOUSE to aim and LEFT MOUSE BUTTON to shoot weapon.', instructionsConfig).setOrigin(0.5, 0.5);
        this.add.text(centerX, textSpacer + smallTextSpacer, 'Press SHIFT to SWITCH the player color state between RED and BLUE.', instructionsConfig).setOrigin(0.5, 0.5);
        this.add.text(centerX, textSpacer + 2*smallTextSpacer, 'RED hits RED, BLUE hits BLUE, and OPPOSITES pass through.', instructionsConfig).setOrigin(0.5, 0.5);
        this.add.text(centerX, textSpacer + 3*smallTextSpacer, 'Equiped weapon is based on player color state. RED KNIFE can be rapidly shot or used', instructionsConfig).setOrigin(0.5, 0.5);
        this.add.text(centerX, textSpacer + 4*smallTextSpacer, 'to stab enemies in melee range. BLUE ORB can be shot as an accelerating,', instructionsConfig).setOrigin(0.5, 0.5);
        this.add.text(centerX, textSpacer + 5*smallTextSpacer, 'piercing projectile or block enemies in melee range.', instructionsConfig).setOrigin(0.5, 0.5);
        this.add.text(centerX, textSpacer + 6*smallTextSpacer, 'Gain CORRUPTION when dealing damage with KNIFE or blocking with ORB.', instructionsConfig).setOrigin(0.5, 0.5);
        this.add.text(centerX, textSpacer + 7*smallTextSpacer, 'SWITCH and expend CORRUPTION to deliver a single extra damage attack.', instructionsConfig).setOrigin(0.5, 0.5);
        this.add.text(centerX, textSpacer + 8*smallTextSpacer, 'Strategically SWITCH to evade enemy attacks and use your CORRUPTION often to', instructionsConfig).setOrigin(0.5, 0.5);
        this.add.text(centerX, textSpacer + 9*smallTextSpacer, 'quickly wipe out enemies before they SWITCH their own color state and overwhelm you!', instructionsConfig).setOrigin(0.5, 0.5);

        // Red
        instructionsConfig.color = '#FF0000';
        instructionsConfig.fontSize = '50px';
        this.add.text(screenWidth/4, 30, 'Red State', instructionsConfig).setOrigin(0.5, 0.5);
        // Blue
        instructionsConfig.color = '#0000FF';
        this.add.text(centerX + screenWidth/4, 30, 'Blue State', instructionsConfig).setOrigin(0.5, 0.5);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyInstructions)) {
            // this.sound.play('buttonsound');
            this.scene.start('menuScene');
        }
    }
}