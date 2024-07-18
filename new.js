
grid = [] //This array is used to store circles
arr = [];  //This array will be used for computation
whichPlayerTurn = 1;
CpuPlaying = 0; //Can have value 1 and 2 when CPU is playing
timer = 20;
player1_score = 0
player2_score = 0
filled = 0
isHalt = 0 //Will be used for 

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
    isHalt = 1
    //first check if column has one empty place
    if (column_number < 0 || column_number > 7) return
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
        else if (CpuPlaying > 0) {
            if (CpuPlaying === 1 && player1_score > player2_score)
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
    isHalt = 0
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

function BotTurn() {
    if (CpuPlaying !== whichPlayerTurn)
        return;
    setTimeout(()=>{}, 3000)
    let column_number = 0;
    let empty_column = []
    for (let i = 0; i < 7; i++) {
        if (arr[0][i] === 0)
            empty_column.push(i); //Checking empty columns
    }
    column_number = empty_column[Math.floor(Math.random() * (empty_column.length - 1))]
    selectedColumn(column_number)
}
function full() {
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 7; j++) {
            if (this.arr[i][j] === 0)
                return 0;
        }
    }
    return 1;
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
    if (whichPlayerTurn === CpuPlaying)
        $('.turn').text(`Bot Turn`)
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
    whichPlayerTurn = 1 + Math.floor(Math.random() * 2);
    showTimeInDom();
    changeTimeBoxColorInDom()
    showScoreInDOM()
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
setInterval(BotTurn, 3000)

//Event Listeners 
$('.menu').click(function () {
    $('.menu-item').addClass('pop-up-animation')
})

$('.pop-up-container').click(function () {
    $('.pop-up-container').removeClass('pop-up-animation')
})

$('.p-v-p').click(function () {
    isCpuPlaying = 0
    resetPlayerBox();
    $('.menu-item').removeClass('pop-up-animation')
    restartGame();
})

$('.p-v-c').click(function () {
    restartGame();
    CpuPlaying = Math.floor(Math.random() * 2) + 1;
    $(`.player-${CpuPlaying}-box h2`).text('Bot')
    $(`.player-${(CpuPlaying) % 2 + 1}-box h2`).text('Player')
    $('.menu-item').removeClass('pop-up-animation');
})

$('.restart').click(function () {
    restartGame();
})