"use strict";
var canvas;
var gl;
var points = [];
var theta = 0;
var thetaLoc;
var numTimesToSubdivide = 0;
var bufferId;
var shape = 0;

var triData = [
    vec2(Math.sin(2.0 * Math.PI / 3.0 * 0), Math.cos(2.0 * Math.PI / 3.0 * 0)),
    vec2(Math.sin(2.0 * Math.PI / 3.0 * 1), Math.cos(2.0 * Math.PI / 3.0 * 1)),
    vec2(Math.sin(2.0 * Math.PI / 3.0 * 2), Math.cos(2.0 * Math.PI / 3.0 * 2))
];

var sqrData = [
    vec2(-0.75, -0.75),
    vec2(0.75, -0.75),
    vec2(0.75, 0.75),
    vec2(-0.75, 0.75)
];

var penData = [
    vec2(0.0, 1.0),
    vec2(-Math.sin(2.0 * Math.PI / 5.0), Math.cos(2.0 * Math.PI / 5.0)),
    vec2(-Math.sin(4.0 * Math.PI / 5.0), -Math.cos(1.0 * Math.PI / 5.0)),
    vec2(Math.sin(4.0 * Math.PI / 5.0), -Math.cos(1.0 * Math.PI / 5.0)),
    vec2(Math.sin(2.0 * Math.PI / 5.0), Math.cos(2.0 * Math.PI / 5.0))
];

function init() {
   
    // define all the event handlers

    var s1 = document.getElementById("slider1");
    s1.addEventListener("change", function() {
        eventHandler1(s1)
    });

    var s2 = document.getElementById("slider2");
    s2.addEventListener("change", function() {
        eventHandler2(s2)
    });
    
    var s3 = document.getElementById("triangle");
    s3.addEventListener("click", triangleHandler, false); 
    
    var s4 = document.getElementById("square");
    s4.addEventListener("click", squareHandler, false); 
    
     var s5 = document.getElementById("pentagon");
    s5.addEventListener("click", pentagonHandler, false); 
    
    // canvas
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    //  Configure WebGL
    //
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    //  Load shaders and initialize attribute buffers

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load the data into the GPU

    bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, 3 * 24 * Math.pow(4, 5), gl.STATIC_DRAW);


    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    thetaLoc = gl.getUniformLocation(program, "theta");
    subDivideTriangle();
    render();

} // init    

function eventHandler1(s1) {
    numTimesToSubdivide = s1.value;
    numTimesToSubdivide = parseInt(numTimesToSubdivide);
    render();
}

function eventHandler2(s2) {
    theta = s2.value;
    theta = theta * Math.PI / 180.0;
    render();
}

function triangleHandler() {
    shape = 0;
    render();
}

function squareHandler() {
    shape = 1;
    render();
}

function pentagonHandler() {
    shape = 2;
    render();
}


function subDivideTriangle() {
    points = [];
    divideTriangle(triData[0], triData[1], triData[2], numTimesToSubdivide);
}

function subDivideSquare() {
    points = [];
    divideTriangle(sqrData[0], sqrData[1], sqrData[2], numTimesToSubdivide);
    divideTriangle(sqrData[0], sqrData[2], sqrData[3], numTimesToSubdivide);

}

function subDividePentagon() {
    points = [];
    divideTriangle(penData[0], penData[1], penData[2], numTimesToSubdivide);
    divideTriangle(penData[0], penData[2], penData[3], numTimesToSubdivide);
    divideTriangle(penData[0], penData[3], penData[4], numTimesToSubdivide);
}



function triangle(a, b, c) {
    points.push(a, b, c);
}

function divideTriangle(a, b, c, count) {
    // check for end of recursion
    if (count === 0) {
        triangle(a, b, c);
    } else {
        //bisect the sides
        var ab = mix(a, b, 0.5);
        var ac = mix(a, c, 0.5);
        var bc = mix(b, c, 0.5);
        --count;
        // four new triangles
        divideTriangle(a, ab, ac, count);
        divideTriangle(c, ac, bc, count);
        divideTriangle(b, bc, ab, count);
        divideTriangle(ac, ab, bc, count);

    }
}

window.onload = init;

function render() {
//
    points = [];
    if (shape == 0) {
        subDivideTriangle();       
    } else if (shape == 1) {
        subDivideSquare();
    } else {
        subDividePentagon();
    }
    
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(points));
    //console.log(numTimesToSubdivide);
    gl.uniform1f(thetaLoc, theta);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, points.length);
    //requestAnimFrame(render);
}