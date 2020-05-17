class Instructions extends Phaser.Scene {
    constructor() {
        super('instructionsScene');
    }

    create() {
        keyInstructions = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);

        this.cameras.main.setBackgroundColor('#696969');

        let instructionsConfig = {
            fontFamily: 'Courier',
            fontSize: '20px',
            color: '#FFFFFF',
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
        this.knifeImage = this.add.sprite(centerX - (50 + idleWeaponDistance), screenHeight - 80, 'knife').setOrigin(0.5, 0.5).setFlipX(true);
        this.corruptKnifeImage = this.add.sprite(screenWidth/4 - 20, screenHeight - 80, 'corruptKnife').setOrigin(0.5, 0.5).setFlipX(true);
        this.redEnemy = this.add.sprite(50, screenHeight - 80, 'redObstacle').setOrigin(0.5, 0.5).setScale(0.25);
        // Blue
        this.bluePlayerImage = this.add.sprite(centerX + 50, screenHeight - 80, 'bluePlayer').setOrigin(0.5, 0.5);
        this.orbImage = this.add.sprite(centerX + (50 + idleWeaponDistance), screenHeight - 80, 'orb').setOrigin(0.5, 0.5).setScale(1.5, 1.5);
        this.corruptOrbImage = this.add.sprite(3*screenWidth/4 + 20, screenHeight - 80, 'corruptOrb').setOrigin(0.5, 0.5).setScale(1.5, 1.5);
        this.blueEnemy = this.add.sprite(screenWidth - 50, screenHeight - 80, 'blueObstacle').setOrigin(0.5, 0.5).setScale(0.25);



        // Text
        // White
        this.add.text(centerX, screenHeight - 20, 'Press I to return to menu, M to toggle mute, B to toggle physics debug', instructionsConfig).setOrigin(0.5, 0.5);
        this.add.text(centerX, textSpacer, 'WASD to move. MOUSE to aim and LEFT MOUSE BUTTON to shoot weapon.', instructionsConfig).setOrigin(0.5, 0.5);
        this.add.text(centerX, textSpacer + smallTextSpacer, 'SHIFT the player color state between RED and BLUE.', instructionsConfig).setOrigin(0.5, 0.5);
        this.add.text(centerX, textSpacer + 2*smallTextSpacer, 'RED hits RED, BLUE hits BLUE, and OPPOSITES pass through.', instructionsConfig).setOrigin(0.5, 0.5);
        this.add.text(centerX, textSpacer + 3*smallTextSpacer, 'Equiped weapon is based on player color state. The RED KNIFE can be rapidly shot', instructionsConfig).setOrigin(0.5, 0.5);
        this.add.text(centerX, textSpacer + 4*smallTextSpacer, 'or used to stab enemies in close range. The BLUE ORB can be shot as an', instructionsConfig).setOrigin(0.5, 0.5);
        this.add.text(centerX, textSpacer + 5*smallTextSpacer, 'accelerating, piercing projectile or block enemies in close range.', instructionsConfig).setOrigin(0.5, 0.5);
        this.add.text(centerX, textSpacer + 6*smallTextSpacer, 'Gain CORRUPTION when dealing damage with KNIFE, blocking enemies with ORB, or', instructionsConfig).setOrigin(0.5, 0.5);
        this.add.text(centerX, textSpacer + 7*smallTextSpacer, 'blocking enemy shots with a close range weapon. SHIFT and expend CORRUPTION to ', instructionsConfig).setOrigin(0.5, 0.5);
        this.add.text(centerX, textSpacer + 8*smallTextSpacer, 'deliver a single extra damage attack. Strategically SHIFT to reallocate your', instructionsConfig).setOrigin(0.5, 0.5);
        this.add.text(centerX, textSpacer + 9*smallTextSpacer, 'offensive and defensive capabilities at the right time. Use your CORRUPTION often', instructionsConfig).setOrigin(0.5, 0.5);
        this.add.text(centerX, textSpacer + 10*smallTextSpacer, 'to wipe out enemies before they SHIFT their own color state and overwhelm you!', instructionsConfig).setOrigin(0.5, 0.5);

        // Red
        instructionsConfig.color = '#FF0000';
        instructionsConfig.fontSize = '50px';
        this.add.text(screenWidth - 200, 40, 'Red State', instructionsConfig).setOrigin(0.5, 0.5);
        // Blue
        instructionsConfig.color = '#0000FF';
        this.add.text(200, 40, 'Blue State', instructionsConfig).setOrigin(0.5, 0.5);
        // Black
        instructionsConfig.color = '#000000';
        instructionsConfig.fontSize = '40px';
        this.add.text(centerX, 40, '<<SHIFT>>', instructionsConfig).setOrigin(0.5, 0.5);

    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyInstructions)) {
            this.scene.run('menuScene');
            this.scene.setVisible(true, 'menuScene');
            this.scene.stop('instructionsScene');
        }
    }
}