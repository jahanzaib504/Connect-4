
var grid = [] //This array is used to store circles
var arr = [];  //This array will be used for computation
var whichPlayerTurn = 1;
var CpuPlaying = 0; //Can have value 1 and 2 when CPU is playing
var timer = 20;
var player1_score = 0
var player2_score = 0
var filled = 0
var maxDepth = 7; //Max depth for alpha beta pruning

/*
function createCiclesInDOM();  Intialize and show circles 
function selectedColumn(column_number); Triggers when user clicks on a column
function showScoreInDOM(); shows the current scores of both players 
function changeTurn(); Changes turn
function foundLine(row_number, column_number); Checks if 4 circles are in straight line
function BotTurn();   Use for bot 
function full();     Checks if the whole grid is filled
function alertPopup(text); For showing  different messages in DOM
function addCircleToGrid(row_number, column_number);  Adds a circles to the selected cell
function changeTimeBoxColorInDom();
function showTimeInDom();
function clearCircles();
function resetTime();
function restartGame();
function resetPlayerBox();
function startTimer();
*/


function createCiclesInDOM() {
    let DOMGrid = $('.grid');
    for (let i = 0; i < 7; i++) {
        let column = $('<div></div>');
        column.addClass("column");
        column.addClass(`${i}`)
        for (let j = 0; j < 6; j++) {
            let circle = $(`<div class="grid-hollow-circle circle"></div>`);
            column.append(circle);
        }
        column.click(function (event) {
            if (whichPlayerTurn === CpuPlaying)
                return; //If CPU is playing then return
            let column = event.target.closest(".column");
            selectedColumn(eval(column.classList[1]))
        })

        DOMGrid.append(column);
        grid.push(column);
    }
    for (let i = 0; i < 6; i++)
        arr[i] = new Array(7).fill(0);
}
function selectedColumn(column_number) {
    //first check if column has one empty place
    if (column_number < 0 || column_number > 6) return
    let row_number = 0
    for (; row_number < 6; row_number++) {
        if (arr[row_number][column_number] != 0)
            break;
    }
    if (row_number === 0)
        return

    row_number -= 1;
    arr[row_number][column_number] = whichPlayerTurn;
    addCircleToGrid(row_number, column_number)
    if (foundLine(row_number, column_number)) {
        if (whichPlayerTurn === 1)
            player1_score++;
        else
            player2_score++;
    }
    showScoreInDOM()
    if (full()) {
        if (player1_score === player2_score)
            alertPopup('Tied')
        else if (CpuPlaying) {
            if (CpuPlaying === 1 && player1_score > player2_score || CpuPlaying === 2 && player2_score > player1_score)
                alertPopup('Bot Won');
            else
                alertPopup('Player Won')
        }
        else if (player1_score > player2_score)
            alertPopup('Player 1 Won')
        else
            alertPopup('Player 2 Won');
        restartGame()
        return;
    }
    changeTurn()
    changeTimeBoxColorInDom()
    resetTime()
    showTimeInDom()
    if (whichPlayerTurn === CpuPlaying) {
            console.log('hi')
            setTimeout(BotTurn, 500) 
    }
}


function showScoreInDOM() {
    $('.score-1').text(player1_score)
    $('.score-2').text(player2_score)
}

function changeTurn() {
    whichPlayerTurn = 1 + whichPlayerTurn % 2
}
function foundLine(row_number, column_number) {
    function putCoordinates(start_i, start_j, end_i, end_j, dir_i, dir_j) {
        let coordinates = [];
        for (let i = 0; i < 4; i++) {
            coordinates.push([start_i + i * dir_i, start_j + i * dir_j]);
        }
        //Animating circles
        coordinates.forEach(element => {
            const circle = $(grid[element[1]]).children().eq(element[0]).removeClass('line-animation')
            void circle[0].offsetHeight;
            circle.addClass('line-animation')
        });
    }

    let ptr1, ptr2;

    // Top to bottom
    ptr1 = row_number - 3;
    if (ptr1 < 0) ptr1 = 0;
    ptr2 = ptr1;
    while (ptr2 < row_number + 4 && ptr2 < 6) {
        if (arr[ptr2][column_number] === whichPlayerTurn) {
            ptr2++;
        } else {
            ptr1 = ptr2 + 1;
            ptr2 = ptr1;
        }
        if (ptr2 - ptr1 === 4) {
            putCoordinates(ptr1, column_number, ptr2 - 1, column_number, 1, 0);
            return 1;
        }
    }

    // Left to right
    ptr1 = column_number - 3;
    if (ptr1 < 0) ptr1 = 0;
    ptr2 = ptr1;
    while (ptr2 < column_number + 4 && ptr2 < 7) {
        if (arr[row_number][ptr2] === whichPlayerTurn) {
            ptr2++;
        } else {
            ptr1 = ptr2 + 1;
            ptr2 = ptr1;
        }
        if (ptr2 - ptr1 === 4) {
            putCoordinates(row_number, ptr1, row_number, ptr2 - 1, 0, 1);
            return 1;
        }
    }

    // Left to right diagonals
    let start_i = row_number - 3, start_j = column_number - 3, end_i, end_j;
    end_i = start_i;
    end_j = start_j;
    while (end_i < row_number + 4 && end_i < 6 && end_j < column_number + 4 && end_j < 7) {
        if (end_i >= 0 && end_j >= 0 && arr[end_i][end_j] === whichPlayerTurn) {
            end_i++;
            end_j++;
        } else {
            start_i = end_i + 1;
            start_j = end_j + 1;
            end_i = start_i;
            end_j = start_j;
        }
        if (end_i - start_i === 4 && end_j - start_j === 4) {
            putCoordinates(start_i, start_j, end_i - 1, end_j - 1, 1, 1);
            return 1;
        }
    }

    // Right to left diagonals
    start_i = row_number - 3;
    start_j = column_number + 3;
    end_i = start_i;
    end_j = start_j;
    while (end_i < row_number + 4 && end_i < 6 && end_j > column_number - 4 && end_j >= 0) {
        if (end_i >= 0 && end_j < 7 && arr[end_i][end_j] === whichPlayerTurn) {
            end_i++;
            end_j--;
        } else {
            start_i = end_i + 1;
            start_j = end_j - 1;
            end_i = start_i;
            end_j = start_j;
        }
        if (end_i - start_i === 4 && start_j - end_j === 4) {
            putCoordinates(start_i, start_j, end_i - 1, end_j + 1, 1, -1);
            return 1;
        }
    }

    return 0; // No line of four found
}


function evaluateBoard() {
    let score = 0;
    //Check in every direction 
    function check_line(player, row, column, dir_i, dir_j, count = 0) {
        if(count == 4) return 1

        if(row < 0 || row > 5 || column < 0 || column > 6) return 0;
        if (arr[row][column] === player)
            return check_line(player, row + dir_i, column + dir_j, dir_i, dir_j, count+1);
        else
            return 0;
    }
    let player1_lines = 0, player2_lines = 0; //Keeping track of cells occupied by each player for immediate wins

    const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];
    for(let i=0; i<arr.length; i++){
        for(let j=0; j<arr[i].length; j++){
            //Awarding a score of 10 for each circle closer to the center of board
            current_player = arr[i][j];
            if (current_player === 0) continue; // Skip empty cells

            let current_sign = current_player === CpuPlaying ? 1 : -1;

            score += (current_sign)*50*(3-Math.abs(3-j)) //50 score for each player
            directions.forEach(([dir_i, dir_j])=>{
                if(check_line(current_player, i,j,dir_i, dir_j)){
                    score += (current_sign)*1000 //1000 score for each player
                    if (current_player === CpuPlaying) {
                        player1_lines++;
                    } else {
                        player2_lines++;
                    }
                }
               
            })
        }
    }
    if(full()){
        if (player1_lines > player2_lines) {
            score = 10000; // Player 1 wins
        } else if (player2_lines > player1_lines) {
            score = 10000; // Player 2 wins
        }else score = 0
    }
    return score
    
}

function shuffler(array)
{
    for(let i=0; i<array.length; i++)
    {
        let j = Math.floor(Math.random() * array.length);
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Fixed alphaBetaPruning function
function alphaBetaPruning(depth, isMaximizingPlayer, alpha=-Infinity, beta=+Infinity) {
    // Base case: if we've reached the maximum depth or the board is full
    if (depth === 0 || full()) {
        return evaluateBoard();
    }
    
    let best_score = isMaximizingPlayer ? -Infinity : +Infinity;
    let best_move = {row: -1, column: -1};
    const column_array = [0, 1, 2, 3, 4, 5, 6]
    shuffler(column_array); // Shuffle columns for randomness
    // Try each column
    for (let idx = 0; idx < 7; idx++) {
        // Find the row where the piece would land
        let col = column_array[idx];
        let row = 5;
        while (row >= 0 && arr[row][col] !== 0) {
            row--;
        }
        
        // Skip if column is full
        if (row < 0) continue;
        
        // Make the move
        arr[row][col] = isMaximizingPlayer ? CpuPlaying : ((CpuPlaying % 2) + 1);
        filled++;
        
        // Recursively evaluate this move
        let score = alphaBetaPruning(depth - 1, !isMaximizingPlayer, alpha, beta);
        
        // Undo the move
        arr[row][col] = 0;
        filled--;
        
        // Update best score and move
        if (isMaximizingPlayer) {
            if (score > best_score) {
                best_score = score;
                if (depth === maxDepth) {
                    best_move.row = row;
                    best_move.column = col;
                }
            }
            alpha = Math.max(alpha, best_score);
        } else {
            if (score < best_score) {
                best_score = score;
                if (depth === maxDepth) {
                    best_move.row = row;
                    best_move.column = col;
                }
            }
            beta = Math.min(beta, best_score);
        }
        
        // Alpha-beta pruning
        if (beta <= alpha) break;
    }
    
    // Return the best move for the top-level call, otherwise return the score
    if (depth === maxDepth) {
        return best_move;
    }
    return best_score;
}
function BotTurn() {
    console.log('Bot Turn')
    if (CpuPlaying !== whichPlayerTurn) return;
    console.log('Bot Turn')

    let best_move = alphaBetaPruning(maxDepth, true);
    
    if (!best_move) return;

    selectedColumn(best_move.column)
}

function full() {
    return filled === 42;
}
function alertPopup(text) {
    let showText = $(".show-text h1");
    showText.text(text);

    let showTextContainer = $(".show-text");
    $(showTextContainer).addClass('pop-up-animation')
    setTimeout(() => { $(showTextContainer).removeClass('pop-up-animation') }, 2000)
}

function addCircleToGrid(row_number, column_number) {
    let $inside_circle = $('<div></div>');
    $inside_circle.addClass(`inside-circle circle player-${this.whichPlayerTurn}`);
    let hollowCircle = $(grid[column_number]).children().eq(row_number);

    $inside_circle.css('top', `-${hollowCircle.position().top}px`);
    hollowCircle.append($inside_circle);

    $inside_circle.addClass('animation-circle');
    filled++;
}
function changeTimeBoxColorInDom() {
    let timeBox = $(".timer-box");
    $(timeBox).removeClass("player-1 player-2")
    if (whichPlayerTurn === 1)
        $(timeBox).addClass("player-1")
    else
        $(timeBox).addClass("player-2")
}

function showTimeInDom() {
    $('.turn').text(`Player ${whichPlayerTurn}s Turn`)
    if (CpuPlaying){
        if(whichPlayerTurn===CpuPlaying)
            $('.turn').text(`Bot Turn`)
        else
            $('.turn').text('Player Turn');
    }
    $(".time").text(`${this.timer}s`)
}

function clearCircles() {
    for (var i = 0; i < 7; i++) { //Column loop
        for (var j = 0; j < 6; j++) { //Row loop 
            //Removing circles
            arr[j][i] = 0
            $(grid[i]).children().eq(j).empty()
        }
    }
}

function resetTime() {
    timer = 20;
}

function restartGame() {
    resetTime();
    clearCircles();
    player1_score = 0
    player2_score = 0
    filled = 0;
    showTimeInDom();
    changeTimeBoxColorInDom()
    showScoreInDOM()
    if(whichPlayerTurn === CpuPlaying) {
        setTimeout(BotTurn, 500) 
    }
}
function resetPlayerBox() {
    $('.player-1-box h2').text('Player 1')
    $('.player-2-box h2').text('Player 2')
}
function startTimer() {
    showTimeInDom()
    timer--
    if (timer === -1) {
        resetTime()
        changeTurn()
        changeTimeBoxColorInDom()
    }
}

createCiclesInDOM();
setInterval(startTimer, 1000)

//Event Listeners 
$('.menu').click(function () {
    $('.menu-item').addClass('pop-up-animation');
})

$('.pop-up-container').click(function () {
    $('.pop-up-container').removeClass('pop-up-animation')
})

$('.p-v-p').click(function () {
    CpuPlaying = 0
    resetPlayerBox();
    $('.menu-item').removeClass('pop-up-animation')
    restartGame();
    clearInterval(BotTurn)
})

$('.p-v-c').click(function () {
    restartGame();
    CpuPlaying = Math.floor(Math.random() * 2) + 1;
    if(CpuPlaying === whichPlayerTurn)
        setTimeout(BotTurn, 500) 
    $(`.player-${CpuPlaying}-box h2`).text('Bot')
    $(`.player-${(CpuPlaying) % 2 + 1}-box h2`).text('Player')
    $('.menu-item').removeClass('pop-up-animation');
})

$('.restart').click(function () {
    restartGame();
})
