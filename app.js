const canvas = document.querySelector("canvas");
const tools = document.querySelectorAll(".tool");
const fillColor = document.querySelector("#fill-color");
const slider = document.querySelector("#size");
colorsBTN = document.querySelectorAll(".colors .option");
pickColor = document.querySelector("#color-pick");
clearCanvas = document.querySelector(".clear");
saveImg = document.querySelector(".saveImage");
ctx = canvas.getContext("2d");

// global variables with default value
let preMouseX, preMouseY, snapshot
goDrawing = false,
    selectedTool = "brush",
    brushWidth = 5;
selectedColor = "#000";

const setCanvasBackground = () => {
    ctx.fillStyle = "#fff" // default white color 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor; // brush color selected
}

window.addEventListener("load", () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});

const drawRect = (e) => {
    // if fillColor isn't checked draw a rect with border else draw rect with background
    if (!fillColor.checked) {
        // creating circle according to the mouse pointer
        return ctx.strokeRect(e.offsetX, e.offsetY, preMouseX - e.offsetX, preMouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, preMouseX - e.offsetX, preMouseY - e.offsetY);
}

const drawCircle = (e) => {
    ctx.beginPath();// creating new path for circle to draw
    //  getting radius for circle according to the mouse pointer
    let radius = Math.sqrt(Math.pow((preMouseX - e.offsetX), 2) + Math.pow((preMouseY - e.offsetY), 2));
    ctx.arc(preMouseX, preMouseY, radius, 0, 2 * Math.PI);// creating circle according to the mouse pointer
    fillColor.checked ? ctx.fill() : ctx.stroke();
}

const drawTriangle = (e) => {
    ctx.beginPath();
    ctx.moveTo(preMouseX, preMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo(preMouseX * 2 - e.offsetX, e.offsetY);
    ctx.closePath();
    fillColor.checked ? ctx.fill() : ctx.stroke();
}

// draw line
const drawLine = (e) => {
    ctx.beginPath();
    ctx.moveTo(preMouseX, preMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
}

const funContinue = (e) => {
    goDrawing = true;
    preMouseX = e.offsetX; // passing current mouseY position as prevmouseY position
    preMouseY = e.offsetY; // passing current mousex position as prevmousex position
    ctx.beginPath(); // creating new path to draw
    ctx.lineWidth = brushWidth; // width deciding
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    // copying canvas data & passing as snapshot value.. this avoids dragging the image
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

const drawing = (e) => {
    if (!goDrawing) return;
    ctx.putImageData(snapshot, 0, 0);// adding copied data to this canvas
    if (selectedTool === "brush" || selectedTool === "eraser") {
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    } else if (selectedTool === "rectangle") {
        drawRect(e);
    } else if (selectedTool === "circle") {
        drawCircle(e);
    } else if (selectedTool === "triangle") {
        drawTriangle(e);
    } else if (selectedTool === "line") {
        drawLine(e);
    }
}
tools.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
        console.log(selectedTool);
    })
})

slider.addEventListener("change", () => brushWidth = slider.value);  // slider value as brush width

colorsBTN.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});

pickColor.addEventListener("change", () => {
    // passing picked color value from pallet to color background
    pickColor.parentElement.style.background = pickColor.value;
    pickColor.parentElement.click();
});

clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clearing the whole canvas
    setCanvasBackground();
});

saveImg.addEventListener("click", () => {
    const link = document.createElement("a");// creating a element
    link.download = `CanvasART.jpg`;
    link.href = canvas.toDataURL();//
    link.click(); // clicking link to download image
});

canvas.addEventListener("mousemove", drawing);// if is drawing is false return from here
canvas.addEventListener("mousedown", funContinue);// creste line3 as mouse move
canvas.addEventListener("mouseup", () => goDrawing = false); // draw / filling line with color