const coordinateSystem = new PhysicsObject(0, 0, 0, 0, 0)

var dragStartX = NaN;
var dragStartY = NaN;
var cameraDragStartX = NaN;
var cameraDragStartY = NaN;
var drag = false;
var cameraDrag = false
var mouseX = 0;
var mouseY = 0;
var graphicsFrame = 0
var physicsTick = 0;
var fps = 0;
var tps = 0;
var targetFps = 250;
var targetTps = 100000;
var stepPerCall = 1;
var frameCounter = 0;
var tickCounter = 0;
var lastFpsUpdate = 0;
var lastTpsUpdate = 0;
var showGrid = false;
var visualizeForce = false;
var gridSize = 1000;
var paused = false;

const canvas = document.getElementById("gravity");
const canvasCtx = canvas.getContext("2d");
var cameraMode = "followObject";
var followedObject = 0;
var cameraX = 0;
var cameraY = 0;
var cameraOffsetX = 0;
var cameraOffsetY = 0;
var prevCameraX = 0;
var prevCameraY = 0;
canvas.width = 1000;
canvas.height = 1000;
var scale = 4;
var stepSize = 200*stepPerCall/targetTps;
var orbitCounter = 0;
var secondCounter = 0;

var phObjects = [];
var images = [];

var objectList = document.getElementById("objectList");
var deleteButtons = document.getElementsByClassName("deleteObject");
for (var i = 0; i<deleteButtons.length; i++) {
    var button = deleteButtons[i];
    var id = button.parentNode.parentNode.dataset.id;
    button.onclick = () => {deleteObject(id);};
}

var colors = ["green", "yellow", "magenta", "red", "orange", "blue", "lightblue", "lime"];

//solar system
var sun = new PhysicsObject(0, 0, 0, 0, 330000, "Sun", "white");
var earth = new PhysicsObject(1000, 1500, 4, -3, 1, "Earth", "lime");
var moon = new PhysicsObject(1000, 1510, 3.89, -3.02, 0.1, "Moon", "red");
var mars = new PhysicsObject(0, 1000, 6, 0, 0.1, "Mars", "gray")
var earthImage = generateCircleImage(5, "green", canvas);
var sunImage = generateCircleImage(300, "yellow", canvas);
var marsImage = generateCircleImage(80, "red", canvas);
var moonImage = generateCircleImage(2, "gray", canvas);
earth.traceOrbit = true;
earth.orbitRelativeTo = sun.id;
moon.traceOrbit = true;
moon.orbitRelativeTo = earth.id;
mars.orbitRelativeTo = sun.id;
var solarSystem = [earth, moon, mars, sun];
var solarSystemImages = [earthImage, moonImage, marsImage, sunImage];

phObjects = solarSystem;
images = solarSystemImages;

setInterval(updateCanvas, Math.round(1000/targetFps));
setInterval(updatePhysics, 5);
setInterval(() => orbitCounter++, 10);
setInterval(() => secondCounter++, 1000);
refreshObjectList();
canvas.addEventListener("mousedown", canvasMouseDownEventHandler);
canvas.addEventListener("mouseup", mouseUpEventHandler);
canvas.addEventListener("mousemove", onMouseMove);
canvas.addEventListener("wheel", wheelEventListener);
document.getElementById("cameraSelection").addEventListener("change", cameraModeChangeEventHandler);
document.getElementById("objectFollowSelect").addEventListener("change", objectFollowSelectChangeEventHandler);
document.getElementById("pauseCheckbox").addEventListener("change", (event) => paused = event.target.checked);
document.getElementById("gridCheckbox").addEventListener("change", (event) => showGrid = event.target.checked);
document.getElementById("forcesCheckbox").addEventListener("change", (event) => visualizeForce = event.target.checked);
document.getElementById("speedSlider").addEventListener("change", (event) => {stepPerCall = event.target.value; document.getElementById("speedInput").value=event.target.value;});
document.getElementById("speedInput").addEventListener("change", (event) => {stepPerCall = event.target.value; document.getElementById("speedSlider").value=event.target.value;})
document.getElementById("tpsSlider").addEventListener("change", (event) => {targetTps = event.target.value; document.getElementById("tpsInput").value=event.target.value;});
document.getElementById("tpsInput").addEventListener("change", (event) => {targetTps = event.target.value; document.getElementById("tpsSlider").value=event.target.value;})

function updateCanvas() {
    canvas.width = parseInt(canvas.offsetWidth);
    canvas.height = parseInt(canvas.offsetHeight);
    if (cameraMode == "followObject" || cameraMode == "relative") {
        cameraX = phObjects[followedObject].x;
        cameraY = phObjects[followedObject].y;
    }
    if (cameraMode == "relative") {
        cameraX += cameraOffsetX;
        cameraY += cameraOffsetY;
    }
    if (showGrid) {
        var left = canCoordinateToPhysicsCoordinate(0, 0,)[0];
        left = Math.round(left) - Math.round(left)%Math.round(gridSize*scale/5);
        var top = canCoordinateToPhysicsCoordinate(0, 0)[1];
        top = Math.round(top) - Math.round(top)%Math.round(gridSize*scale/5);
        var right = canCoordinateToPhysicsCoordinate(canvas.width, 0)[0];
        var bottom = canCoordinateToPhysicsCoordinate(0, canvas.height)[1];
        for (var column=left; column<right; column += gridSize*scale/5) {
            canvasCtx.lineWidth = 2;
            canvasCtx.strokeStyle = "gray";
            canvasCtx.beginPath();
            canvasCtx.moveTo(PhysicsCoordinateToCanCoordinate(column, 0)[0], 0);
            canvasCtx.lineTo(PhysicsCoordinateToCanCoordinate(column, 0)[0], canvas.height);
            canvasCtx.stroke();
            canvasCtx.closePath();
        }
        for (var row=top; row<bottom; row += gridSize*scale/5) {
            // if (row%Math.round(gridSize*scale/5) == 0) {
            canvasCtx.lineWidth = 2;
            canvasCtx.strokeStyle = "gray";
            canvasCtx.beginPath();
            canvasCtx.moveTo(0, PhysicsCoordinateToCanCoordinate(0, row)[1]);
            canvasCtx.lineTo(canvas.width, PhysicsCoordinateToCanCoordinate(0, row)[1]);
            canvasCtx.stroke();
            canvasCtx.closePath();
            // }
        }
    }
    for (var j = 0; j < phObjects.length; j++) {
        var phObject = phObjects[j];
        if (phObject.orbitPoints.length > 0) {
            canvasCtx.strokeStyle = phObject.orbitColor;
            for (var i = 1; i<phObject.orbitPoints.length; i++) {
                if (isCoordinateInFrame(getObjectById(phObject.orbitRelativeTo).x - phObject.orbitPoints[i-1][0], getObjectById(phObject.orbitRelativeTo).y - phObject.orbitPoints[i-1][1], 0) || isCoordinateInFrame(getObjectById(phObject.orbitRelativeTo).x - phObject.orbitPoints[i][0], getObjectById(phObject.orbitRelativeTo).y - phObject.orbitPoints[i][1], 0)) {
                    canvasCtx.beginPath();
                    var startX = PhysicsCoordinateToCanCoordinate(getObjectById(phObject.orbitRelativeTo).x - phObject.orbitPoints[i-1][0], 0)[0];
                    var startY = PhysicsCoordinateToCanCoordinate(0, getObjectById(phObject.orbitRelativeTo).y - phObject.orbitPoints[i-1][1])[1];
                    canvasCtx.moveTo(startX, startY);
                    var point = PhysicsCoordinateToCanCoordinate(getObjectById(phObject.orbitRelativeTo).x - phObject.orbitPoints[i][0], getObjectById(phObject.orbitRelativeTo).y - phObject.orbitPoints[i][1]);
                    canvasCtx.lineTo(point[0], point[1]);
                    canvasCtx.stroke();
                    canvasCtx.closePath();
                }
            }
        }
    }
    for (var i = 0; i < phObjects.length; i++) {
        var phObject = phObjects[i];
        var rad = (images[i].width/scale)/2;
        if (isCoordinateInFrame(phObject.x, phObject.y, rad)) {
            var canX = PhysicsCoordinateToCanCoordinate(phObject.x, 0)[0];
            var canY = PhysicsCoordinateToCanCoordinate(0, phObject.y)[1];
            canvasCtx.drawImage(images[i], canX - rad, canY - rad, rad*2, rad*2);
        }
    }
    if (visualizeForce) {
        for (var i = 0; i < phObjects.length; i++) {
            var phObject = phObjects[i];
            var phData = phObject.phData;
            canvasCtx.beginPath();
            canvasCtx.strokeStyle = "magenta";
            var [x, y] = PhysicsCoordinateToCanCoordinate(phObject.x, phObject.y);
            var xOffset = (Math.cos(phData.angle) * -phData.force * 10000000)/targetTps;
            var yOffset = (Math.sin(phData.angle) * -phData.force * 10000000)/targetTps;
            var [x2, y2] = PhysicsCoordinateToCanCoordinate(phObject.x + xOffset, phObject.y + yOffset);
            canvasCtx.moveTo(x, y);
            canvasCtx.lineTo(x2, y2);
            canvasCtx.stroke();
            canvasCtx.closePath();
        }
    }
    if (drag) {
        canvasCtx.strokeStyle = "white";
        canvasCtx.beginPath();
        var canCoord = PhysicsCoordinateToCanCoordinate(dragStartX, dragStartY);
        canvasCtx.moveTo(canCoord[0], canCoord[1]);
        canvasCtx.lineTo(mouseX, mouseY);
        canvasCtx.stroke();
        canvasCtx.closePath();
    }
    graphicsFrame++;
    frameCounter++;
    if (secondCounter > lastFpsUpdate) {
        fps = frameCounter;
        frameCounter = 0;
        lastFpsUpdate = secondCounter;
        document.getElementById("fps").innerHTML = `FPS: ${fps}`;
    }
    document.getElementById("frames").innerHTML = `Frame: ${graphicsFrame}`;
}

function updatePhysics() {
    if (!paused) {
        stepSize = 200*stepPerCall/targetTps;
        for (var _ = 0; _<Math.round(stepPerCall/stepSize); _++) {
            for (var i = 0; i < phObjects.length; i++) {
                var phObject = phObjects[i];
                if (_ == 0) {
                    phObject.phData.reset();
                }
                for (var j = 0; j < phObjects.length; j++) {
                    if (j == i) {
                        continue;
                    }
                    var phObject2 = phObjects[j];
                    var phData = Physics.applyGravity(phObject, phObject2, stepSize);
                    phObject2.phData.add(phData);
                }
                phObject.applyVelocity(stepSize);
                if (phObject.traceOrbit && orbitCounter % phObject.traceQuality == 0 && _ == 0) {
                    if (!phObject.orbitPoints.length < 1) {
                        if (!(phObject.orbitPoints[phObject.orbitPoints.length-1][0] == phObject.x) && !(phObject.orbitPoints[phObject.orbitPoints.length-1][1] == phObject.y)) {
                            phObject.orbitPoints.push([getObjectById(phObject.orbitRelativeTo).x - phObject.x, getObjectById(phObject.orbitRelativeTo).y - phObject.y]);
                        }
                    }
                    else {
                        phObject.orbitPoints.push([getObjectById(phObject.orbitRelativeTo).x - phObject.x, getObjectById(phObject.orbitRelativeTo).y - phObject.y]);
                    }
                }
                else if (!phObject.traceOrbit) {
                    if (phObject.orbitPoints.length > 0) {
                        phObject.orbitPoints = [];
                    }
                }
            }
            physicsTick++;
            tickCounter++;
        }
    }
    if (secondCounter > lastTpsUpdate) {
        tps = tickCounter;
        tickCounter = 0;
        lastTpsUpdate = secondCounter;
        document.getElementById("tps").innerHTML = `TPS: ${tps}; ${stepSize}`;
    }
    document.getElementById("ticks").innerHTML = `Tick: ${physicsTick}`;
}

function canvasMouseDownEventHandler(event) {
    if (event.button == 0) {
        dragStartX = canCoordinateToPhysicsCoordinate(event.offsetX, 0)[0];
        dragStartY = canCoordinateToPhysicsCoordinate(0, event.offsetY)[1];
        drag = true;
    }
    else if (cameraMode == "static") {
        cameraDragStartX = event.offsetX;
        cameraDragStartY = event.offsetY;
        prevCameraX = cameraX;
        prevCameraY = cameraY;
        cameraDrag = true;
    }
    else if (cameraMode == "relative") {
        cameraDragStartX = event.offsetX;
        cameraDragStartY = event.offsetY;
        prevCameraX = cameraOffsetX;
        prevCameraY = cameraOffsetY;
        cameraDrag = true;
    }
}

function mouseUpEventHandler(event) {
    if (event.button == 0) {
        if (drag) {
            var dragEndX = canCoordinateToPhysicsCoordinate(event.offsetX, 0)[0];
            var dragEndY = canCoordinateToPhysicsCoordinate(0, event.offsetY)[1];
            var xVel = (dragEndX - dragStartX)/50;
            var yVel = (dragEndY - dragStartY)/50;
            phObjects.push(new PhysicsObject(dragStartX, dragStartY, xVel, yVel, document.getElementById("massInput").value, document.getElementById("nameInput").value, colors[Math.round(Math.random()*colors.length)]))
            images.push(generateCircleImage(document.getElementById("radiusInput").value, document.getElementById("colorInput").value, canvas));
            drag = false;
            refreshObjectList();
        }
    }
    else {
        cameraDrag = false;
    }
}

function onMouseMove(event) {
    mouseX = event.offsetX;
    mouseY = event.offsetY;
    if (cameraDrag && cameraMode == "static") {
        var distanceX = mouseX - cameraDragStartX;
        var distanceY = mouseY - cameraDragStartY;
        cameraX = prevCameraX - distanceX*scale;
        cameraY = prevCameraY - distanceY*scale;
    }
    else if (cameraDrag && cameraMode == "relative") {
        var distanceX = mouseX - cameraDragStartX;
        var distanceY = mouseY - cameraDragStartY;
        cameraOffsetX = prevCameraX - distanceX*scale;
        cameraOffsetY = prevCameraY - distanceY*scale;
    }
}

function wheelEventListener(event) {
    scale += (event.deltaY*scale/3)/200;
    if (scale < 0.1) {
        scale = 0.1;
    }
}

function generateCircleImage(radius, color, canvas) {
    var data = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"> <g> <circle style="fill:${color};" cx="50" cy="50" r="50" /></g></svg>`
    var DOMURL = window.URL || window.webkitURL || window;
    var img = new Image();
    var svg = new Blob([data], {type: 'image/svg+xml'});
    var url = DOMURL.createObjectURL(svg);
    img.src = url;
    img.width = radius * 2;
    return img;
}

function canCoordinateToPhysicsCoordinate(canX, canY) {
    var phX = -(canvas.width * scale)/2 + canX * scale + cameraX;
    var phY = -(canvas.height * scale)/2 + canY * scale + cameraY;
    return [phX, phY];
}

function PhysicsCoordinateToCanCoordinate(phX, phY) {
    var canX = phX/scale + canvas.width/2 - cameraX/scale;
    var canY = phY/scale + canvas.height/2 - cameraY/scale;
    return [canX, canY];
}

function deleteObject(id) {
    var index = phObjects.indexOf(phObjects.filter(obj => obj.id == id)[0]);
    if (index > -1) {
        phObjects.splice(index, 1);
        images.splice(index, 1);
    }
    for (var i = 0; i<phObjects.length; i++) {
        if (phObjects[i].orbitRelativeTo == id) {
            phObjects[i].orbitRelativeTo = "coordinate system";
            phObjects[i].orbitPoints = [];
        }
    }
    refreshObjectList();
}

function expand(id) {
    var menu = document.getElementById(`expand-${id}`);
    var expButton = document.getElementById(`expandButton-${id}`)
    if (menu.style.display != "block") {
        menu.style.display = "block";
        expButton.innerHTML = "▼";
    }
    else {
        menu.style.display = "none";
        expButton.innerHTML = "◀";
    }
}

function changeOrbitTrace(event, id) {
    var obj = getObjectById(id);
    obj.traceOrbit = event.target.checked;
}

function changeOrbitQuality(event, id) {
    var obj = getObjectById(id);
    obj.traceQuality = event.target.value;

function refreshObjectList() {
    objectList.innerHTML = "All Objects:";
    var objectSelections = document.getElementsByClassName("objectSelection");
    for (var i = 0; i<phObjects.length; i++) {
        objectList.innerHTML += generateObjectCard(phObjects[i]);
    }
    for (var j = 0; j<objectSelections.length; j++) {
        var selectElement = objectSelections[j]
        var prevVal = selectElement.value;
        selectElement.innerHTML = "";
        if (selectElement.classList.contains("orbitRelativeSelection")) {
            selectElement.innerHTML += `<option value="coordinate system">Coordinate System</option>`
        }
        for (var i = 0; i<phObjects.length; i++) {
            selectElement.innerHTML += `<option value="${phObjects[i].id}">${phObjects[i].name}</option>`
        }
        for (var i = 0; i<selectElement.length; i++) {
            if (selectElement.options[i].value == prevVal) {
                selectElement.value = prevVal;
                break;
            }
        }
        selectElement.dispatchEvent(new Event("change"));
    }
    if (phObjects.length < 1) {
        document.getElementById("cameraSelection").value = "static";
        followedObject = 0;
    }
    document.getElementById("cameraSelection").dispatchEvent(new Event("change"));
}

function generateObjectCard(obj) {
    return `
    <div class="object" data-id="${obj.id}" id="object-${obj.id}">
        <span class="objectName" onclick="expand('${obj.id}')">${obj.name}</span>
        <span class="objectButtons">
            <span title="Delete" class="deleteObject" onclick="deleteObject('${obj.id}');">X</span>
            <span title="Expand" class="expandObject" onclick="expand('${obj.id}')" id="expandButton-${obj.id}">◀</span>
        </span>
        <div class="expandedMenu" id="expand-${obj.id}">
            <span></span>
            <input type="checkbox" id="trace-${obj.id}" onchange="changeOrbitTrace(event, '${obj.id}');" ${obj.traceOrbit ? "checked" : ""}/>
            Trace Orbit <span style="opacity: 0.5;">(High performance impact)</span>
            <br/>
            <span>Orbit relative to:</span><br/>
            <select class="objectSelection orbitRelativeSelection" id="orbitRelative-${obj.id}" onchange="setOrbitRelative('${obj.id}');">
                <option value="${obj.orbitRelativeTo}"></option>
            </select>
            <br/>
            <span>Trace period:</span><br/>
            <input type="range" id="quality-${obj.id}" onchange="changeOrbitQuality(event, '${obj.id}');" value=${obj.traceQuality} min=1 max=1000 step=1/>
        </div>
    </div>`;
}

function setOrbitRelative(id) {
    var obj = getObjectById(id);
    var prevVal = obj.orbitRelativeTo;
    obj.orbitRelativeTo = document.getElementById(`orbitRelative-${id}`).value;
    if (obj.orbitRelativeTo != prevVal) {
        obj.orbitPoints = [];
    }
}

function getObjectById(id) {
    if (id.toLowerCase() == "coordinate system") {
        return coordinateSystem;
    }
    return phObjects[phObjects.indexOf(phObjects.filter(obj => obj.id == id)[0])];
}

function cameraModeChangeEventHandler(event) {
    var followObjectSettings = document.getElementById("followObjectSettings");
    if (document.getElementById("objectFollowSelect").length < 1) {
        event.target.value = "static";
    }
    cameraMode = event.target.value;
    if (cameraMode == "followObject") {
        followObjectSettings.style.display = "block";
    }
    else if (cameraMode == "relative") {
        followObjectSettings.style.display = "block";
    }
    else {
        followObjectSettings.style.display = "none";
    }
}

function objectFollowSelectChangeEventHandler(event) {
    var prevVal = followedObject;
    followedObject = phObjects.indexOf(getObjectById(event.target.value));
    if (followedObject != prevVal) {
        cameraOffsetX = 0;
        cameraOffsetY = 0;
    }
}

function isCoordinateInFrame(x, y, margin) {
    var canCoord = PhysicsCoordinateToCanCoordinate(x, y);
    var canX = canCoord[0];
    var canY = canCoord[1];
    if (canX < 0-margin) {
        return false;
    }
    if (canY < 0-margin) {
        return false;
    }
    if (canX > canvas.width + margin) {
        return false;
    }
    if (canY > canvas.height + margin) {
        return false;
    }
    return true;
}