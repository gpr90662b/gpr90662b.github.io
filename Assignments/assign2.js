"use strict";
var canvas;
var gl;
var rect;
var points = [];
var triangles =[];
var lineWidth = 0;
var index = 0;
var tindex = 0;
var DOWN = false;
var UP = true;
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

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    //  Configure WebGL
    //
    gl.viewport(0, 0, canvas.width, canvas.height);
    //gl.clear(gl.COLOR_BUFFER_BIT);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);


// set up vertex buffer
    vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, MAX_BUFF_SIZE, gl.STATIC_DRAW);

    //  Load shaders and initialize attribute buffers
     program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    gl.uniform2fv(gl.getUniformLocation(program, "vSize"), vec2(canvas.width-1, canvas.height-1));

    vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // listeners
    var s1 = document.getElementById("slider1");
    s1.addEventListener("change", redHandler, false);
    
    var s2 = document.getElementById("slider2");
    s2.addEventListener("change", greenHandler, false);
    
    var s3 = document.getElementById("slider3");
    s3.addEventListener("change", blueHandler, false);
    
    var s4 = document.getElementById("slider4");
    s4.addEventListener("change", lineWidthHandler, false);
    

    canvas.addEventListener("mousedown", downHandler, false);
    canvas.addEventListener("mousemove", moveHandler, false);
    canvas.addEventListener("mouseup", upHandler, false);

} // init  


function downHandler(e) {
    DOWN = true;
    UP = false;
    //var t = vec2(-1 + 2 * (e.clientX - rect.left) / (canvas.width-1), -1 + 2 * (canvas.height - (e.clientY - rect.top)) / (canvas.height-1));
    var t = vec2((e.clientX - rect.left), (canvas.height - (e.clientY - rect.top)));
    points[index++] = t;
    console.log("mouse down");
}


function moveHandler(e) {
    if (DOWN) {
        //var t = vec2(-1 + 2 * (e.clientX - rect.left) / canvas.width, -1 + 2 * (canvas.height - (e.clientY - rect.top)) / canvas.height);
        var t = vec2((e.clientX - rect.left), (canvas.height - (e.clientY - rect.top)));
        points[index++] = t;
        
       
         gl.uniform4fv( gl.getUniformLocation(program, "fColor"), vec4(red, green, blue, 1.0));
         
         //gl.clear(gl.COLOR_BUFFER_BIT);
         gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        if ( lineWidth > 1 ) {
            genTriangles();
            //console.log(index, tindex);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(triangles));
            gl.drawArrays(gl.TRIANGLES, 0, tindex);       
        }
         else { 
               gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(points));
                gl.drawArrays(gl.LINE_STRIP, 0, index);
         }

    }
}

function upHandler(e) {
    console.log("mouse is up");
    UP = true;
    DOWN = false;
    index = 0;
    
}

function genTriangles() {
     //console.log("Generating Triangles");
     tindex = 0;
     triangles = [];
        var v, perpv, c1, c2, c3, c4, p1, p2;
        for ( var i =0; i < index - 1; i++ ) {
        
        v = normalize( subtract(points[i+1],points[i]));          

        perpv = vec2(-v[1], v[0]);
            perpv = scale(lineWidth / 2,perpv);

            c1 = subtract( points[i],perpv);
            c2 = add(points[i],perpv);
            c3 = subtract(points[i+1], perpv);
            c4 = add(points[i+1], perpv);      
            
            triangles.push (c2,c1,c3);
            triangles.push(c3,c4,c2);
            tindex += 6;
   
        }
    }

function redHandler(e) {
    red =  e.target.value / 255.0;
}

function greenHandler(e) {
    green = e.target.value  / 255.0;
}

function blueHandler(e) {
    blue =  e.target.value / 255.0;
}

function lineWidthHandler(e) {
    lineWidth =  e.target.value;

}

window.onload = init;