let elements2 = document.getElementsByClassName("movableDiv");

for (i = 0; i<elements2.length; i++) {
    let elem = elements2[i];
    rotateElement(elem);
}

function rotateElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0; previousMouseX = 0; previousMouseY = 0;
  if (document.getElementById(elmnt.id + "RotatePoint")) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById(elmnt.id + "RotatePoint").onmousedown = rotateMouseDown;
  }

  function rotateMouseDown(e) {
    e.preventDefault();
    previousMouseX = e.clientX;
    previousMouseY = e.clientY;
    document.onmouseup = closeRotateElement;
    document.onmousemove = elementRotate;
  }

  function elementRotate(e) {
    e.preventDefault();
    centerX = elmnt.offsetLeft + elmnt.offsetWidth / 2;
    centerY = elmnt.offsetTop + elmnt.offsetHeight / 2;
    // previousAngle = Math.atan((previousMouseY - centerY)/(previousMouseX - centerX)) * (180/Math.PI);
    // currentAngle = Math.atan((e.clientY - centerY)/(e.clientX - centerX)) * (180/Math.PI);
    previousAngle = Math.atan2((previousMouseY - centerY), (previousMouseX - centerX)) * (180/Math.PI);
    currentAngle = Math.atan2((e.clientY - centerY), (e.clientX - centerX)) * (180/Math.PI);
    angleDifference = currentAngle - previousAngle;
    elmnt.style.transform = "rotate(" + (getRotationAngle(elmnt) + angleDifference) + "deg)";
    previousMouseX = e.clientX;
    previousMouseY = e.clientY;
  }

  function closeRotateElement(e) {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
function getRotationAngle(target) 
{
  const obj = window.getComputedStyle(target, null);
  const matrix = obj.getPropertyValue('-webkit-transform') || 
    obj.getPropertyValue('-moz-transform') ||
    obj.getPropertyValue('-ms-transform') ||
    obj.getPropertyValue('-o-transform') ||
    obj.getPropertyValue('transform');

  let angle = 0; 

  if (matrix !== 'none') 
  {
    const values = matrix.split('(')[1].split(')')[0].split(',');
    const a = values[0];
    const b = values[1];
    angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
  } 

  return (angle < 0) ? angle +=360 : angle;
}