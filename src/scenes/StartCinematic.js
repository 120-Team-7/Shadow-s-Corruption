class StartCinematic extends Phaser.Scene {
    constructor() {
        super('startCinematicScene');
    }


    create() {
        this.keyContinue = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // this.sceneKey = 'startCinematicScene';
        // currScene = this.sceneKey;

        let cutsceneConfig = {
            fontFamily: 'Courier',
            fontSize: '30px',
            color: '#8B008B',
            stroke: '#000000',
            strokeThickness: strokeThickness,
            align: 'center',
            padding: {
                top: 10,
                bottom: 10,
                left: 0,
                right: 0,
            },
            wordWrap: {
                width: screenWidth,
                useAdvancedWrap: true,
            }
        }
        
        this.skipping = false;
        this.timer1Active = true;
        this.timer2Active = false;
        this.timer3Active = false;
        this.timer4Active = false;
        this.timer5Active = false;
        this.timer6Active = false;
        this.timer7Active = false;

        this.timer1 = this.time.delayedCall(2000, () => {
            this.timer1Active = false;
            this.canContinue = true;
        }, null, this);

        this.canContinue = false;

        this.redHalf = this.add.rectangle(-screenWidth, 0, screenWidth, screenHeight, playerRed).setOrigin(0, 0).setAlpha(0.5);
        this.blueHalf = this.add.rectangle(2*screenWidth, 0, screenWidth, screenHeight, playerBlue).setOrigin(0, 0).setAlpha(0.5);

        this.knife = this.add.sprite(centerX/2, centerY, 'bigSword').setOrigin(0.5, 0.5).setScale(0.3, 0.3).setAlpha(0);
        this.orb = this.add.sprite(centerX + centerX/2, centerY, 'bigOrb').setOrigin(0.5, 0.5).setScale(0.3, 0.3).setAlpha(0);
        this.essCorruption = this.add.sprite(centerX, centerY, 'bigEss1').setOrigin(0.5, 0.5).setScale(0.3, 0.3).setAlpha(0);

        this.prisonInitY = centerY - 100;
        this.prisonDoor = this.add.sprite(centerX, this.prisonInitY + 50, 'prisonDoor').setOrigin(0.5, 0.5).setAlpha(0);

        corruptionParticles = this.add.particles('corruptionParticle');

        this.groundLight = this.add.sprite(centerX, this.prisonInitY + 125, 'groundLight').setOrigin(0.5, 0.5).setAlpha(0);
        this.shadowCharacter = this.add.sprite(centerX, this.prisonInitY + 60, 'redPlayerCutscene').setOrigin(0.5, 0.5).setAlpha(0).setScale(0.2, 0.2);
        this.sourceLight = this.add.sprite(centerX, this.prisonInitY - 80, 'sourceLight').setOrigin(0.5, 0.5).setAlpha(0);

        this.shiftCircle = this.add.ellipse(this.shadowCharacter.x, this.shadowCharacter.y, 2*screenWidth, 2*screenWidth);
        this.shiftCircle.setAlpha(0);
        this.shiftCircle.setFillStyle(playerBlue);
        this.corruptCircle = this.add.ellipse(this.prisonDoor.x, this.prisonDoor.y, 400, 400);
        this.corruptCircle.setFillStyle(darkMagenta);
        this.corruptCircle.setAlpha(0);

        this.textBoxY = 90;
        this.textBox = this.add.rectangle(centerX, screenHeight, screenWidth, this.textBoxY, gray).setOrigin(0.5, 1);
        this.cinematicText = this.add.text(centerX, screenHeight - this.textBoxY, 'They imprisoned me for ten thousand years.', cutsceneConfig).setOrigin(0.5, 0);
        cutsceneConfig.fontSize = '20px';
        this.buttonPromt = this.add.text(screenWidth - 10, screenHeight + 5, '(Spacebar)', cutsceneConfig).setOrigin(1, 1);
        this.skipPrompt = this.add.text(10, screenHeight + 5, 'ESC to skip', cutsceneConfig).setOrigin(0, 1);

        this.corruptionBox = new Phaser.Geom.Rectangle(centerX - 50, this.prisonInitY - 50, 100, 200);
        this.corruptionSpew = corruptionParticles.createEmitter({
            emitZone: { source: this.corruptionBox },
            lifespan: { min: 500, max: 5000, steps: 1000 },
            speedX: { min: -200, max: 200 },
            alpha: { start: 1, end: 0 },
            scale: { start: 0.5, end: 0 },
            quantity: 2,
            frequency: 50,
        });
        this.corruptionSpew.stop();
        this.corruptionDoor = corruptionParticles.createEmitter({
            emitZone: { source: this.corruptionBox },
            lifespan: 5000,
            speed: { min: -200, max: 200 },
            alpha: { start: 1, end: 0 },
            scale: { start: 0.5, end: 0 },
            quantity: 5,
            frequency: 100,
        });
        this.corruptionDoor.stop();

        this.redRealmEnter = this.tweens.add( {
            targets: this.redHalf,
            x: { from: -screenWidth, to: -centerX },
            ease: 'Quart.easeIn',
            duration: 2000,
            paused: true,
        });
        this.blueRealmEnter = this.tweens.add( {
            targets: this.blueHalf,
            x: { from: screenWidth, to: centerX },
            ease: 'Quart.easeIn',
            duration: 2000,
            paused: true,
        });

        this.redRealmCollide = this.tweens.add( {
            targets: this.redHalf,
            x: { from: -centerX, to: 0 },
            ease: 'Quart.easeIn',
            duration: 5000,
            paused: true,
        });
        this.blueRealmCollide = this.tweens.add( {
            targets: this.blueHalf,
            x: { from: centerX, to: 0 },
            ease: 'Quart.easeIn',
            duration: 5000,
            paused: true,
        });

        this.redRealmLeave = this.tweens.add( {
            targets: this.redHalf,
            x: { from: 0, to: screenWidth },
            ease: 'Quart.easeOut',
            duration: 3000,
            paused: true,
        });
        this.blueRealmLeave = this.tweens.add( {
            targets: this.blueHalf,
            x: { from: 0, to: -screenWidth },
            ease: 'Quart.easeOut',
            duration: 3000,
            paused: true,
            onComplete: function() {
                this.scene.stop('startCinematicScene');
            },
            onCompleteScope: this
        });

        this.corruptCircleBloom = this.tweens.add({
            targets: this.corruptCircle,
            paused: true,
            scale: { from: 0.5, to: 1},
            alpha: { from: 1, to: 0},
            ease: 'Quart.easeOut',
            duration: 1000,
        });
        this.shiftCircleBurst = this.tweens.add({
            targets: this.shiftCircle,
            paused: true,
            scale: { from: 0, to: 1},
            alpha: { from: 0.2, to: 0},
            ease: 'Sine.easeIn',
            duration: switchEffectsDuration,
        });

        this.counter = 0;
        this.fadeIn(this.prisonDoor, 2000, 1);
        this.fadeIn(this.textBox, 2000, 1);
        this.fadeIn(this.cinematicText, 2000, 1);
        this.input.keyboard.on('keydown-SPACE', function () {
            if(this.canContinue) {
                this.counter++;
                if(this.counter == 1) {
                    this.canContinue = false;
                    this.timer2Active = true;
                    this.timer2 = this.time.delayedCall(1000, () => {
                        this.timer2Active = false;
                        this.canContinue = true;
                    }, null, this);
                    this.fadeOutInText("Traversing the void between realms was corrupting the purity of their perfect reality.");
                    this.corruptionDoor.start();
                }
                if(this.counter == 2) {
                    this.canContinue = false;
                    this.fadeOutInText("As Shadow, master of both physical and spiritual realms, I am the harbinger of the void corruption.");
                    this.corruptCircleBloom.play();
                    this.fadeOut(this.prisonDoor, 1000, 1);
                    this.tweens.add( {
                        targets: this.corruptionDoor,
                        frequency: { from: 20, to: 1 },
                        ease: 'Quart.easeIn',
                        duration: 3000,
                        onComplete: function() {
                            this.canContinue = true;
                            this.corruptionDoor.stop();
                            this.fadeIn(this.groundLight, 1000, 1);
                            this.fadeIn(this.shadowCharacter, 3000, 1);
                            this.fadeIn(this.sourceLight, 1000, 1);
                        },
                        onCompleteScope: this
                    });
                }
                if(this.counter == 3) {
                    this.canContinue = false;
                    this.timer3Active = true;
                    this.timer3 = this.time.delayedCall(1000, () => {
                        this.timer3Active = false;
                        this.canContinue = true;
                    }, null, this);
                    this.fadeOutInText("Phasing between realms, I was chosen to expand the void's reach.");
                    this.shiftCircleBurst.play();
                    this.shadowCharacter.setTexture('bluePlayerCutscene');
                }
                if(this.counter == 4) {
                    this.canContinue = false;
                    this.timer4Active = true;
                    this.timer4 = this.time.delayedCall(3000, () => {
                        this.timer4Active = false;
                        this.canContinue = true;
                    }, null, this);
                    this.fadeOutInText("All will become my domain after the realms finally embrace the void.");
                    this.fadeOut(this.groundLight, 1000, 1);
                    this.fadeOut(this.sourceLight, 1000, 1);

                    this.shadowLeave = this.tweens.add( {
                        targets: this.shadowCharacter,
                        y: { from: this.shadowCharacter.y, to: screenHeight + 500 },
                        scale: { from: 0.2, to: 1.2 },
                        ease: 'Sine.easeIn',
                        duration: 5000,
                    });
                }
                if(this.counter == 5) {
                    this.canContinue = false;
                    this.timer5Active = true;
                    this.timer5 = this.time.delayedCall(2000, () => {
                        this.timer5Active = true;
                        this.canContinue = true;
                    }, null, this);
                    this.fadeOutInText("The time has come to dismantle this meaningless barrier.");
                    this.redRealmEnter.play();
                    this.blueRealmEnter.play();
                }
                if(this.counter == 6) {
                    this.canContinue = false;
                    this.timer6Active = true;
                    this.timer6 = this.time.delayedCall(3000, () => {
                        this.timer6Active = false;
                        this.canContinue = true;
                    }, null, this);
                    this.fadeOutInText("With my knife, orb, and Essense of Corruption, the legendary weapons of both the realms and void are mine.");
                    this.fadeIn(this.knife, 1000, 1);
                    this.fadeIn(this.orb, 2000, 1);
                    this.fadeIn(this.essCorruption, 3000, 1);
                }
                if(this.counter == 7) {
                    this.canContinue = false;
                    this.timer7Active = true;
                    this.timer7 = this.time.delayedCall(5000, () => {
                        this.timer7Active = false;
                        this.canContinue = true;
                    }, null, this);
                    this.fadeOutInText("Only chaos and power will determine worth in this new reality.");
                    this.corruptionBox.setSize(1, screenHeight);
                    this.corruptionBox.setPosition(centerX, 0);
                    this.essCorruption.setDepth(100);
                    this.essCorruption.setTexture('bigEss2');
                    this.fadeOut(this.knife, 1000, 1);
                    this.fadeOut(this.orb, 1000, 1);
                    this.corruptionSpew.setFrequency(10);
                    this.corruptionSpew.start();
                    this.redRealmCollide.play();
                    this.blueRealmCollide.play();
                }
                if(this.counter == 8) {
                    this.scene.run('menuScene');
                    this.scene.sendToBack('menuScene');
                    this.canContinue = false;
                    this.fadeOut(this.essCorruption, 1000, 1);
                    this.fadeOut(this.skipPrompt, 1000, 1);
                    this.fadeOut(this.cinematicText, 1000, 1);
                    this.fadeOut(this.textBox, 1000, 1);
                    this.corruptionSpew.stop();
                    this.redRealmLeave.play();
                    this.blueRealmLeave.play();
                }
            }
        }, this);

        this.input.keyboard.on('keydown-ESC', function () {
            if(!this.skipping) {
                this.tweens.killAll();
                this.skipping = true;
                this.canContinue = false;
                this.corruptionSpew.stop();
                this.corruptionDoor.stop();
                this.redHalf.setAlpha(1);
                this.blueHalf.setAlpha(1);
                this.redHalf.setDepth(1000);
                this.blueHalf.setDepth(1000);
                this.fadeOut(this.skipPrompt, 1000, 1);
                if(this.cinematicText.alpha == 1) {
                    this.fadeOut(this.cinematicText, 1000, 1);

                } else {
                    this.cinematicText.setAlpha(0);
                }
                if(this.textBox.alpha == 1) {
                    this.fadeOut(this.textBox, 1000, 1);
                } else {
                    this.cinematicText.setAlpha(0);
                }
                this.redRealmCross = this.tweens.add( {
                    targets: this.redHalf,
                    x: { from: -screenWidth, to: screenWidth },
                    ease: 'Sine.easeInOut',
                    duration: 3000,
                });
                this.blueRealmCross = this.tweens.add( {
                    targets: this.blueHalf,
                    x: { from: screenWidth, to: -screenWidth },
                    ease: 'Sine.easeInOut',
                    duration: 3000,
                    onComplete: function() {
                        this.scene.stop('startCinematicScene')
                    },
                    onCompleteScope: this
                });
                this.tweens.add( {
                    targets: [ this.redHalf, this.blueHalf ],
                    alpha: { from: 1, to: 0},
                    ease: 'Sine.easeIn',
                    duration: 3000,
                });
                this.time.delayedCall(1200, () => {
                    if(this.timer1Active) {
                        this.timer1.remove();
                    }
                    if(this.timer2Active) {
                        this.timer2.remove();
                    }
                    if(this.timer3Active) {
                        this.timer3.remove();
                    }
                    if(this.timer4Active) {
                        this.timer4.remove();
                    }
                    if(this.timer5Active) {
                        this.timer5.remove();
                    }
                    if(this.timer6Active) {
                        this.timer6.remove();
                    }
                    if(this.timer7Active) {
                        this.timer7.remove();
                    }
                    this.knife.setVisible(false);
                    this.orb.setVisible(false);
                    this.essCorruption.setVisible(false);
                    this.prisonDoor.setVisible(false);
                    this.groundLight.setVisible(false);
                    this.shadowCharacter.setVisible(false);
                    this.sourceLight.setVisible(false);
                    this.shiftCircle.setVisible(false);
                    this.corruptCircle.setVisible(false);
                    this.textBox.setVisible(false);
                    this.cinematicText.setVisible(false);
                    this.buttonPromt.setVisible(false);
                    this.corruptionSpew.remove();
                    this.corruptionDoor.remove();
                    this.scene.run('menuScene');
                    this.scene.sendToBack('menuScene');
                }, null, this);
                this.canContinue = false;
            }
        }, this);
    }

    update () {
        if(this.canContinue && !this.skipping) {
            this.buttonPromt.setAlpha(1);
        } else {
            this.buttonPromt.setAlpha(0);
        }
    }

    fadeIn(target, duration, endAlpha) {
        this.tweens.add( {
            targets: target,
            alpha: { from: 0, to: endAlpha },
            ease: 'Quart.easeIn',
            duration: duration,
        });
    }
    fadeOut(target, duration, startAlpha) {
        this.tweens.add( {
            targets: target,
            alpha: { from: startAlpha, to: 0},
            ease: 'Quart.easeIn',
            duration: duration,
        });
    }
    fadeOutInText(string) {
        this.tweens.add( {
            targets: this.cinematicText,
            alpha: { from: 1, to: 0},
            ease: 'Quart.easeOut',
            duration: 250,
            onComplete: function() {
                this.cinematicText.setText(string);
                this.tweens.add( {
                    targets: this.cinematicText,
                    alpha: { from: 0, to: 1},
                    ease: 'Quart.easeIn',
                    duration: 250,
                });
            },
            onCompleteScope: this
        });
    }
}