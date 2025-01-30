class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    init() {
        // useful variables
        this.SHOT_VELOCITY_X_MIN = 200
        this.SHOT_VELOCITY_X_MAX = 500
        this.SHOT_VELOCITY_Y_MIN = 700
        this.SHOT_VELOCITY_Y_MAX = 1100


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
        this.cup = this.physics.add.sprite(width /2 , height/10, 'cup')
        this.cup.body.setCircle(this.cup.width / 4).setOffset(this.cup.width / 4)
        this.cup.body.setImmovable(true)
        
        // add ball
        this.ball = this.physics.add.sprite(width / 2, height - width / 10, 'ball')
        this.ball.body.setCircle(this.ball.width / 2)
        this.ball.body.setCollideWorldBounds(true)
        this.ball.body.setBounce(0.5)
        this.ball.body.setDamping(true).setDrag(0.5)

        // add walls
        this.wallA = this.physics.add.sprite(0, height / 4, 'wall')
        this.wallA.setX(Phaser.Math.Between(0 + this.wallA.width / 2, width - this.wallA.width / 2))
        this.wallA.body.setImmovable(true)

        this.wallB = this.physics.add.sprite(0, height / 2, 'wall')
        this.wallB.setX(Phaser.Math.Between(0 + this.wallB.width / 2, width - this.wallB.width / 2))
        this.wallB.body.setImmovable(true)
        this.wallB.setVelocityX(150)
        this.wallB.body.setCollideWorldBounds(true)
        this.wallB.setBounce(1)

        this.walls = this.add.group([this.wallA, this.wallB])

        // add one-way
        this.oneWay = this.physics.add.sprite(0, height / 4 * 3, 'oneway')
        this.oneWay.setX(Phaser.Math.Between(0 + this.oneWay.width / 2, width - this.oneWay.width / 2))
        this.oneWay.body.setImmovable(true)
        this.oneWay.body.checkCollision.down = false

        this.score = 0
        this.shots = 0
        this.percentage = 0

        this.shotText = this.add.text(20, 20, `Shots: ${this.shots}`, {fontSize: '32px', fill: '#000', backgroundColor: '#FACADE'})
        this.scoreText = this.add.text(20, 60, `Score: ${this.score}`, {fontSize: '32px', fill: '#000', backgroundColor: '#FACADE'})
        this.percentageText = this.add.text(380, 20, `Accuracy: ${this.percentage}%`, {fontSize: '32px', fill: '#000', backgroundColor: '#FACADE'})

        // add pointer input
        this.input.on('pointerdown', (pointer) => {
            let shotDirectionY = pointer.y <= this.ball.y ? 1 : -1
            let shotDirectionX = pointer.x <= this.ball.x ? 1 : -1
            this.ball.body.setVelocityX(Phaser.Math.Between(this.SHOT_VELOCITY_X_MIN, this.SHOT_VELOCITY_X_MAX) * shotDirectionX)
            this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX) * shotDirectionY)

            // Shot Counter
            this.shots++
            this.shotText.setText(`Shots: ${this.shots}`)

            this.updatePercentage()

        })

        // cup/ball collision
        this.physics.add.collider(this.ball, this.cup, (ball, cup) => {
            // Score Counter
            this.score++
            this.scoreText.setText(`Score: ${this.score}`)

            this.updatePercentage()

            ball.setPosition(width / 2, height - width / 10)
            ball.setVelocityY(0)
            ball.setVelocityX(0)

        })

        // ball/wall collision
        this.physics.add.collider(this.ball, this.walls)

        // ball/one-way collision
        this.physics.add.collider(this.ball, this.oneWay)

    }

    update() {

    }

    ball(){
        this.ball = this.physics.add.sprite(width / 2, height - width / 10, 'ball')
        this.ball.body.setCircle(this.ball.width / 2)
        this.ball.body.setCollideWorldBounds(true)
        this.ball.body.setBounce(0.5)
        this.ball.body.setDamping(true).setDrag(0.5)
    }

    //Shot Percentage
    updatePercentage() {
        if(this.shots > 0){
            this.percentage = ((this.score / this.shots) * 100).toFixed(0)
            this.percentageText.setText(`Accuracy: ${this.percentage}%`);
        }
    }
}

/*
CODE CHALLENGE
Try to implement at least 3/4 of the following features during the remainder of class (hint: each takes roughly 15 or fewer lines of code to implement):
[X] Add ball reset logic on successful shot
[X] Improve shot logic by making pointer’s relative x-position shoot the ball in correct x-direction
[X] Make one obstacle move left/right and bounce against screen edges
[X] Create and display shot counter, score, and successful shot percentage
*/