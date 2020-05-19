class Instructions extends Phaser.Scene {
    constructor() {
        super('instructionsScene');
    }

    create() {
        keyInstructions = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);

        this.cameras.main.setBackgroundColor('#696969');

        let instructionsConfig = {
            fontFamily: 'Courier',
            fontSize: '32px',
            color: '#FFFFFF',
            align: 'center',
            padding: {
                top: 15,
                bottom: 15,
                left: 10,
                right: 10,
            },
            fixedWidth: 0,
            wordWrap: {
                width: screenWidth - 30,
                useAdvancedWrap: true,
            }
        }

        // Images
        // Red
        this.redPlayerImage = this.add.sprite(centerX - 50, imagesY, 'redPlayer').setOrigin(0.5, 0.5).setFlipX(true);
        this.knifeImage = this.add.sprite(centerX - (50 + idleWeaponDistance), imagesY, 'knife').setOrigin(0.5, 0.5).setFlipX(true);
        this.corruptKnifeImage = this.add.sprite(screenWidth/4 - 20, imagesY, 'corruptKnife').setOrigin(0.5, 0.5).setFlipX(true);
        this.redEnemy = this.add.sprite(50, imagesY, 'redObstacle').setOrigin(0.5, 0.5).setScale(0.25);
        // Blue
        this.bluePlayerImage = this.add.sprite(centerX + 50, imagesY, 'bluePlayer').setOrigin(0.5, 0.5);
        this.orbImage = this.add.sprite(centerX + (50 + idleWeaponDistance), imagesY, 'orb').setOrigin(0.5, 0.5).setScale(1.5, 1.5);
        this.corruptOrbImage = this.add.sprite(3*screenWidth/4 + 20, imagesY, 'corruptOrb').setOrigin(0.5, 0.5).setScale(1.5, 1.5);
        this.blueEnemy = this.add.sprite(screenWidth - 50, imagesY, 'blueObstacle').setOrigin(0.5, 0.5).setScale(0.25);



        // Text
        // White
        // this.add.text(centerX, textSpacer, 'WASD to move. MOUSE to aim and LEFT MOUSE BUTTON to shoot weapon.', instructionsConfig).setOrigin(0.5, 0.5);
        // this.add.text(centerX, textSpacer + smallTextSpacer, 'SHIFT the player color state between RED and BLUE.', instructionsConfig).setOrigin(0.5, 0.5);
        // this.add.text(centerX, textSpacer + 2*smallTextSpacer, 'RED hits RED, BLUE hits BLUE, and OPPOSITES pass through.', instructionsConfig).setOrigin(0.5, 0.5);
        // this.add.text(centerX, textSpacer + 3*smallTextSpacer, 'Equiped weapon is based on player color state. The RED KNIFE can be rapidly shot', instructionsConfig).setOrigin(0.5, 0.5);
        // this.add.text(centerX, textSpacer + 4*smallTextSpacer, 'or used to stab enemies in close range. The BLUE ORB can be shot as an', instructionsConfig).setOrigin(0.5, 0.5);
        // this.add.text(centerX, textSpacer + 5*smallTextSpacer, 'accelerating, piercing projectile or block enemies in close range.', instructionsConfig).setOrigin(0.5, 0.5);
        // this.add.text(centerX, textSpacer + 6*smallTextSpacer, 'Gain CORRUPTION when dealing damage with KNIFE, blocking enemies with ORB, or', instructionsConfig).setOrigin(0.5, 0.5);
        // this.add.text(centerX, textSpacer + 7*smallTextSpacer, 'blocking enemy shots with a close range weapon. SHIFT and expend CORRUPTION to ', instructionsConfig).setOrigin(0.5, 0.5);
        // this.add.text(centerX, textSpacer + 8*smallTextSpacer, 'deliver a single extra damage attack. Strategically SHIFT to reallocate your', instructionsConfig).setOrigin(0.5, 0.5);
        // this.add.text(centerX, textSpacer + 9*smallTextSpacer, 'offensive and defensive capabilities at the right time. Use your CORRUPTION often', instructionsConfig).setOrigin(0.5, 0.5);
        // this.add.text(centerX, textSpacer + 10*smallTextSpacer, 'to wipe out enemies before they SHIFT their own color state and overwhelm you!', instructionsConfig).setOrigin(0.5, 0.5);

        this.instructionText = this.add.text(centerX, centerY - 30, 'WASD to move. MOUSE to aim and LEFT MOUSE BUTTON to shoot weapon. SHIFT the player color state between RED and BLUE. RED hits RED, BLUE hits BLUE, and OPPOSITES pass through. Equiped weapon is based on player color state. The RED KNIFE can be rapidly shot or used to stab enemies in close range. The BLUE ORB can be shot as an accelerating, piercing projectile or block enemies in close range. Gain CORRUPTION when dealing damage with KNIFE, blocking enemies with ORB, or blocking enemy shots with a close range weapon. SHIFT and expend CORRUPTION to deliver a single extra damage attack. Strategically SHIFT to reallocate your offensive and defensive capabilities at the right time. Use your CORRUPTION often to wipe out enemies before they SHIFT their own color state and overwhelm you!', instructionsConfig).setOrigin(0.5, 0.5);
        // Phaser.GameObjects.Text.advancedWordWrap(this.instructionText, this, screenWidth - 20);
        // Red
        instructionsConfig.color = '#FF0000';
        instructionsConfig.fontSize = '60px';
        this.add.text(screenWidth - 200, 40, 'Red State', instructionsConfig).setOrigin(0.5, 0.5);
        // Blue
        instructionsConfig.color = '#0000FF';
        this.add.text(200, 40, 'Blue State', instructionsConfig).setOrigin(0.5, 0.5);
        // White bottom
        instructionsConfig.color = '#FFFFFF';
        instructionsConfig.fontSize = '25px';
        this.add.text(centerX, screenHeight - 20, 'Press I to return to menu, M to toggle mute, B to toggle physics debug', instructionsConfig).setOrigin(0.5, 0.5);

    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyInstructions)) {
            this.scene.run('menuScene');
            this.scene.setVisible(true, 'menuScene');
            this.scene.stop('instructionsScene');
        }
    }
}