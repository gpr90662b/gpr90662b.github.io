"use strict";
var canvas;
var gl;
var rect;
var points = [];
var triangles = [];
var lineWidth = 1;
var index = 0;
var tindex = 0;
var mouseDown = false;
var mouseUp = true;
var mouseInCanvas = false;
var MAX_BUFF_SIZE = 400000;
var red = 1.0,
    green = 0.0,
    blue = 0.0;

var vPosition;
var vBuffer;
var program;


function init() {
    // canvas
    canvas = document.getElementById("gl-canvas");
    rect = canvas.getBoundingClientRect();

    gl = WebGLUtils.setupWebGL(canvas, {
        preserveDrawingBuffer: true
    });
    if (!gl) {
        alert("WebGL isn't available");
    }

    //  Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    //gl.clear(gl.COLOR_BUFFER_BIT);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // set mouseUp vertex buffer
    vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, MAX_BUFF_SIZE, gl.STATIC_DRAW);

    //  Load shaders and initialize attribute buffers
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    gl.uniform2fv(gl.getUniformLocation(program, "vSize"), vec2(canvas.width - 1, canvas.height - 1));

    vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    canvas.addEventListener("mousedown", mouseDownHandler, false);
    canvas.addEventListener("mousemove", moveHandler, false);
    canvas.addEventListener("mouseup", mouseUpHandler, false);
    canvas.addEventListener("mouseout", outHandler, false);
    canvas.addEventListener("mouseover", overHandler, false);

} // init  




function mouseDownHandler(e) {
    console.log("Down");
    mouseDown = true;
    mouseUp = false; 
    index = 0;
    tindex = 0;
    //var t = vec2(-1 + 2 * (e.clientX - rect.left) / (canvas.width-1), -1 + 2 * (canvas.height - (e.clientY - rect.top)) / (canvas.height-1));
    var t = vec2((e.clientX - rect.left), (canvas.height - (e.clientY - rect.top)));
    points[index++] = t;
    
}

function clearCanvas() {
    gl.clear(gl.COLOR_BUFFER_BIT);
}

function moveHandler(e) {
    if (mouseDown && mouseInCanvas) {
        var t = vec2((e.clientX - rect.left), (canvas.height - (e.clientY - rect.top)));
        //console.log(t, index);
        // sample points only when they are at least 3 pixel apart
        if (Math.abs(t[0] - points[index - 1][0]) >= 1 || Math.abs(t[1] - points[index - 1][0]) >= 1) {
            points[index++] = t;
        }
        if (index >= 2) {
            render();
        }
    }
}

function render() {
    //
    gl.uniform4fv(gl.getUniformLocation(program, "fColor"), vec4(red, green, blue, 1.0));
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    if (lineWidth > 1) {
        //genTriangles();
        genTriangles2();
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(triangles));
        gl.drawArrays(gl.TRIANGLES, 0, tindex);
    } else {
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(points));
        gl.drawArrays(gl.LINE_STRIP, 0, index);
    }
}



function mouseUpHandler(e) {
    console.log("Up");
    mouseUp = true;
    mouseDown = false;
    index = 0;
    tindex = 0;
}

function outHandler(e) {
    console.log("out");
    mouseInCanvas = false;
    mouseDown = false;
}

function overHandler(e) {
    mouseInCanvas = true;
   
}


function genTriangles() {
    //console.log("Generating Triangles");
    //console.log(lineWidth);
    tindex = 0;
    triangles = [];
    var v, perpv, c1, c2, c3, c4, p1, p2;

    for (var i = 0; i < index - 1; i++) {

        v = normalize(subtract(points[i + 1], points[i]));
        perpv = vec2(-v[1], v[0]);
        perpv = scale(lineWidth / 2, perpv);

        c1 = subtract(points[i], perpv);
        c2 = add(points[i], perpv);
        c3 = subtract(points[i + 1], perpv);
        c4 = add(points[i + 1], perpv);

        triangles.push(c2, c1, c3);
        triangles.push(c3, c4, c2);
        tindex += 6;

    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
//// beginning of  line/triangle  drawing points
///////////////////////////////////////////////////////////////////////////////////////////////////////
function miterLengths(p0, p1, p2, p3) {

   
    // 1) define the line between the two points
    //Vec2f line = (p2 - p1).normalized();

    // 2) find the normal vector of this line
    //Vec2f normal = Vec2f(-line.y, line.x).normalized();

    var line = normalize(subtract(p2, p1));
    var normal = normalize(vec2(-line[1], line[0]));
   

    // 3) find the tangent vector at both the end points:
    //		-if there are no segments before or after this one, use the line itself
    //		-otherwise, add the two normalized lines and average them by normalizing again
    //Vec2f tangent1 = (p0 == p1) ? line : ((p1-p0).normalized() + line).normalized();
    //Vec2f tangent2 = (p2 == p3) ? line : ((p3-p2).normalized() + line).normalized();

    var tangent1 = equal(p0, p1) ? line : normalize(add(normalize(subtract(p1, p0)), line));
    var tangent2 = equal(p2, p3) ? line : normalize(add(normalize(subtract(p3, p2)), line));


    // 4) find the miter line, which is the normal of the tangent
    //Vec2f miter1 = Vec2f(-tangent1.y, tangent1.x);
    //Vec2f miter2 = Vec2f(-tangent2.y, tangent2.x);

    var miter1 = vec2(-tangent1[1], tangent1[0]);
    var miter2 = vec2(-tangent2[1], tangent2[0]);

    // find length of miter by projecting the miter onto the normal,
    // take the length of the projection, invert it and multiply it by the thickness:
    //		length = thickness * ( 1 / |normal|.|miter| )
    //float length1 = mThickness / normal.dot(miter1);
    //float length2 = mThickness / normal.dot(miter2);

    var length1 = 0.5 * lineWidth / dot(normal, miter1);
    var length2 = 0.5 * lineWidth / dot(normal, miter2);

    var miterObj = {
        m1: miter1,
        l1: length1,
        m2: miter2,
        l2: length2
    };
    return miterObj;

}

function genTriangles2() {
    //  
    tindex = 0;
    triangles = [];
    for (var i = 0; i < index - 1; i++) {

        var p1 = points[i];
        var p2 = points[i + 1];
        if (i == 0) {
            var p0 = points[i];
        } else {
            var p0 = points[i - 1];
        }
        if (i + 1 == index - 1) {
            var p3 = points[i + 1];
        } else {
            var p3 = points[i + 2];
        }
        // Calculate miters
        var m = miterLengths(p0, p1, p2, p3);

        //gl::drawLine( p1 - length1 * miter1, p2 - length2 * miter2 ); bottom points
        //gl::drawLine( p1 + length1 * miter1, p2 + length2 * miter2 ); top points
        //four corners

        var c1 = subtract(points[i], scale(m.l1, m.m1));
        var c2 = add(points[i], scale(m.l1, m.m1));
        var c3 = subtract(points[i + 1], scale(m.l2, m.m2));
        var c4 = add(points[i + 1], scale(m.l2, m.m2));

        triangles.push(c2, c1, c3);
        triangles.push(c3, c4, c2);

        tindex += 6;
    }
}

window.onload = init;