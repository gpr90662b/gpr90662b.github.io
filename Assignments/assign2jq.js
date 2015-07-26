"use strict";
var canvas;
var gl;
var rect;
var points = [];
var triangles =[];
var lineWidth = 1;
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

    gl = WebGLUtils.setupWebGL(canvas, {preserveDrawingBuffer: true});
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

function clearCanvas() { 
    gl.clear(gl.COLOR_BUFFER_BIT);
}

function moveHandler(e) {
    if (DOWN) {
        
     
        var t = vec2((e.clientX - rect.left), (canvas.height - (e.clientY - rect.top)));
        points[index++] = t;
        
       
      
         gl.uniform4fv( gl.getUniformLocation(program, "fColor"), vec4(red, green, blue, 1.0));
         
         
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

 function miterLengths(p0, p1, p2, p3) {
     // 1) define the line between the two points
	//Vec2f line = (p2 - p1).normalized();
    var line =   normalize( subtract(p2,p1));

	// 2) find the normal vector of this line
	//Vec2f normal = Vec2f(-line.y, line.x).normalized();
        var normal =  normalize(vec2(-line[1], line[0]));
        normal = scale(lineWidth / 2, normal);

	// 3) find the tangent vector at both the end points:
	//		-if there are no segments before or after this one, use the line itself
	//		-otherwise, add the two normalized lines and average them by normalizing again
    //Vec2f tangent1 = (p0 == p1) ? line : ((p1-p0).normalized() + line).normalized();
	//Vec2f tangent2 = (p2 == p3) ? line : ((p3-p2).normalized() + line).normalized();	
        var tangent1 = equal(p0,p1) ? line :  normalize(add(normalize(subtract(p1,p0)), line));
        var tangent2 = equal(p2,p3) ? line :  normalize(add(normalize(subtract(p3,p2)), line));

	// 4) find the miter line, which is the normal of the tangent
    //Vec2f miter1 = Vec2f(-tangent1.y, tangent1.x);
	//Vec2f miter2 = Vec2f(-tangent2.y, tangent2.x);
    var miter1 = vec2(-tangent1[1], tangent1[0]);
    var miter2 = vec2(-tangent2[1], tangent2[0]);
    
    // 5) find length of miter by projecting the miter onto the normal,
	// take the length of the projection, invert it and multiply it by the thickness:
	//		length = thickness * ( 1 / |normal|.|miter| )
    var length1 = 0.5 * lineWidth/ dot(normal, miter1);
    var length2 = 0.5 * lineWidth/ dot(normal, miter2);
    
    //create object with 4 values
    var miterObj = { miter1 : miter1, length1:length1, miter2:miter2, length2:length2};
    return miterObj;
    
    }
    
    function genTriangles() {
     //   
        for ( var i =0; i < index - 1; i++ ) {
        //console.log(i);
            var p1 = points[i];
            var p2 = points[i+1]
            if  ( i  == 0 ) {
            var p0 = points[i];
            }
            else {
            var p0 = points[i-1];
            }
            if  ( i+1  == index-1 ) {
            var p3 = points[i+1];
            }
            else {
            var p3 = points[i+2];
            }
            // Calculate miters
            var m = miterLengths(p0,p1,p2,p3);
            //gl::drawLine( p1 - length1 * miter1, p2 - length2 * miter2 ); bottom points
            //gl::drawLine( p1 + length1 * miter1, p2 + length2 * miter2 ); top points
            //four corners         
            var c1 = subtract( points[i], scale(m.length1, m.miter1));
            var c2 = add( points[i], scale(m.length1, m.miter1));
            var c3 = subtract( points[i+1], scale(m.length2, m.miter2));
            var c4 = add( points[i+1], scale(m.length2, m.miter2)); 
            
            // two triangles
            triangles.push (c2,c1,c3);
            triangles.push(c3,c4,c2);
            
            // 6 vertex added
            tindex += 6;
        }
    }
    


window.onload = init;