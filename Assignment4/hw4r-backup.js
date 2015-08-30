"use strict";
var canvas;
var rect;
var gl;

// current values
var defaultZ = 0;
var transXYZ = vec3.fromValues(0, 0, defaultZ);
var rotXYZ = vec3.fromValues(0, 0, 0);
var scaleXYZ = vec3.fromValues(1, 1, 1);
var currObjMode = "wire";

var transform_type ="LOCAL";
// eye/camera coordinates
var eyePos = vec3.fromValues(0.0, 0.0, 20);
var atPoint = vec3.fromValues(0.0, 0.0, 0);
var upVector = vec3.fromValues(0, 1, 0);

//perspective Projection;
var fovy = 45;
var near = 6;
var far = 100;
var WIDTH = 800;
var HEIGHT = 600;

//Orthographic projection
var orthoLeft = -10;
var orthoRight = 10;
var orthoBottom = -10;
var orthoTop = 10;
var orthoNear = 10;
var orthoFar = 100;

// model,  modelview, projection , normal transform and view matrices
var modelMatrix, mvMatrix, pMatrix, normalMatrix, lookatMatrix;
modelMatrix = mat4.create();
mvMatrix = mat4.create();
pMatrix = mat4.create();
lookatMatrix = mat4.create();
normalMatrix = mat3.create();

//projection flag
var projectionFlag = 0; //perspective=0, orthographic=1

var selected = null;

 //Look AT Matrix / View Matrix
mat4.lookAt(lookatMatrix, eyePos, atPoint, upVector);
// Perspective projection matrix		
if (projectionFlag == 1 ) {
    mat4.ortho(pMatrix, orthoLeft, orthoRight, orthoBottom, orthoTop, orthoNear, orthoFar);    
} else {
    mat4.perspective(pMatrix, fovy, WIDTH/HEIGHT, near, far);
}

var mvMatrixStack = [];
function mvPushMatrix() {
	var copy = mat4.create();
	mat4.set(mvMatrix, copy);
	mvMatrixStack.push(copy);
}

function mvPopMatrix() {
	if (mvMatrixStack.length == 0) {
		throw "Invalid popMatrix!";
	}
	mvMatrix = mvMatrixStack.pop();
}


//lights
var MAXLIGHTS = 10;
var lightFlag = 0;
var lights = [];

var lightPosition = new Float32Array(MAXLIGHTS*4);
var lightColor = new Float32Array(MAXLIGHTS*4);
var transLightPos = new Float32Array(MAXLIGHTS*4);
var tempLightPos = new Float32Array(MAXLIGHTS*4);


for ( var i=0; i < MAXLIGHTS*4; i++ ) {
    lightPosition[i] = 10;   //vec4.fromValues(1,1,1,1));
    transLightPos[i] = 1;   //.push(vec4.fromValues(1,1,1,1));
    lightColor[i] = 1;      //.push(vec4.fromValues(1,1,1,1));
}

lightPosition[0] = -10; lightPosition[1] = -3; lightPosition[2] = 20; lightPosition[3] = 1;
lightPosition[4] =  -12; lightPosition[5] =  12; lightPosition[6] = 22; lightPosition[7] = 1;
lightPosition[8] =  10; lightPosition[9] =  -10; lightPosition[10] = 20; lightPosition[11] = 1;
lightPosition[12] = 10; lightPosition[13] =  10; lightPosition[14] = 20; lightPosition[15] = 1;

lightColor[0]=1;lightColor[1]=0;lightColor[2]=0;lightColor[3]=1;
lightColor[4]=0;lightColor[5]=1;lightColor[6]=0;lightColor[7]=1;
lightColor[8]=0;lightColor[9]=0;lightColor[10]=1;lightColor[11]=1;
lightColor[12]=0;lightColor[13]=1;lightColor[14]=1;lightColor[15]=1;

var numUsed = 4;

for ( var i=0; i < 4; i++ ) {
    lights[i] = 0;
}
for ( var i=0; i < numUsed; i++ ) {
    lights[i] = 1;
}


var objList = [];
var objCount = 0;
var currObjType = null;

// object constructor
function obj(type, id) {
	this.type = type;
	this.id = id;
	this.mode = "wire";
	this.translation = vec3.fromValues(0, 0, 0);
	this.rotation = vec3.fromValues(0, 0, 0);
	this.scale = vec3.fromValues(1, 1, 1);
    this.ambient = vec4.fromValues(0.05,0.05, 0.05, 1);
    //this.diffuse = [1,1,1, 1];
    //this.specular = [0,0,0,1];
    this.diffuse = vec4.fromValues(Math.random(),Math.random(), 0.75, 1);
    this.specular = vec4.fromValues(Math.random(), Math.random(), Math.random(), 1);
    //this.emission = vec4.fromValues(Math.random(), Math.random(), Math.random(), 1);
    this.shininess =  100; // Math.random() * 200;  
    this.transform = mat4.create();
}



//////////////////////////////////////////////////////////////////////////////////////////////
// Computer normal to  a triangle
//////////////////////////////////////////////////////////////////////////////////////////////
function computeNormal(out, v0, v1, v2, v3, v4, v5, v6, v7, v8) {
//computer normal to a triangle 
    var p1 = vec3.fromValues(v0,v1,v2);
    var p2 = vec3.fromValues(v3,v4,v5);
    var p3 = vec3.fromValues(v6,v7,v8);
 
         var temp1 = vec3.create();
         var temp2 = vec3.create();
         var temp3 = vec3.create();
         
         vec3.sub(temp1, p2, p1);
         vec3.sub(temp2, p3, p1);
         vec3.cross(temp3, temp1, temp2);
         vec3.normalize(out, temp3);
}
         

///////////////////////////////////////////////////////////////////////////////////////////////////
// Get Shader from html file, compile and return them
///////////////////////////////////////////////////////////////////////////////////////////////////
function getShader(gl, id) {
	var shaderScript = document.getElementById(id);
	if (!shaderScript) {
		return null;
	}
   
	var str = "";
	var k = shaderScript.firstChild;
	while (k) {
		if (k.nodeType == 3) {
			str += k.textContent;
		}
		k = k.nextSibling;
	}
    
	var shader;
	if (shaderScript.type == "x-shader/x-fragment") {
		shader = gl.createShader(gl.FRAGMENT_SHADER);
         
	} else if (shaderScript.type == "x-shader/x-vertex") {
		shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
		return null;
	}

	gl.shaderSource(shader, str);
    
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert(gl.getShaderInfoLog(shader));
		return null;
	}

	return shader;
}

///////////////////////////////////////////////////////////////////////////////////////////////////
// initialize shaders 
///////////////////////////////////////////////////////////////////////////////////////////////////
var shaderProgram;

function initShaders() {
	
	var vertexShader = getShader(gl, "shader-vs");
    console.log("compiled vetex shader.");
    var fragmentShader = getShader(gl, "shader-fs");
    console.log("compiled fragment shader.");
	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);
    
    var status = gl.getProgramParameter(shaderProgram, gl.LINK_STATUS);
	if (!status) {
		alert("Could not initialise shaders");
	}
	gl.linkProgram(shaderProgram);
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert("Could not initialise shaders");
	}
	gl.useProgram(shaderProgram);
	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    
    shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
	gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);


	shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
	gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
    
    //material property    
    shaderProgram.ambient = gl.getUniformLocation(shaderProgram, "ambient");
    shaderProgram.diffuse = gl.getUniformLocation(shaderProgram, "diffuse");
    //shaderProgram.emission = gl.getUniformLocation(shaderProgram, "emission");
    shaderProgram.specular = gl.getUniformLocation(shaderProgram, "specular");
    shaderProgram.shininess = gl.getUniformLocation(shaderProgram, "shininess");
    
    //light flag ( currently set to false )
    shaderProgram.lightFlag = gl.getUniformLocation(shaderProgram, "lightFlag");
    shaderProgram.lightIndFlag = gl.getUniformLocation(shaderProgram, "lightIndFlag");
    gl.uniform4iv(shaderProgram.lightIndFlag, lights);
   
    
    shaderProgram.lightPosition = gl.getUniformLocation(shaderProgram, "lightPosition");
    shaderProgram.lightColor = gl.getUniformLocation(shaderProgram, "lightColor");
    shaderProgram.numUsed = gl.getUniformLocation(shaderProgram, "numUsed");

	shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "pMatrix");
	shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "mvMatrix");
    shaderProgram.normalMatrixUniform = gl.getUniformLocation(shaderProgram, "normalMatrix");

	//
	shaderProgram.uRenderModeUniform = gl.getUniformLocation(shaderProgram, "uRenderMode")
	gl.uniform1i(shaderProgram.uRenderModeUniform, true);
    
	shaderProgram.uColorUniform = gl.getUniformLocation(shaderProgram, "uColor");
    if ( selected ) {
            gl.uniform4fv(shaderProgram.uColorUniform, [0,1,1, 1.0]);
    }
    else {
             gl.uniform4fv(shaderProgram.uColorUniform, [1,0,1, 1.0]);
    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////
// Initiate webgl  Vertex, Color buffers etc.
///////////////////////////////////////////////////////////////////////////////////////////////////
function init_buffers() {
	//
	sphVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, sphVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphVertexPosition), gl.STATIC_DRAW);
	sphVertexPositionBuffer.itemSize = 3;
	sphVertexPositionBuffer.numItems = sphVertexPosition.length / 3;
	// Normal 
    sphVertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, sphVertexNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphVertexNormal), gl.STATIC_DRAW);
	sphVertexNormalBuffer.itemSize = 3;
	sphVertexNormalBuffer.numItems = sphVertexNormal.length / 3;
	//  
	sphVertexColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, sphVertexColorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphVertexColor), gl.STATIC_DRAW);
	sphVertexColorBuffer.itemSize = 4;
	sphVertexColorBuffer.numItems = sphVertexColor.length / 4;

	// cylinder
	cylVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cylVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cylVertexPosition), gl.STATIC_DRAW);
	cylVertexPositionBuffer.itemSize = 3;
	cylVertexPositionBuffer.numItems = cylVertexPosition.length / 3;
	// Normal 
    cylVertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cylVertexNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cylVertexNormal), gl.STATIC_DRAW);
	cylVertexNormalBuffer.itemSize = 3;
	cylVertexNormalBuffer.numItems = cylVertexNormal.length / 3; 
    //color
	cylVertexColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cylVertexColorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cylVertexColor), gl.STATIC_DRAW);
	cylVertexColorBuffer.itemSize = 4;
	cylVertexColorBuffer.numItems = cylVertexColor.length / 4;
	//
	
	//Cone
	coneVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, coneVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coneVertexPosition), gl.STATIC_DRAW);
	coneVertexPositionBuffer.itemSize = 3;
	coneVertexPositionBuffer.numItems = coneVertexPosition.length / 3;
    // Normal 
    coneVertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, coneVertexNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coneVertexNormal), gl.STATIC_DRAW);
	coneVertexNormalBuffer.itemSize = 3;
	coneVertexNormalBuffer.numItems = coneVertexNormal.length / 3;

	//color     
	coneVertexColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, coneVertexColorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(conelVertexColor), gl.STATIC_DRAW);
	coneVertexColorBuffer.itemSize = 4;
	coneVertexColorBuffer.numItems = conelVertexColor.length / 4;

}

function setMatrixUniforms() {
// Set uniform 
	gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
	gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
    gl.uniformMatrix3fv(shaderProgram.normalMatrixUniform, false, normalMatrix);
}


function setLightUniforms() {
// Set uniform 
	 // send it the fragment shader
        gl.uniform4fv(shaderProgram.lightPosition, transLightPos);
        //gl.uniform4fv(shaderProgram.lightPosition, lightPosition);
        gl.uniform4fv(shaderProgram.lightColor, lightColor);
        gl.uniform1i(shaderProgram.numUsed, numUsed);
}

function setMaterialUniforms(item) {
// Set uniform 
     gl.uniform4fv(shaderProgram.ambient, item.ambient );
     gl.uniform4fv(shaderProgram.diffuse, item.diffuse ) ;
     gl.uniform4fv(shaderProgram.specular, item.specular );
     gl.uniform1f(shaderProgram.shininess, item.shininess );
     //gl.uniform4fv(shaderProgram.emission, item.emission );
}

function degToRad(degrees) {
	return degrees * Math.PI / 360;
}

function radToDeg(rad) {
	return rad * 360;
}



///////////////////////////////////////////////////////////////////////////////////////////////////
// Rendering/Drawing Program
///////////////////////////////////////////////////////////////////////////////////////////////////
function drawScene_disabled() {
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	console.log("Draw");
	for (var index = 0; index < objCount; index++) {
		var type = objList[index].type;
		var mode = objList[index].mode;
		var translation = objList[index].translation;
		var rotation = objList[index].rotation;
		var scalexyz = objList[index].scale;
   
		// We are using gl-matrix.js  for matrix/vector routines
        //model transforms, scale first
            mat4.identity(modelMatrix);
            mat4.scale(modelMatrix, modelMatrix, scalexyz);
            //x axis rotation
            mat4.rotateX(modelMatrix, modelMatrix, degToRad(rotation[0]));
            //y axis rotation
            mat4.rotateY(modelMatrix, modelMatrix, degToRad(rotation[1]));
            //z axis rotation
            mat4.rotateZ(modelMatrix, modelMatrix, degToRad(rotation[2]));
            //translate
            mat4.translate(modelMatrix, modelMatrix, translation);
                        
        //clone the model  matrix for this object and  save it
        objList[index].transform = mat4.clone(modelMatrix);
         
		//modelview matrix
            mat4.multiply(mvMatrix, lookatMatrix, modelMatrix);
  
        // normal transform matrix, inverse transform of  mvMatrix
            mat3.normalFromMat4( normalMatrix, mvMatrix);
        
        // transform the light positions by lookatMatrix matrix, lights are in word co-ordinates
        transformLights(lookatMatrix, transLightPos, lightPosition, numUsed);
        
        //set the uniforms and draw
        setUniformsAndDraw(index, type, mode);

	} //for obj
    selected = 0;
} //drawscene

// Set uniforms and draw

function setUniformsAndDraw(index,type, mode) {
//
    console.log(index);
    console.log(type);
    console.log(mode);
        // light flag
        if  ( mode == "both" ) {
            gl.uniform1i(shaderProgram.lightFlag, 1);
            gl.uniform4iv(shaderProgram.lightIndFlag, lights);
        } else {
         gl.uniform1i(shaderProgram.lightFlag, 0);
        }

 // set the uniforms
		setMatrixUniforms();
        setMaterialUniforms(objList[index]); //index is the index in object list
        setLightUniforms();
       
        
		if (type == "Cone") {
			draw_cone(mode);
		}
		if (type == "Cylinder") {
            draw_cylinder(mode);
		}
		if (type == "Sphere") {
            draw_sphere(mode)
		}
}




function draw_sphere(mode) {
	console.log("Sphere");
			gl.bindBuffer(gl.ARRAY_BUFFER, sphVertexPositionBuffer);
			gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, sphVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
            
            gl.bindBuffer(gl.ARRAY_BUFFER, sphVertexNormalBuffer);
			gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, sphVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);


			// color buffer 
			gl.bindBuffer(gl.ARRAY_BUFFER, sphVertexColorBuffer);
			gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, sphVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

			if (mode == "wire") {
				gl.uniform1i(shaderProgram.uRenderModeUniform, 0);
				for (var i = 0; i < sphVertexPositionBuffer.numItems; i += 3) {
					gl.drawArrays(gl.LINE_LOOP, i, 3);
				}
			} else if (mode == "solid") {
				gl.uniform1i(shaderProgram.uRenderModeUniform, 1);
				gl.drawArrays(gl.TRIANGLES, 0, sphVertexPositionBuffer.numItems);
			} else {
				gl.uniform1i(shaderProgram.uRenderModeUniform, 1);
				 gl.drawArrays(gl.TRIANGLES, 0, sphVertexPositionBuffer.numItems);
                /*
				gl.uniform1i(shaderProgram.uRenderModeUniform, 0);
				for (var i = 0; i < sphVertexPositionBuffer.numItems; i += 3) {
					gl.drawArrays(gl.LINE_LOOP, i, 3);
				} */

			}

}

function draw_cylinder(mode) {
//console.log("Cylinder");
			gl.bindBuffer(gl.ARRAY_BUFFER, cylVertexPositionBuffer);
			gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cylVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
            
            gl.bindBuffer(gl.ARRAY_BUFFER, cylVertexNormalBuffer);
			gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, cylVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

			// color buffer 
			gl.bindBuffer(gl.ARRAY_BUFFER, cylVertexColorBuffer);
			gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, cylVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

			if (mode == "wire") {
				gl.uniform1i(shaderProgram.uRenderModeUniform, 0);
				for (var i = 0; i < cylVertexPositionBuffer.numItems; i += 3) {
					gl.drawArrays(gl.LINE_LOOP, i, 3);
				}
			} else if (mode == "solid") {
				gl.uniform1i(shaderProgram.uRenderModeUniform, 1);
				gl.drawArrays(gl.TRIANGLES, 0, cylVertexPositionBuffer.numItems);
			} else {
				gl.uniform1i(shaderProgram.uRenderModeUniform, 1);
				gl.drawArrays(gl.TRIANGLES, 0, cylVertexPositionBuffer.numItems);
				/* gl.uniform1i(shaderProgram.uRenderModeUniform, 0);
				for (var i = 0; i < cylVertexPositionBuffer.numItems; i += 3) {
					gl.drawArrays(gl.LINE_LOOP, i, 3);
				} */

			}
}

function draw_cone(mode) {
console.log("Cone");
			gl.bindBuffer(gl.ARRAY_BUFFER, coneVertexPositionBuffer);
			gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, coneVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
            
            gl.bindBuffer(gl.ARRAY_BUFFER, coneVertexNormalBuffer);
			gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, coneVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

			// color buffer 
			gl.bindBuffer(gl.ARRAY_BUFFER, coneVertexColorBuffer);
			gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, coneVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
			if (mode == "wire") {
				gl.uniform1i(shaderProgram.uRenderModeUniform, 0);
				for (var i = 0; i < coneVertexPositionBuffer.numItems; i += 3) {
					gl.drawArrays(gl.LINE_LOOP, i, 3);
				}
			} else if (mode == "solid") {
				gl.uniform1i(shaderProgram.uRenderModeUniform, 1);
				gl.drawArrays(gl.TRIANGLES, 0, coneVertexPositionBuffer.numItems);
			} else {
				gl.uniform1i(shaderProgram.uRenderModeUniform, 1);
				gl.drawArrays(gl.TRIANGLES, 0, coneVertexPositionBuffer.numItems);
				/* gl.uniform1i(shaderProgram.uRenderModeUniform, 0);
				for (var i = 0; i < coneVertexPositionBuffer.numItems; i += 3) {
					gl.drawArrays(gl.LINE_LOOP, i, 3);
				} */

			}
}


//////////////////////////////////////////////////////////////////////////////////////////////////
// initialization
//////////////////////////////////////////////////////////////////////////////////////////////////
window.onload = init;

function init() {
//
	gen_sphereCords(sphereR);
	gen_cylinderCords(cylH, cylR);
	gen_coneCords(coneH, coneR);
    
    document.getElementById("check1").checked = true; 
     document.getElementById("check2").checked = true;   
      document.getElementById("check3").checked = true;   
       document.getElementById("check4").checked = true;   

///////////////////////////////////////////////////////////////////////////////////////////////////
// Set up, scaling, rotation, and translation sliders
///////////////////////////////////////////////////////////////////////////////////////////////////
	$("#transX").slider({
		orientation: "horizontal",
		max: 10,
		min: -10,
		step: 0.1,
		value: 0,
		slide: function(e, ui) {
			transXYZ[0] = ui.value;
			objList[objCount - 1].translation[0] = ui.value;
			$("#transXVal").html(ui.value);
            drawScene();
		},
		change: function(event) {
			if (event.originalEvent) {
				drawScene();
			}
		}
	});

	$("#transY").slider({
		orientation: "horizontal",
		max: 10,
		min: -10,
		step: 0.1,
		value: 0,
		slide: function(e, ui) {
			transXYZ[1] = ui.value;
			objList[objCount - 1].translation[1] = ui.value;
			$("#transYVal").html(ui.value);
            drawScene();
		},
		change: function(event) {
			if (event.originalEvent) {
				drawScene();
			}
		}
	});
    
	$("#transZ").slider({
		orientation: "horizontal",
		max: 10,
		min: -10,
		step: 0.1,
		value: defaultZ,
		slide: function(e, ui) {
			transXYZ[2] = ui.value;
			objList[objCount - 1].translation[2] = ui.value;
			$("#transZVal").html(ui.value);
            drawScene();
		},
		change: function(event) {
			if (event.originalEvent) {
				drawScene();
			}
		}
	});

	//rotation
	$("#rotX").slider({
		orientation: "horizontal",
		min: -360,
		max: 360,
		step: 5,
		value: 0,
		slide: function(e, ui) {
			rotXYZ[0] = ui.value;
			objList[objCount - 1].rotation[0] = ui.value;
			$("#rotXVal").html(ui.value);
             drawScene();
		},
		change: function(event) {
			if (event.originalEvent) {
				drawScene();
			}
		}
	});

	$("#rotY").slider({
		orientation: "horizontal",
		min: -360,
		max: 360,
		step: 5,
		value: 0,
		slide: function(e, ui) {
			rotXYZ[1] = ui.value;
			objList[objCount - 1].rotation[1] = ui.value;
			$("#rotYVal").html(ui.value);
             drawScene();
		},
		change: function(event) {
			if (event.originalEvent) {
				drawScene();
			}
		}
	});

	$("#rotZ").slider({
		orientation: "horizontal",
		min: -360,
		max: 360,
		step: 5,
		value: 0,
		slide: function(e, ui) {
			rotXYZ[2] = ui.value;
			objList[objCount - 1].rotation[2] = ui.value;
			$("#rotZVal").html(ui.value); 
            drawScene();
		},
		change: function(event) {
			if (event.originalEvent) {
				drawScene();
			}
		}
	});

// scaling
	$("#scaleX").slider({
		orientation: "horizontal",
		max: 3.0,
		min: 0.25,
		step: 0.25,
		value: scaleXYZ[0],
		slide: function(e, ui) {
			scaleXYZ[0] = ui.value;
			objList[objCount - 1].scale[0] = ui.value;
			$("#scaleXVal").html(ui.value);
             drawScene();
		},
		change: function(event) {
			if (event.originalEvent) {
				drawScene();
			}
		}
	});

	$("#scaleY").slider({
		orientation: "horizontal",
		max: 3.0,
		min: 0.25,
		step: 0.25,
		value: scaleXYZ[1],
		slide: function(e, ui) {
			scaleXYZ[1] = ui.value;
			objList[objCount - 1].scale[1] = ui.value;
			$("#scaleYVal").html(ui.value);
             drawScene();
		},
		change: function(event) {
			if (event.originalEvent) {
				drawScene();
			}
		}
	});

	$("#scaleZ").slider({
		orientation: "horizontal",
		max: 3.0,
		min: 0.25,
		step: 0.25,
		value: scaleXYZ[2],
		slide: function(e, ui) {
			scaleXYZ[2] = ui.value;
			objList[objCount - 1].scale[2] = ui.value;
			$("#scaleZVal").html(ui.value);
             drawScene();
		},
		change: function(event) {
			if (event.originalEvent) {
				drawScene();
			}
		}
	});

	// webgl canvas
	canvas = document.getElementById("gl-canvas");
	rect = canvas.getBoundingClientRect();

	gl = WebGLUtils.setupWebGL(canvas);

	if (!gl) {
		alert("WebGL isn't available");
	}
	gl.viewportWidth = canvas.width
	gl.viewportHeight = canvas.height
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clearColor(0.2,0.2,0.8, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CCW);
    gl.projectionFlag = 0;

	initShaders()
	init_buffers();
    reset_ui();

} // init

//////////////////////////////////////////////////////////////////////////////////////////////////
// create object
///////////////////////////////////////////////////////////////////////////////////////////////
//shape selector Selector
$(function() {
	$("input[name='shapeGroup']").on("click", function() {
		var id = this.value + objCount;
		currObjType = this.value;
		objList[objCount] = new obj(currObjType, id);
		//objList[objCount].type = this.value;
		objCount++;
		//alert(this.value);

		reset_ui();
        // Add to Select list
        addOneToList(id);
        
		drawScene();
	});
});


/////////////////////////////////////////////////////////////////////////////////////////
//  reset all the buttons and sliders to default values 
////////////////////////////////////////////////////////////////////////////////////////
function reset_ui() {
	$("input[name=renderModeGroup][value=wire]").prop('checked', true);
	$("input[name=renderModeGroup][value=solid]").prop('checked', false);
	$("input[name=renderModeGroup][value=both]").prop('checked', false);

	$("#transX").slider("option", "value", 0);
	$("#transY").slider("option", "value", 0);
	$("#transZ").slider("option", "value", defaultZ);

	$("#rotX").slider("option", "value", 0);
	$("#rotY").slider("option", "value", 0);
	$("#rotZ").slider("option", "value", 0);

	$("#scaleX").slider("option", "value", 1);
	$("#scaleY").slider("option", "value", 1);
	$("#scaleZ").slider("option", "value", 1);
    
    $("#transXVal").html(0);
    $("#transYVal").html(0);
    $("#transZVal").html(0);
      
    $("#rotXVal").html(0);
    $("#rotYVal").html(0);
    $("#rotZVal").html(0);
    
    $("#scaleXVal").html(0);   
    $("#scaleYVal").html(0);  
    $("#scaleZVal").html(0); 
        
    $("input[name=viewGroup][value=Perspective]").prop('checked', true);
	$("input[name=viewGroup][value=Orthogonal]").prop('checked', false);
      
}

// Mode Selector
	$(function() {
		$("input[name='renderModeGroup']").on("change", function() {
			currObjMode = this.value;
			objList[objCount - 1].mode = this.value;
			//alert(this.value);
			drawScene();
		});

	});

	//projection selector
	$(function() {
		$("input[name='viewGroup']").on("change", function() {
			//console.log(this.value);
			if (this.value == "Orthogonal" ) {
				gl.projectionFlag = 1;
                 mat4.ortho(pMatrix, orthoLeft, orthoRight, orthoBottom, orthoTop, orthoNear, orthoFar);   
			} else {
                 mat4.perspective(pMatrix, fovy, gl.viewportWidth / gl.viewportHeight, near, far);
				gl.projectionFlag = 0;
			}      
			drawScene();
		});
	});


////////////////////////////////////////////////////////////////////
/// Make the select list of objects for selection
///////////////////////////////////////////////////////////////////
function make_list() {
	$.each(objList, function() {
   
		$('#mySelect').append($('<option>', {
			value: this.id,
			text: this.id
		}));
	});
}
////////////////////////////////////////////////////////////////
function addOneToList(id) {

		$('#mySelect').append($('<option>', {
			value: id,
			text: id
		}));
}
 /* useful code 
var sel = $('<select>').appendTo('#panel');
$.each(objList, function() {
 sel.append($("<option>").attr('value',this.id).text(this.id));
});
*/

/////////////////////////////////////////////////////////////////
// toggling Div container  for select list 
/////////////////////////////////////////////////////////////////
$(document).ready(function() {
	$("#switch").click(function() {
		var selectList = $("#mySelect");
		selectList.find("option:gt(0)").remove();
		//$("#mySelect").empty();
		make_list();
		$("#panel").toggle();
	});
});

/////////////////////////////////////////////////////////////////////////////
// SELECTION AND DELETION  OF OBJECTS FROM ARRAY
////////////////////////////////////////////////////////////////////////////
$(document).ready(function() {
	$("#mySelect").change(function() {
		var v = $("#mySelect").val();
		//console.log(v);
		for (var i = 0; i < objCount; i++) {
			if (v == objList[i].id) {
				if (confirm('Press Cancel to Edit the Selected Object, Ok to Delete it.')) {
					// delete it 
					objList.splice(i, 1);
					objCount = objCount - 1;
					drawScene();
					break;

				} else {
					// Do nothing!
                    selected = 1;
					swapArrayElements(objList, i, objCount - 1);
                    reset_ui();
					drawScene();
					break;
				}
			}
		}
		setTimeout(function() {
			$('#panel').fadeOut('fast');
		}, 500);
	});
});

////////////////////////////////////////////////////////////////////////////////////////////
// SWAP two object positions in the array.
//////////////////////////////////////////////////////////////////////////////////////////

function swapArrayElements(array_object, index_a, index_b) {
	var temp = array_object[index_a];
	array_object[index_a] = array_object[index_b];
	array_object[index_b] = temp;
}

///////////////////////////////////////////////////////////////////////////////////////////////
// Delete an object from a array
///////////////////////////////////////////////////////////////////////////////////////////////
var removeByAttr = function(arr, attr, value) {
	var i = arr.length;
	while (i--) {
		if (arr[i] && arr[i].hasOwnProperty(attr) && (arguments.length > 2 && arr[i][attr] === value)) {

			arr.splice(i, 1);

		}
	}
	return arr;
}

function transformLights(mat, outvec, invec, used) {
// multiply  matrix with vector
    var i, j, k;
    var out = vec4.create();
    for (  k=0; k < 4*used; k+=4 ) {
        
        for (  i=0; i < 4; i++ ) {
               out[i] = invec[k+i];
            }
            vec4.transformMat4(out, out, mat);
            for (  i=0; i < 4; i++ ) {
                outvec[k+i] = out[i];
            }
        
            
    }
}

var angle = 0;
var rotMat;
rotMat=mat4.create();
function rotate_lights( angle, outVector, inVector) {
    var i, j, k;
    var out = vec4.create();
    mat4.identity(rotMat);
    mat4.rotateY(rotMat, rotMat, degToRad(angle));
    transformLights(rotMat, outVector, inVector, numUsed);
    console.log(angle);
}


function handleLights(event) {
    if ( event.id == "check1" ) {       
        if ( event.checked == true ) {
            lights[0] = 1;
        } else {
            lights[0] = 0;
        }
        gl.uniform4iv(shaderProgram.lightIndFlag, lights);
        drawScene();
    }
    if ( event.id == "check2" ) {       
        if ( event.checked == true ) {
            lights[1] = 1;
        } else {
            lights[1] = 0;
        }
         gl.uniform4iv(shaderProgram.lightIndFlag, lights);
        drawScene();
    }
    if ( event.id == "check3" ) {       
        if ( event.checked == true ) {
            lights[2] = 1;
        } else {
            lights[2] = 0;
        }
         gl.uniform4iv(shaderProgram.lightIndFlag, lights);
        drawScene();
    }
    if ( event.id == "check4" ) {       
        if ( event.checked == true ) {
            lights[3] = 1;
        } else {
            lights[3] = 0;
        }
         gl.uniform4iv(shaderProgram.lightIndFlag, lights);
        drawScene();
    }
        
}


function drawScene(e) {
    {
    
    
		// We are using gl-matrix.js  for matrix/vector routines
        //model transforms, scale first
            mat4.identity(modelMatrix);
            mat4.scale(modelMatrix, modelMatrix, scalexyz);
            //x axis rotation
            mat4.rotateX(modelMatrix, modelMatrix, degToRad(rotation[0]));
            //y axis rotation
            mat4.rotateY(modelMatrix, modelMatrix, degToRad(rotation[1]));
            //z axis rotation
            mat4.rotateZ(modelMatrix, modelMatrix, degToRad(rotation[2]));
            //translate
            mat4.translate(modelMatrix, modelMatrix, translation);
                        
    switch (e.id) {
    case "scaleX":
        mat4.identity(modelMatrix);
        mat4.scale(modelMatrix, modelMatrix, [scaleXYZ[0],1,1]);
        break;
    case "scaleY":
        mat4.identity(modelMatrix);
        mat4.scale(modelMatrix, modelMatrix, [1, scaleXYZ[0],1]);
        break;
    case "scaleZ":
        mat4.identity(modelMatrix);
        mat4.scale(modelMatrix, modelMatrix, [1, 1,scaleXYZ[2]]);
        break;
    case "rotX":
         mat4.identity(modelMatrix);
        mat4.rotateX(modelMatrix, modelMatrix, degToRad(rotXYZ[0]));
        break;
    case "rotY":
     mat4.identity(modelMatrix);
        mat4.rotateY(modelMatrix, modelMatrix, degToRad(rotXYZ[1]));
        break;
    case "rotZ":
        mat4.identity(modelMatrix);
        mat4.rotateZ(modelMatrix, modelMatrix, degToRad(rotXYZ[2]));;
        break;
    case "transX":
        mat4.identity(modelMatrix);
        mat4.scale(modelMatrix, modelMatrix, [transXYZ[0],1,1]);
        break;
     case "transY:
        mat4.identity(modelMatrix);
        mat4.scale(modelMatrix, modelMatrix, [1, transXYZ[1],1]);
        break;
     case "transZ":
        mat4.identity(modelMatrix);
        mat4.translate(modelMatrix, modelMatrix, [1, 1,transXYZ[2]]);
        break;
    }

}


function flatten(array){
    var flat = [];
    for (var i = 0, l = array.length; i < l; i++){
        var type = Object.prototype.toString.call(array[i]).split(' ').pop().split(']').shift().toLowerCase();
        if (type) { flat = flat.concat(/^(array|collection|arguments|object)$/.test(type) ? flatten(array[i]) : array[i]); }
    }
    return flat;
}