class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    init() {
        // useful variables
        this.SHOT_VELOCITY_X = 200;
        this.SHOT_VELOCITY_Y_MIN = 700;
        this.SHOT_VELOCITY_Y_MAX = 1100;

        this.currentScore = 0;
        this.shotsTaken = 0;
        this.shotPercentage = 0;
    }

    preload() {
        this.load.path = './assets/img/'
        this.load.image('grass', 'grass.jpg')
        this.load.image('cup', 'cup.jpg')
        this.load.image('ball', 'ball.png')
        this.load.image('wall', 'wall.png')
        this.load.image('oneway', 'one_way_wall.png')
    }

    create() {
        // add background grass
        this.grass = this.add.image(0, 0, 'grass').setOrigin(0)

        // add cup
        this.cup = this.physics.add.sprite(width / 2, height / 10, 'cup');
        this.cup.body.setCircle(this.cup.width / 4);
        this.cup.body.setOffset(this.cup.width / 4);
        this.cup.body.setImmovable(true);

        // add ball
        this.ball = this.physics.add.sprite(width / 2, height -  height / 10, 'ball');
        this.ball.body.setCircle(this.ball.width / 2);
        this.ball.body.setCollideWorldBounds(true);
        this.ball.body.setBounce(0.5);
        this.ball.body.setDamping(true).setDrag(0.5);

        // add walls
        let wallA = this.physics.add.sprite(0, height / 4, 'wall');
        wallA.setX(Phaser.Math.Between(0 + wallA.width / 2, width - wallA.width / 2));
        wallA.body.setImmovable(true);
            // make wallA move back and forth along the x axis
        wallA.body.setCollideWorldBounds(true);
        wallA.body.setBounce(1);
        wallA.body.setVelocityX(250);

        let wallB = this.physics.add.sprite(0, height / 2, 'wall');
        wallB.setX(Phaser.Math.Between(0 + wallB.width / 2, width - wallB.width / 2));
        wallB.body.setImmovable(true);

        this.walls = this.add.group([wallA, wallB]);

        // add one-way
        this.oneWay = this.physics.add.sprite(width / 2, height / 4 * 3, 'oneway');
        this.oneWay.setX(Phaser.Math.Between(0 + this.oneWay.width / 2, width - this.oneWay.width / 2));
        this.oneWay.body.setImmovable(true);
        this.oneWay.body.checkCollision.down = false;

        // add pointer input
        this.input.on('pointerdown', (pointer) => {
            let shotDirectionY = pointer.y <= this.ball.y ? 1 : -1;
            let shotDirectionX = pointer.x <= this.ball.x ? 1 : -1;
            this.ball.body.setVelocityX(Phaser.Math.Between(0, this.SHOT_VELOCITY_X) * shotDirectionX   );
            this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX) * shotDirectionY);
            // add to shot count
            this.shotsTaken += 1;
            this.shotText.setText('Shots: ' + this.shotsTaken);
            // calculate successful shots
            this.shotPercentage = Phaser.Math.RoundTo((this.currentScore / this.shotsTaken) * 100, 0);
            this.shotPercentageText.setText('Successful Shots: ' + this.shotPercentage + '%');
        
        });

        // cup/ball collision
        this.physics.add.collider(this.ball, this.cup, (ball, cup) => {
            // add to score
            this.currentScore += 1;
            this.scoreText.setText('Score: ' + this.currentScore);

            // calculate successful shots
            this.shotPercentage = Phaser.Math.RoundTo((this.currentScore / this.shotsTaken) * 100, 0);
            this.shotPercentageText.setText('Successful Shots: ' + this.shotPercentage + '%');

            // reset velo
            this.ball.body.setVelocity(0, 0);
            // move to bottom of screen
            this.ball.setPosition(width / 2, height - height / 10);
        });

        // ball/wall collision

        this.physics.add.collider(this.ball, this.walls);

        // ball/one-way collision
        this.physics.add.collider(this.ball, this.oneWay);

        // add texts
        let textConfig = {fontFamily: 'Courier', fontSize: '28px', backgroundColor: '#000'};
        this.shotText = this.add.text(0, height, 'Shots: 0', textConfig).setOrigin(0,1);
        this.shotPercentageText = this.add.text(width, height, 'Successful Shots: 0%', textConfig).setOrigin(1,1);
        this.scoreText = this.add.text(width / 2, 0, 'Score: 0', textConfig).setOrigin(0.5,0);
    }

    update() {

    }
}
/*
CODE CHALLENGE
Try to implement at least 3/4 of the following features during the remainder of class (hint: each takes roughly 15 or fewer lines of code to implement):
[ ] Add ball reset logic on successful shot
[ ] Improve shot logic by making pointer’s relative x-position shoot the ball in correct x-direction
[ ] Make one obstacle move left/right and bounce against screen edges
[ ] Create and display shot counter, score, and successful shot percentage
*/