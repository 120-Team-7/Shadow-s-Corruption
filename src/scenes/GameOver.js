class GameOver extends Phaser.Scene {
    constructor() {
        super('gameOverScene');
    }

    create() {

        let gameOverConfig = {
            fontFamily: 'Courier',
            fontSize: '40px',
            color: '#FFFFFF',
            // strokeThickness: 5,
            // stroke: '#4682B4',
            align: 'center',
            padding: {
                top: 10,
                bottom: 10,
                left: 10,
                right: 10,
            },
            fixedWidth: 0
        }

        // Add text
        // this.add.text(centerX, centerY - textSpacer, 'You ran ' + currTime + ' meters of the Psychic Trials!', gameOverConfig).setOrigin(0.5);
        // this.add.text(centerX, centerY, 'Press enter to return to menu', gameOverConfig).setOrigin(0.5);
        // gameOverConfig.color = '#FF00FF';
        // if(currTime > highScore){
        //     highScore = currTime;
        //     this.add.text(centerX, centerY + textSpacer, 'NEW HIGH SCORE: ' + highScore, gameOverConfig).setOrigin(0.5);
        // } else {
        //     this.add.text(centerX, centerY + textSpacer, 'High score: ' + highScore, gameOverConfig).setOrigin(0.5);
        // }

    }

    update() {
        // Input to return to menu
        if (Phaser.Input.Keyboard.JustDown(keyStart)) {
            this.sound.play('buttonsound');
            this.scene.start('menuScene');
        }
    }
}