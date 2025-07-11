class C {
    constructor (x, y) {
        this.x = x;
        this.y = y;

        this.pos = `${x} ${y}`
    }

    add (c1) {
        return new C(this.x + c1.x, this.y + c1.y);
    }
}

const BOARD  = document.getElementById("board");
const START  = document.getElementById("start");
const SCORE  = document.getElementById("score");
const COLORS = {
    red:   "RED",
    green: "GREEN",
    black: "BLACK",
};
const DIRECTIONS = {
    right: new C(1, 0),  down: new C(0, 1), 
    left:  new C(-1, 0), up:   new C(0, -1)
};


var length, direction, position, snake, fruits, score;
var lock = false;

const tickspeed = 250;


function board_setup() 
{
    for (let y=0; y<16; y++) {
        for (let x=0; x<16; x++) {
            BOARD.innerHTML += `<div class="cell" id="${x} ${y}"></div>`
        }
    }    
}

function remove_color(position) 
{
    // Get the grid item
    let cell = document.getElementById(`${position.x} ${position.y}`);

    // Attempt to remove all colors in COLORS
    for (let c in COLORS) {
        cell.classList.remove(COLORS[c]);
    }
}

function change_color(position, color) 
{
    // Get the grid item
    let cell = document.getElementById(`${position.x} ${position.y}`);

    // Attempt to remove all colors in COLORS
    for (let c in COLORS) {
        cell.classList.remove(COLORS[c]);
    }

    // Add the color
    cell.classList.add(color)
}

function printit(snake) 
{
    let str = "";
    for (let c in snake) {
        str += `(${snake[c].pos}),`;
    }
}

function dirswap(dir)
{
    let diff = DIRECTIONS[dir].add(direction);
    if (diff.x == 0 && diff.y == 0) { return; }

    direction = DIRECTIONS[dir];
}

function update_status(msg) 
{
    document.getElementById("status").innerHTML = msg;
}

function die() 
{
    lock = false;
    START.classList.remove("inactive");
    START.classList.add("active");

    update_status("DEAD");
}

function createFruit()
{
    let x = Math.floor(Math.random() * 16);
    let y = Math.floor(Math.random() * 16);
    
    let position = new C(x, y);

    let valid = true;
    for (let pos in snake) {
        if (snake[pos].pos == position.pos)
            valid = false;
    }

    for (let pos in fruits) {
        if (fruits[pos].pos == position.pos)
            valid = false;
    }

    if (valid) {
        fruits.push(position);
        change_color(position, COLORS.red);
    }
    else return createFruit();
}


function tick() 
{
    // Calculate new position
    position = position.add(direction);

   // Confirm position is legal
    if (position.x < 0 || position.x > 15) { die(); return; } else 
    if (position.y < 0 || position.y > 15) { die(); return; }

    // Confirm none of the positions are already in snake
    for (let pos in snake) {
        if (snake[pos].pos == position.pos) {
            die();
            return;
        }
    }

    // If you collide with a fruit, then we'll
    // grow and delete that fruit
    let index = 0;
    while (index < fruits.length) {
        if (fruits[index].pos == position.pos) {
            length += 1
            fruits.splice(index, 1);
            createFruit();
            score += 500;
        }

        index++;
    }


    // Draw the new position
    change_color(position, COLORS.green);
    snake.push(position);

    // Remove snake tail
    if (snake.length > length) {
        let removed = snake.shift();
        remove_color(removed);
    }

    // Update the score
    SCORE.innerHTML = `Score: ${score}`;

    setTimeout(tick, tickspeed);
}

function scoreit()
{
    if (lock) {
        score += 1;

        // Update the score
        SCORE.innerHTML = `Score: ${score}`;

        setTimeout(scoreit, tickspeed / 5);
    }
}

function go() 
{
    // Lock go function
    lock = true;
    START.classList.remove("active");
    START.classList.add("inactive");

    // Reset all the squares
    for (let y=0; y<16; y++) {
        for (let x=0; x<16; x++) {
            remove_color(new C(x, y));
        }
    }  

    length = 3;
    direction = DIRECTIONS.right;
    position = new C(1, 1);
    snake = [position];
    fruits = [];
    score = 0;

    for (let i=0; i<5; i++) {
        createFruit();
    }

    update_status("Alive");

    change_color(position, COLORS.green);
    setTimeout(tick, tickspeed);
    setTimeout(scoreit, tickspeed / 5);
}

board_setup();