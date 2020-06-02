class GameOver extends Phaser.Scene {
    constructor() {
        super('gameOverScene');
    }

    create() {

        keyStart = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);


        let gameOverConfig = {
            fontFamily: 'Courier',
            fontSize: '40px',
            color: '#8B008B',
            strokeThickness: strokeThickness,
            stroke: '#000000',
            align: 'center',
            padding: {
                top: 10,
                bottom: 10,
                left: 10,
                right: 10,
            },
            fixedWidth: 0,
            // wordWrap: {
            //     width: (screenWidth/2) - 50,
            //     useAdvancedWrap: true,
            // }
        }

        let spacer = 50;
        let leftTextX = 5;
        let leftNumX = centerX - 105
        let rightNumX = screenWidth - 115;
        let rightTextX = centerX + 15;

        // Add text
        if(currScene == 'tutorialScene') {
            this.completedScene = "tutorial";
        }
        if(isGameOver) {
            this.add.text(centerX, 50, "Shadow has been banished to the void!", gameOverConfig).setOrigin(0.5, 0.5);
        } else {
            this.add.text(centerX, 50, "You've completed the " + this.completedScene + "!", gameOverConfig).setOrigin(0.5, 0.5);
        }
        this.add.text(centerX, centerY - 4*spacer, 'Your Statistics ', gameOverConfig).setOrigin(0.5, 0.5);
        gameOverConfig.align = 'left';
        this.add.text(leftTextX, centerY - 3*spacer, "Enemies killed: ", gameOverConfig).setOrigin(0, 0);
        this.add.text(leftNumX, centerY - 3*spacer, pStats.enemiesKilled, gameOverConfig).setOrigin(0, 0);
        this.add.text(leftTextX, centerY - 2*spacer, "Orb kills: ", gameOverConfig).setOrigin(0, 0);
        this.add.text(leftNumX, centerY - 2*spacer, pStats.orbKilled, gameOverConfig).setOrigin(0, 0);
        this.add.text(leftTextX, centerY - spacer, "Knife kills: ", gameOverConfig).setOrigin(0, 0);
        this.add.text(leftNumX, centerY - spacer, pStats.knifeKilled, gameOverConfig).setOrigin(0, 0);
        this.add.text(leftTextX, centerY, "Damage dealt: ", gameOverConfig).setOrigin(0, 0);
        this.add.text(leftNumX, centerY, pStats.damageDealt, gameOverConfig).setOrigin(0, 0);
        this.add.text(leftTextX, centerY + spacer, "Corruption gained: ", gameOverConfig).setOrigin(0, 0);
        this.add.text(leftNumX, centerY + spacer, pStats.corruptionGained, gameOverConfig).setOrigin(0, 0);
        this.add.text(leftTextX, centerY + 2* spacer, "Orb corrupt damage: ", gameOverConfig).setOrigin(0, 0);
        this.add.text(leftNumX, centerY + 2* spacer, pStats.orbCorruptedDamage, gameOverConfig).setOrigin(0, 0);
        this.add.text(leftTextX, centerY + 3*spacer, "Knife corrupt damage: ", gameOverConfig).setOrigin(0, 0);
        this.add.text(leftNumX, centerY + 3*spacer, pStats.knifeCorruptedDamage, gameOverConfig).setOrigin(0, 0);

        this.add.text(rightTextX, centerY - 3*spacer, "Times shifted: ", gameOverConfig).setOrigin(0, 0);
        this.add.text(rightNumX, centerY - 3*spacer, pStats.switchNum, gameOverConfig).setOrigin(0, 0);
        this.add.text(rightTextX, centerY - 2*spacer, "Knives thrown: ", gameOverConfig).setOrigin(0, 0);
        this.add.text(rightNumX, centerY - 2*spacer, pStats.knifeThrown, gameOverConfig).setOrigin(0, 0);
        this.add.text(rightTextX, centerY - spacer, "Idle knife hits: ", gameOverConfig).setOrigin(0, 0);
        this.add.text(rightNumX, centerY - spacer, pStats.knifeStabbed, gameOverConfig).setOrigin(0, 0);
        this.add.text(rightTextX, centerY, "Red bullets blocked: ", gameOverConfig).setOrigin(0, 0);
        this.add.text(rightNumX, centerY, pStats.knifeBulletBlock, gameOverConfig).setOrigin(0, 0);
        this.add.text(rightTextX, centerY + spacer, "Orbs shot: ", gameOverConfig).setOrigin(0, 0);
        this.add.text(rightNumX, centerY + spacer, pStats.orbShot, gameOverConfig).setOrigin(0, 0);
        this.add.text(rightTextX, centerY + 2*spacer, "Idle orb hits: ", gameOverConfig).setOrigin(0, 0);
        this.add.text(rightNumX, centerY + 2*spacer, pStats.orbEnemyBlock, gameOverConfig).setOrigin(0, 0);
        this.add.text(rightTextX, centerY + 3*spacer, "Blue bullets blocked: ", gameOverConfig).setOrigin(0, 0);
        this.add.text(rightNumX, centerY + 3*spacer, pStats.orbBulletBlock, gameOverConfig).setOrigin(0, 0);

        gameOverConfig.align = 'center';
        this.add.text(centerX, screenHeight - 100, "Thank you for playing Shadow's Corruption", gameOverConfig).setOrigin(0.5, 0.5);
        this.add.text(centerX, screenHeight - 30, 'Press ENTER to return to menu', gameOverConfig).setOrigin(0.5, 0.5);

        isPaused = false;
        isGameOver = true;
    }

    update() {
        // Input to return to menu
        if (Phaser.Input.Keyboard.JustDown(keyStart)) {
            // this.sound.play('buttonsound');
            pStats.enemiesKilled = 0;
            pStats.orbKilled = 0;
            pStats.knifeKilled = 0;
            pStats.damageDealt = 0;
            pStats.knifeCorruptedDamage = 0; 
            pStats.orbCorruptedDamage = 0; 
            pStats.corruptionGained = 0; 
            pStats.switchNum = 0; 
            pStats.knifeThrown = 0; 
            pStats.knifeStabbed = 0; 
            pStats.knifeBulletBlock = 0; 
            pStats.orbShot = 0; 
            pStats.orbEnemyBlock = 0; 
            pStats.orbBulletBlock = 0;  
            this.scene.start('menuScene');
        }
    }
}