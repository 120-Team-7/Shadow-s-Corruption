class Credits extends Phaser.Scene {
    constructor() {
        super('creditsScene');
    }

    create() {
        keyCredits = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);

        this.cameras.main.setBackgroundColor('#000000');

        let creditsConfig = {
            fontFamily: 'Courier',
            fontSize: '25px',
            color: '#000000',
            stroke: '#8B008B',
            strokeThickness: strokeThickness,
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

        this.add.text(screenWidth - 10, 10, 'Press C to return', creditsConfig).setOrigin(1, 0);

        this.add.text(centerX, centerY - 5*textSpacer, 'A game by Team 7', creditsConfig).setOrigin(0.5, 0);
        this.add.text(centerX, centerY - 4*textSpacer, 'Henry Nguyen: Level Designer', creditsConfig).setOrigin(0.5, 0);
        this.add.text(centerX, centerY  - 3*textSpacer, 'Evan Li: Programmer', creditsConfig).setOrigin(0.5, 0);
        this.add.text(centerX, centerY - 2*textSpacer, 'Hoang Huynh: Artist & Sound Designer', creditsConfig).setOrigin(0.5, 0);

        this.add.text(centerX, centerY, 'Sources', creditsConfig).setOrigin(0.5, 0);
        this.add.text(centerX, centerY + 2*textSpacer, 'Room changing code: http://www.geekwagon.net/index.php/2019/room-changing-phaser3-titled/', creditsConfig).setOrigin(0.5, 0.5);
        this.add.text(centerX, centerY + 4*textSpacer, 'Title splash background art: https://www.freepik.com/free-vector/london-fire-plague-epidemic-illustration-london-city-burning-plague-disease_2890909.htm', creditsConfig).setOrigin(0.5, 0.5);


    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyCredits)) {
            this.scene.stop('creditsScene');
            this.scene.run('menuScene');
        }
    }
}