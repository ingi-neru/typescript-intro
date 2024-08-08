var game = false;
var rectangles = [];
var w = 300;
var h = 100;
var opList = [];
var number;
var numberFromCanvas;
var randomizedIndexes = [];
var color1 = "#93C572";
var color2 = "#8A9A5B";
var color3 = "#008080";
var color4 = "green";
var color5 = "red";
var selected = [false, false];
var selectedIndex = [0, 0];
var allSelected = 0;
function init() {
    rectangles = [];
    opList = [];
    number = 0;
    randomizedIndexes = [];
    selected = [false, false];
    selectedIndex = [-1, -1];
    allSelected = 0;
}
function updateRectangles(canvas) {
    for (var i = 0; i < number; i++) {
        rectangles[2 * i] = {
            path: new Path2D(),
            index: i * 2,
            chosenIndex: -1,
            x: canvas.width / 4,
            y: i * (h + 10),
        };
        rectangles[2 * i].path.rect(canvas.width / 4, i * (h + 10), w, h);
        rectangles[2 * i + 1] = {
            path: new Path2D(),
            index: i * 2 + 1,
            chosenIndex: -1,
            x: canvas.width * (3 / 4) - w,
            y: i * (h + 10),
        };
        rectangles[2 * i + 1].path.rect(canvas.width * (3 / 4) - w, i * (h + 10), w, h);
    }
}
function getSelectedOperators() {
    var addition = document.getElementById("addition")
        .checked;
    var subtraction = document.getElementById("subtraction").checked;
    var multiplication = document.getElementById("multiplication").checked;
    var division = document.getElementById("division")
        .checked;
    return {
        addition: addition,
        subtraction: subtraction,
        multiplication: multiplication,
        division: division,
    };
}
function calculate(operand1, operator, operand2) {
    switch (operator) {
        case "+":
            return operand1 + operand2;
        case "-":
            return operand1 - operand2;
        case "*":
            return operand1 * operand2;
        case "/":
            return operand1 / operand2;
        default:
            throw new Error("Invalid operator");
    }
}
function checkDuplicate(operandList, value) {
    for (var i = 0; i < operandList.length; i++) {
        if (Object.values(operandList[i])[0] === value) {
            return true;
        }
    }
    return false;
}
function createOperandList() {
    var _a;
    var _b = getSelectedOperators(), a = _b.addition, s = _b.subtraction, m = _b.multiplication, d = _b.division;
    var operators = [];
    if (a) {
        operators.push("+");
    }
    if (s) {
        operators.push("-");
    }
    if (m) {
        operators.push("*");
    }
    if (d) {
        operators.push("/");
    }
    if (operators.length === 0) {
        operators.push("+");
        operators.push("-");
        operators.push("*");
        operators.push("/");
    }
    var operandList = [];
    for (var i = 0; i < number; i++) {
        var operator = operators[Math.floor(Math.random() * operators.length)];
        var operand1 = Math.floor(Math.random() * 99) + 1;
        var operand2 = Math.floor(Math.random() * 99) + 1;
        var key = "".concat(operand1, " ").concat(operator, " ").concat(operand2);
        var value = calculate(operand1, operator, operand2);
        while (checkDuplicate(operandList, value)) {
            operand2 = Math.floor(Math.random() * 99) + 1;
            key = "".concat(operand1, " ").concat(operator, " ").concat(operand2);
            value = calculate(operand1, operator, operand2);
        }
        operandList.push((_a = {}, _a[key] = value, _a));
    }
    return operandList;
}
function printText(ctx, i, j) {
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    if (j === 0) {
        ctx.fillText(Object.keys(opList[i])[0].toString(), rectangles[2 * i].x + w / 2 - 60, rectangles[2 * i].y + 60);
    }
    else {
        ctx.fillText(Object.values(opList[randomizedIndexes[i]])[0].toString(), rectangles[2 * i + 1].x +
            w / 2 -
            Object.keys(opList[i])[0].toString().length * 10, rectangles[2 * i + 1].y + 60);
        console.log(Object.keys(opList[i])[0]);
    }
}
function printAllText(ctx) {
    for (var i = 0; i < number; i++) {
        for (var j = 0; j < 2; j++) {
            printText(ctx, i, j);
        }
    }
}
function redrawRectangles(ctx, rectangle, color) {
    ctx.fillStyle = color;
    ctx.clearRect(rectangle.x - 10, rectangle.y - 10, w + 20, h + 20);
    ctx.fill(rectangle.path);
}
function colorSelected(canvas) {
    var ctx = canvas.getContext("2d");
    var rectangleLeft = rectangles[selectedIndex[0]];
    var rectangleRight = rectangles[selectedIndex[1]];
    rectangleRight.chosenIndex = selectedIndex[0], rectangleLeft.chosenIndex = selectedIndex[1];
    selectedIndex = [-1, -1];
    var startX = rectangleLeft.x + w;
    var startY = rectangleLeft.y + h / 2;
    var endX = rectangleRight.x;
    var endY = rectangleRight.y + h / 2;
    ctx.lineWidth = 3;
    redrawRectangles(ctx, rectangleLeft, color3);
    redrawRectangles(ctx, rectangleRight, color3);
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
}
function revealScore(canvas) {
    var ctx = canvas.getContext("2d");
    var score = 0;
    var indexedArray = Array.from({ length: number }, function (_, index) { return randomizedIndexes.indexOf(index); });
    for (var i = 0; i < number; i++) {
        if (Number(indexedArray[i]) ===
            Number(rectangles[i * 2].chosenIndex - 1) / 2) {
            score++;
            ctx.fillStyle = color4;
        }
        else {
            ctx.fillStyle = color5;
        }
        ctx.fillRect(rectangles[i * 2].x, rectangles[i * 2].y, w, h);
        ctx.fillRect(rectangles[rectangles[i * 2].chosenIndex].x, rectangles[rectangles[i * 2].chosenIndex].y, w, h);
    }
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: ".concat(score, " / ").concat(number), canvas.width / 2 - 50, rectangles[2 * number - 1].y + h + 50);
    printAllText(ctx);
}
function draw(canvas) {
    var ctx = canvas.getContext("2d");
    for (var i = 0; i < number; i++) {
        if (i % 2) {
            ctx.fillStyle = color2;
        }
        else {
            ctx.fillStyle = color1;
        }
        ctx.fill(rectangles[2 * i].path);
        ctx.fill(rectangles[2 * i + 1].path);
    }
    printAllText(ctx);
}
function onSubmit(event) {
    event.preventDefault();
    var form = document.getElementById("Game");
    var canvas = document.getElementById("canvas");
    if (!game) {
        var inputs = Array.from(form.querySelectorAll('input[class="input"]'));
        inputs.forEach(function (input) {
            input.disabled = true;
        });
        document.getElementById("submit").innerHTML =
            "Restart Game";
        number = parseInt(document.getElementById("number").value, 10);
        opList = createOperandList();
        randomizedIndexes = Array.from({ length: number }, function (_, index) { return index; }).sort(function () { return Math.random() - 0.5; });
        var rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = 130 * number;
        updateRectangles(canvas);
        draw(canvas);
    }
    else {
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var inputs = Array.from(form.querySelectorAll('input[class="input"]'));
        inputs.forEach(function (input) {
            input.disabled = false;
        });
        init();
        document.getElementById("submit").innerHTML =
            "Start Game";
    }
    game = !game;
}
window.onload = function () {
    document.getElementById("Game").addEventListener("submit", onSubmit);
    var canvas = document.getElementById("canvas");
    canvas.addEventListener("click", function (event) {
        var ctx = canvas.getContext("2d");
        rectangles.forEach(function (rectangle) {
            if (ctx.isPointInPath(rectangle.path, event.offsetX, event.offsetY) &&
                rectangle.chosenIndex === -1) {
                var i = rectangle.index % 2;
                var j = Math.floor(rectangle.index / 2);
                var color = j % 2 === 0 ? color1 : color2;
                ctx.fillStyle = color;
                if (selected[i] && selectedIndex[i] === rectangle.index) {
                    selected[i] = false;
                    selectedIndex[i] = -1;
                    redrawRectangles(ctx, rectangle, color);
                    printText(ctx, Math.floor(rectangle.index / 2), i);
                }
                else if (selectedIndex[i] !== -1) {
                    selected[i] = true;
                    redrawRectangles(ctx, rectangles[selectedIndex[i]], Math.floor(selectedIndex[i] / 2) % 2 === 0
                        ? color1
                        : color2);
                    printText(ctx, Math.floor(selectedIndex[i] / 2), i);
                    selectedIndex[i] = rectangle.index;
                    ctx.lineWidth = 3;
                    ctx.fillStyle = "black";
                    ctx.stroke(rectangle.path);
                }
                else {
                    selected[i] = true;
                    selectedIndex[i] = rectangle.index;
                    ctx.lineWidth = 3;
                    ctx.fillStyle = "black";
                    ctx.stroke(rectangle.path);
                }
                if (selected[0] === true && selected[1] === true) {
                    colorSelected(canvas);
                    allSelected++;
                    selected = [false, false];
                }
                if (allSelected === number) {
                    revealScore(canvas);
                }
            }
        });
    });
};
