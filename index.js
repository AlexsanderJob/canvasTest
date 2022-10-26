const btn = document.getElementById("delete");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
let arrLines = [];
let newLineFrom;
let newLineTo;
let myRequestId;

canvas.width = 1350;
canvas.height = 500;
ctx.strokeStyle = 'black';

canvas.addEventListener("mousemove", function (e) {

    if (newLineFrom) {
        newLineTo = {
            x: e.movementX,
            y: e.movementY
        }
        if (newLineTo) {
            ctx.clearRect(newLineTo.x, newLineTo.y, canvas.width, canvas.height);
            for (const {from, to} of arrLines) {
                ctx.beginPath();
                ctx.moveTo(from.x, from.y);
                ctx.lineTo(to.x, to.y);
                ctx.stroke();
                ctx.closePath();
            }
            ctx.beginPath();
            ctx.moveTo(newLineFrom.x, newLineFrom.y);
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
            const test = [...arrLines, { from: newLineFrom, to: {
                    x: e.offsetX,
                    y: e.offsetY
                } }]
            for (const index in test) {
                const item = test[+index];
                for (const ind in test) {
                    const itemTo = test[+ind];
                    if (index !== ind) {
                        checkLineIntersection(item.from.x, item.from.y, item.to.x, item.to.y, itemTo.from.x, itemTo.from.y, itemTo.to.x, itemTo.to.y);
                    }
                }
            }
        }
    }
})


canvas.onclick = function (e) {
    if (newLineFrom) {
        arrLines.push({
            from: newLineFrom,
            to: {
                x: e.offsetX,
                y: e.offsetY
            }
        })
        newLineFrom = null;
        newLineTo = null;
        return;
    }
    newLineFrom = {
        x: e.offsetX,
        y: e.offsetY
    }
}

function checkLineIntersection(line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {
    let denominator, a, b, numerator1, numerator2, result = {
        x: null,
        y: null
    };
    denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
    if (denominator === 0) {
        return result;
    }
    a = line1StartY - line2StartY;
    b = line1StartX - line2StartX;
    numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
    numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
    a = numerator1 / denominator;
    b = numerator2 / denominator;
    result.x = line1StartX + (a * (line1EndX - line1StartX));
    result.y = line1StartY + (a * (line1EndY - line1StartY));
    if (!(b > 0 && b < 1) || !(a > 0 && a < 1)) {
        return;
    }
    ctx.beginPath();
    ctx.fillStyle = 'red';
    ctx.arc(Math.round(result.x), Math.round(result.y), 5, 0 * Math.PI, 2 * Math.PI);
    ctx.fill();
}
let v = 0;
function hideLine () {
    for (let { from, to } of arrLines) {
        let grad = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
        grad.addColorStop(0 + v, 'white');
        grad.addColorStop(0.5, 'black');
        grad.addColorStop(1 - v, 'white');
        ctx.strokeStyle = grad;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
    }
    v = v + 0.01;
    if (v >= 0.5) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'black';
        v = 0;
        arrLines = [];
        cancelAnimationFrame(myRequestId);
        btn.disabled = false;
        return;
    }
    myRequestId = requestAnimationFrame(hideLine);
}

btn.addEventListener("click", function (e) {
    e.preventDefault();
    btn.disabled = true;
    hideLine();
});