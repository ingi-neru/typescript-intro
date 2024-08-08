let game = false;
type Rectangle = {
    path: Path2D;
    index: number;
    chosenIndex: number;
    x: number;
    y: number;
};
type Answers = {
    [key: string]: number;
};
let rectangles: Rectangle[] = [];
const w = 300;
const h = 100;
let opList: Answers[] = [];
let number: number;
let numberFromCanvas: string;
let randomizedIndexes: number[] = [];
const color1 = "#93C572";
const color2 = "#8A9A5B";
const color3 = "#008080";
const color4 = "green";
const color5 = "red";
let selected = [false, false];
let selectedIndex = [0, 0];
let allSelected = 0;

function init() {
    rectangles = [];
    opList = [];
    number = 0;
    randomizedIndexes = [];
    selected = [false, false];
    selectedIndex = [-1, -1];
    allSelected = 0;
}

function updateRectangles(canvas: HTMLCanvasElement) {
    for (let i = 0; i < number; i++) {
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
        rectangles[2 * i + 1].path.rect(
            canvas.width * (3 / 4) - w,
            i * (h + 10),
            w,
            h,
        );
    }
}

function getSelectedOperators() {
    const addition = (document.getElementById("addition") as HTMLInputElement)
        .checked;
    const subtraction = (
        document.getElementById("subtraction") as HTMLInputElement
    ).checked;
    const multiplication = (
        document.getElementById("multiplication") as HTMLInputElement
    ).checked;
    const division = (document.getElementById("division") as HTMLInputElement)
        .checked;

    return {
        addition,
        subtraction,
        multiplication,
        division,
    };
}

function calculate(operand1: number, operator: String, operand2: number) {
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

function checkDuplicate(operandList: Answers[], value: number) {
    for (let i = 0; i < operandList.length; i++) {
        if (Object.values(operandList[i])[0] === value) {
            return true;
        }
    }
    return false;
}

function createOperandList() {
    const {
        addition: a,
        subtraction: s,
        multiplication: m,
        division: d,
    } = getSelectedOperators();
    const operators: String[] = [];
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
    const operandList: Answers[] = [];
    for (let i = 0; i < number; i++) {
        const operator =
            operators[Math.floor(Math.random() * operators.length)];
        const operand1 = Math.floor(Math.random() * 99) + 1;
        let operand2 = Math.floor(Math.random() * 99) + 1;
        let key = `${operand1} ${operator} ${operand2}`;
        let value = calculate(operand1, operator, operand2);

        while (checkDuplicate(operandList, value)) {
            operand2 = Math.floor(Math.random() * 99) + 1;
            key = `${operand1} ${operator} ${operand2}`;
            value = calculate(operand1, operator, operand2);
        }

        operandList.push({ [key]: value });
    }
    return operandList;
}

function printText(ctx: CanvasRenderingContext2D, i: number, j: number) {
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    if (j === 0) {
        ctx.fillText(
            Object.keys(opList[i])[0].toString(),
            rectangles[2 * i].x + w / 2 - 60,
            rectangles[2 * i].y + 60,
        );
    } else {
        ctx.fillText(
            Object.values(opList[randomizedIndexes[i]])[0].toString(),
            rectangles[2 * i + 1].x +
                w / 2 -
                Object.keys(opList[i])[0].toString().length * 10,
            rectangles[2 * i + 1].y + 60,
        );
        console.log(Object.keys(opList[i])[0]);
    }
}

function printAllText(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < number; i++) {
        for (let j = 0; j < 2; j++) {
            printText(ctx, i, j);
        }
    }
}

function redrawRectangles(
    ctx: CanvasRenderingContext2D,
    rectangle: Rectangle,
    color: string,
) {
    ctx.fillStyle = color;
    ctx.clearRect(rectangle.x - 10, rectangle.y - 10, w + 20, h + 20);
    ctx.fill(rectangle.path);
}

function colorSelected(canvas: HTMLCanvasElement) {
    const ctx: CanvasRenderingContext2D = canvas.getContext(
        "2d",
    ) as CanvasRenderingContext2D;
    const rectangleLeft = rectangles[selectedIndex[0]];
    const rectangleRight = rectangles[selectedIndex[1]];

    [rectangleRight.chosenIndex, rectangleLeft.chosenIndex] = selectedIndex;
    selectedIndex = [-1, -1];
    const startX = rectangleLeft.x + w;
    const startY = rectangleLeft.y + h / 2;
    const endX = rectangleRight.x;
    const endY = rectangleRight.y + h / 2;
    ctx.lineWidth = 3;
    redrawRectangles(ctx, rectangleLeft, color3);
    redrawRectangles(ctx, rectangleRight, color3);
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
}

function revealScore(canvas: HTMLCanvasElement) {
    const ctx: CanvasRenderingContext2D = canvas.getContext(
        "2d",
    ) as CanvasRenderingContext2D;
    let score = 0;
    const indexedArray: number[] = Array.from(
        { length: number },
        (_, index: number) => randomizedIndexes.indexOf(index),
    );

    for (let i = 0; i < number; i++) {
        if (
            Number(indexedArray[i]) ===
            Number(rectangles[i * 2].chosenIndex - 1) / 2
        ) {
            score++;
            ctx.fillStyle = color4;
        } else {
            ctx.fillStyle = color5;
        }
        ctx.fillRect(rectangles[i * 2].x, rectangles[i * 2].y, w, h);
        ctx.fillRect(
            rectangles[rectangles[i * 2].chosenIndex].x,
            rectangles[rectangles[i * 2].chosenIndex].y,
            w,
            h,
        );
    }
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(
        `Score: ${score} / ${number}`,
        canvas.width / 2 - 50,
        rectangles[2 * number - 1].y + h + 50,
    );
    printAllText(ctx);
}

function draw(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    for (let i = 0; i < number; i++) {
        if (i % 2) {
            ctx.fillStyle = color2;
        } else {
            ctx.fillStyle = color1;
        }

        ctx.fill(rectangles[2 * i].path);
        ctx.fill(rectangles[2 * i + 1].path);
    }
    printAllText(ctx);
}

function onSubmit(event: Event) {
    event.preventDefault();
    const form = document.getElementById("Game") as HTMLFormElement;
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    if (!game) {
        const inputs: HTMLInputElement[] = Array.from(
            form.querySelectorAll('input[class="input"]'),
        );
        inputs.forEach((input) => {
            input.disabled = true;
        });
        (document.getElementById("submit") as HTMLInputElement).innerHTML =
            "Restart Game";
        number = parseInt(
            (document.getElementById("number") as HTMLInputElement).value,
            10,
        );
        opList = createOperandList();
        randomizedIndexes = Array.from(
            { length: number },
            (_, index) => index,
        ).sort(() => Math.random() - 0.5);
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = 130 * number;
        updateRectangles(canvas);
        draw(canvas);
    } else {
        const ctx: CanvasRenderingContext2D = canvas.getContext(
            "2d",
        ) as CanvasRenderingContext2D;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const inputs: HTMLInputElement[] = Array.from(
            form.querySelectorAll('input[class="input"]'),
        );
        inputs.forEach((input) => {
            input.disabled = false;
        });
        init();
        (document.getElementById("submit") as HTMLInputElement).innerHTML =
            "Start Game";
    }
    game = !game;
}

window.onload = () => {
    (document.getElementById("Game") as HTMLInputElement).addEventListener(
        "submit",
        onSubmit,
    );
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    canvas.addEventListener("click", (event) => {
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        rectangles.forEach((rectangle) => {
            if (
                ctx.isPointInPath(
                    rectangle.path,
                    event.offsetX,
                    event.offsetY,
                ) &&
                rectangle.chosenIndex === -1
            ) {
                const i = rectangle.index % 2;
                const j = Math.floor(rectangle.index / 2);
                const color = j % 2 === 0 ? color1 : color2;
                ctx.fillStyle = color;
                if (selected[i] && selectedIndex[i] === rectangle.index) {
                    selected[i] = false;
                    selectedIndex[i] = -1;
                    redrawRectangles(ctx, rectangle, color);
                    printText(ctx, Math.floor(rectangle.index / 2), i);
                } else if (selectedIndex[i] !== -1) {
                    selected[i] = true;
                    redrawRectangles(
                        ctx,
                        rectangles[selectedIndex[i]],
                        Math.floor(selectedIndex[i] / 2) % 2 === 0
                            ? color1
                            : color2,
                    );
                    printText(ctx, Math.floor(selectedIndex[i] / 2), i);
                    selectedIndex[i] = rectangle.index;
                    ctx.lineWidth = 3;
                    ctx.fillStyle = "black";
                    ctx.stroke(rectangle.path);
                } else {
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
