"use strict";
var canvas;
var rect;
var gl;

//
var latDivs = 24;
var lonDivs = 24;

var sphereR = 1.0;
var sphLinesIndexData = [];
var sphLinesIndexBuffer;
var sphVcords = [];
var sphVertexPositionData = [];
var sphColorData = [];
var sphIndexData = [];
var sphNormalData = [];
var sphVertexPositionBuffer;
var sphVertexColorBuffer;
var sphVertexIndexBuffer;
var sphVertexNormalBuffer;


//cylinder
var cylH = 2.0;
var cylR = 1.0;
var cylVcords = [];
var cylVertexPositionData = [];
var cylColorData = [];
var cylIndexData = [];
var cylNormalData = [];
var cylLinesIndexData = [];
var cylLinesIndexBuffer;
var cylVertexPositionBuffer;
var cylVertexColorBuffer;
var cylVertexIndexBuffer;
var cylVertexNormalBuffer;


//cone
var coneH = 2.0;
var coneR = 1.0;
var coneLinesIndexData = [];
var coneVcords = [];
var coneVertexPositionData = [];
var coneColorData = [];
var coneIndexData = [];
var coneNormalData = [];
var coneLinesIndexBuffer;
var coneVertexPositionBuffer;
var coneVertexColorBuffer;
var coneVertexIndexBuffer;
var coneVertexNormalBuffer;

var objList = [];
var objCount = 0;
var currObjType = null;

// object constructor
function obj(type, id) {
	this.type = type;
	this.id = id;
	this.mode = "wire";
	this.translation = [0, 0, 0];
	this.rotation = [0, 0, 0];
	this.scale = [1, 1, 1];
}

// current values
var defaultZ = 0;
var transXYZ = [0, 0, defaultZ];
var rotXYZ = [0, 0, 0];
var scaleXYZ = [1, 1, 1];
var currObjMode = "wire";


// eye/camera coordinates
var eyePos = [0.0, 0.0, 18];
var atPoint = [0.0, 0.0, 8];
var upVector = [0, 1, 0];

//perspective Projection;
var fov = 45;
var near = 10;
var far = 100;

//Orthographic projection
var orthoLeft = -10;
var orthoRight = 10;
var orthoBottom = -10;
var orthoTop = 10;
var orthoNear = 10;
var orthoFar = 100;


//projection flag
var projectionFlag = 0; //perspective=0, orthographic=1
var selected = null;

///////////////////////////////////////////////////////////////////////////////////////////////////
//Generate cone coordinates
///////////////////////////////////////////////////////////////////////////////////////////////////
function gen_coneCords() {
	//
	console.log("cone cords.");
	//push cone vertex coordinates
	coneVcords.push(0.0, coneH / 2, 0.0);
	coneColorData.push(0.0, coneH / 2, 0.0, 1.0);
	for (var phi = 0; phi <= 2 * Math.PI; phi += 2 * Math.PI / lonDivs) {
		var x = coneR * Math.sin(phi);
		var y = -coneH / 2;
		var z = coneR * Math.cos(phi);
		coneVcords.push(x, y, z);
		//coneColorData.push(x,y,z, 1.0);
	}
	for (var lon = 0; lon < lonDivs + 1; lon++) {
		coneIndexData.push(0, lon, lon + 1);
		coneLinesIndexData.push(0, lon, lon, lon + 1, lon + 1, 0);

		coneVertexPositionData.push(coneVcords[0], coneVcords[1], coneVcords[2],
		coneVcords[3 * lon], coneVcords[3 * lon + 1], coneVcords[3 * lon + 2],
		coneVcords[3 * (lon + 1)], coneVcords[3 * (lon + 1) + 1], coneVcords[3 * (lon + 1) + 2]);
     
		coneColorData.push(coneVcords[0], coneVcords[1], coneVcords[2], 1.0);
		coneColorData.push(Math.abs(coneVcords[3 * lon]), Math.abs(coneVcords[3 * lon + 1]), Math.abs(coneVcords[3 * lon + 2]), 1.0);
        coneColorData.push(Math.abs(coneVcords[3 * (lon + 1)]), Math.abs(coneVcords[3 * (lon + 1) + 1]), Math.abs(coneVcords[3 * (lon + 1) + 2]), 1.0);  
	}

	// cap 
	for (var lon = 0; lon < lonDivs + 1; lon++) {
		coneVertexPositionData.push(coneVcords[0], -coneVcords[1], coneVcords[2],
		coneVcords[3 * (lon + 1)], coneVcords[3 * (lon + 1) + 1], coneVcords[3 * (lon + 1) + 2],
		coneVcords[3 * lon], coneVcords[3 * lon + 1], coneVcords[3 * lon + 2]);

		coneColorData.push(Math.abs(coneVcords[0]), Math.abs(-coneVcords[1]), Math.abs(coneVcords[2]), 1.0);
		coneColorData.push(Math.abs(coneVcords[3 * (lon + 1)]), Math.abs(coneVcords[3 * (lon + 1) + 1]), Math.abs(coneVcords[3 * (lon + 1) + 2]), 1.0);
        coneColorData.push(Math.abs(coneVcords[3 * lon]), Math.abs(coneVcords[3 * lon + 1]), Math.abs(coneVcords[3 * lon + 2]), 1);
	}
	//console.log(coneVertexPositionData.length);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
// Generate cylinder coordinates
/////////////////////////////////////////////////////////////////////////////////////////////////////
function gen_cylinderCords() {
	//generate cylinder coordinates
	console.log("cylinder cords.");
	var ytop = cylH / 2;
	var ybot = -cylH / 2;
	for (var phi = 0; phi <= 2 * Math.PI; phi += 2 * Math.PI / lonDivs) {
		var x = cylR * Math.sin(phi);
		var z = cylR * Math.cos(phi);
		//top
		cylVcords.push(x, ytop, z);
	}
	//console.log("cylinder cords. " + cylVcords.length);

	for (var lon = 0; lon < 2 * (lonDivs); lon++) {

		cylIndexData.push(lon, lon + 1, lon + 3);
		cylIndexData.push(lon, lon + 3, lon + 2);

		cylLinesIndexData.push(lon, lon + 1, lon + 1, lon + 3, lon + 3, lon);
		cylLinesIndexData.push(lon, lon + 3, lon + 3, lon + 2, lon + 2, lon);
	}
    // body and two caps
	for (var lon = 0; lon < lonDivs + 1; lon++) {
		cylVertexPositionData.push(cylVcords[3 * lon], cylVcords[3 * lon + 1], cylVcords[3 * lon + 2],
		cylVcords[3 * lon], -cylVcords[3 * lon + 1], cylVcords[3 * lon + 2],
		cylVcords[3 * (lon + 1)], cylVcords[3 * (lon + 1) + 1], cylVcords[3 * (lon + 1) + 2]);

		cylColorData.push(cylVcords[3 * lon], cylVcords[3 * lon + 1], cylVcords[3 * lon + 2], 1);
		cylColorData.push(cylVcords[3 * lon], -cylVcords[3 * lon + 1], cylVcords[3 * lon + 2], 1);
		cylColorData.push(cylVcords[3 * (lon + 1)], cylVcords[3 * (lon + 1) + 1], cylVcords[3 * (lon + 1) + 2], 1);

		cylVertexPositionData.push(cylVcords[3 * lon], -cylVcords[3 * lon + 1], cylVcords[3 * lon + 2],
		cylVcords[3 * (lon + 1)], -cylVcords[3 * (lon + 1) + 1], cylVcords[3 * (lon + 1) + 2],
		cylVcords[3 * (lon + 1)], cylVcords[3 * (lon + 1) + 1], cylVcords[3 * (lon + 1) + 2]);

		cylColorData.push(cylVcords[3 * lon], -cylVcords[3 * lon + 1], cylVcords[3 * lon + 2], 1);
		cylColorData.push(cylVcords[3 * (lon + 1)], -cylVcords[3 * (lon + 1) + 1], cylVcords[3 * (lon + 1) + 2], 1);
		cylColorData.push(cylVcords[3 * (lon + 1)], cylVcords[3 * (lon + 1) + 1], cylVcords[3 * (lon + 1) + 2], 1);



		cylVertexPositionData.push(0, ytop, 0,
		cylVcords[3 * lon], cylVcords[3 * lon + 1], cylVcords[3 * lon + 2],
		cylVcords[3 * (lon + 1)], cylVcords[3 * (lon + 1) + 1], cylVcords[3 * (lon + 1) + 2]);

		cylColorData.push(0, ytop, 0, 1);
		cylColorData.push(cylVcords[3 * lon], cylVcords[3 * lon + 1], cylVcords[3 * lon + 2], 1);
		cylColorData.push(cylVcords[3 * (lon + 1)], cylVcords[3 * (lon + 1) + 1], cylVcords[3 * (lon + 1) + 2], 1);

		cylVertexPositionData.push(0, ybot, 0,
		cylVcords[3 * (lon + 1)], -cylVcords[3 * (lon + 1) + 1], cylVcords[3 * (lon + 1) + 2],
		cylVcords[3 * lon], -cylVcords[3 * lon + 1], cylVcords[3 * lon + 2]);


		cylColorData.push(0, ybot, 0, 1);
		cylColorData.push(cylVcords[3 * (lon + 1)], -cylVcords[3 * (lon + 1) + 1], cylVcords[3 * (lon + 1) + 2], 1);
		cylColorData.push(cylVcords[3 * lon], -cylVcords[3 * lon + 1], cylVcords[3 * lon + 2], 1);
	}
	//console.log(cylVertexPositionData.length);
}

///////////////////////////////////////////////////////////////////////////////////////////////////
//Generate sphere coordinates
///////////////////////////////////////////////////////////////////////////////////////////////////
function gen_sphereCords() {
	//
	console.log("sphere cords.");
	for (var latIndex = 0; latIndex <= latDivs; latIndex++) {
		var theta = latIndex * Math.PI / latDivs;
		var sinTheta = Math.sin(theta);
		var cosTheta = Math.cos(theta);
        
		for (var lonIndex = 0; lonIndex <= lonDivs; lonIndex++) {
			var phi = lonIndex * 2 * Math.PI / lonDivs;
			//var x = Math.cos(phi) * sinTheta;
			var x = Math.sin(phi) * sinTheta;
			var y = cosTheta;
			//var z = Math.sin(phi) * sinTheta;
			var z = Math.cos(phi) * sinTheta;
			sphNormalData.push(x);
			sphNormalData.push(y);
			sphNormalData.push(z);
			//sphColorData.push(Math.abs(x),Math.abs(y),Math.abs(z), 1.0);
			//sphColorData.push(x,y,z, 1.0);
			sphVcords.push([sphereR * x, sphereR * y, sphereR * z]);
		}
	}
	//console.log(sphVcords.length);
	for (var latIndex = 0; latIndex < latDivs; latIndex++) {
		for (var lonIndex = 0; lonIndex < lonDivs; lonIndex++) {

			var first = (latIndex * (lonDivs + 1)) + lonIndex;
			var second = first + lonDivs + 1;

			sphIndexData.push(first);
			sphIndexData.push(second);
			sphIndexData.push(first + 1);

			sphVertexPositionData.push(sphVcords[first][0], sphVcords[first][1], sphVcords[first][2],
			sphVcords[second][0], sphVcords[second][1], sphVcords[second][2],
			sphVcords[first + 1][0], sphVcords[first + 1][1], sphVcords[first + 1][2]);

			sphColorData.push(sphVcords[first][0], sphVcords[first][1], sphVcords[first][2], 1.0);
			sphColorData.push(sphVcords[second][0], sphVcords[second][1], sphVcords[second][2], 1.0);
			sphColorData.push(sphVcords[first + 1][0], sphVcords[first + 1][1], sphVcords[first + 1][2], 1.0);

			sphLinesIndexData.push(first, second, second, first + 1, first + 1, first);

			sphIndexData.push(second);
			sphIndexData.push(second + 1);
			sphIndexData.push(first + 1);

			sphVertexPositionData.push(sphVcords[second][0], sphVcords[second][1], sphVcords[second][2],
			sphVcords[second + 1][0], sphVcords[second + 1][1], sphVcords[second + 1][2],
			sphVcords[first + 1][0], sphVcords[first + 1][1], sphVcords[first + 1][2]);

			sphColorData.push(sphVcords[second][0], sphVcords[second][1], sphVcords[second][2], 1.0);
			sphColorData.push(sphVcords[second + 1][0], sphVcords[second + 1][1], sphVcords[second + 1][2], 1.0);
			sphColorData.push(sphVcords[first + 1][0], sphVcords[first + 1][1], sphVcords[first + 1][2], 1.0);

			sphLinesIndexData.push(second, second + 1, second + 1, first + 1, first + 1, second);

		}
	}
	//console.log(sphVertexPositionData.length);
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
	var fragmentShader = getShader(gl, "shader-fs");
	var vertexShader = getShader(gl, "shader-vs");
	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert("Could not initialise shaders");
	}

	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert("Could not initialise shaders");
	}
	gl.useProgram(shaderProgram);
	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

	shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
	gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

	shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");

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
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphVertexPositionData), gl.STATIC_DRAW);
	sphVertexPositionBuffer.itemSize = 3;
	sphVertexPositionBuffer.numItems = sphVertexPositionData.length / 3;
	//  
	sphVertexColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, sphVertexColorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphColorData), gl.STATIC_DRAW);
	sphVertexColorBuffer.itemSize = 4;
	sphVertexColorBuffer.numItems = sphColorData.length / 4;
	//
	sphVertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphVertexIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(sphIndexData), gl.STATIC_DRAW);
	sphVertexIndexBuffer.itemSize = 1;
	sphVertexIndexBuffer.numItems = sphIndexData.length;

	sphLinesIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphLinesIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(sphLinesIndexData), gl.STATIC_DRAW);
	sphLinesIndexBuffer.itemSize = 1;
	sphLinesIndexBuffer.numItems = sphLinesIndexData.length;

	// cylinder
	cylVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cylVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cylVertexPositionData), gl.STATIC_DRAW);
	cylVertexPositionBuffer.itemSize = 3;
	cylVertexPositionBuffer.numItems = cylVertexPositionData.length / 3;
	//    
	cylVertexColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cylVertexColorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cylColorData), gl.STATIC_DRAW);
	cylVertexColorBuffer.itemSize = 4;
	cylVertexColorBuffer.numItems = cylColorData.length / 4;
	//
	cylVertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylVertexIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cylIndexData), gl.STATIC_DRAW);
	cylVertexIndexBuffer.itemSize = 1;
	cylVertexIndexBuffer.numItems = cylIndexData.length;
	// cyl lines 
	cylLinesIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylLinesIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cylLinesIndexData), gl.STATIC_DRAW);
	cylLinesIndexBuffer.itemSize = 1;
	cylLinesIndexBuffer.numItems = cylLinesIndexData.length;


	//Cone
	coneVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, coneVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coneVertexPositionData), gl.STATIC_DRAW);
	coneVertexPositionBuffer.itemSize = 3;
	coneVertexPositionBuffer.numItems = coneVertexPositionData.length / 3;

	//color     
	coneVertexColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, coneVertexColorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coneColorData), gl.STATIC_DRAW);
	coneVertexColorBuffer.itemSize = 4;
	coneVertexColorBuffer.numItems = coneColorData.length / 4;

	coneVertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, coneVertexIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(coneIndexData), gl.STATIC_DRAW);
	coneVertexIndexBuffer.itemSize = 1;
	coneVertexIndexBuffer.numItems = coneIndexData.length;
	//cone lines
	coneLinesIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, coneLinesIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(coneLinesIndexData), gl.STATIC_DRAW);
	coneLinesIndexBuffer.itemSize = 1;
	coneLinesIndexBuffer.numItems = coneLinesIndexData.length;
}


function degToRad(degrees) {
	return degrees * Math.PI / 180;
}

function radToDeg(rad) {
	return rad * 180;
}

// transform and projection matrix
var mvMatrix, pMatrix;
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


function setMatrixUniforms() {
	gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
	gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}

///////////////////////////////////////////////////////////////////////////////////////////////////
// Rendering/Drawing Program
///////////////////////////////////////////////////////////////////////////////////////////////////
function drawScene() {
	console.log("Drawing Scene");
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	for (var jj = 0; jj < objCount; jj++) {
		var type = objList[jj].type;
		var mode = objList[jj].mode;
		var translation = objList[jj].translation;
		var rotation = objList[jj].rotation;
		var scalexyz = objList[jj].scale;

		// try gl-matrix
		var temp = mat4.create();

		mvMatrix = mat4.create();

		mat4.scale(temp, mvMatrix, scalexyz);

		//x axis rotation
		mat4.rotateX(mvMatrix, temp, degToRad(rotation[0]));

		//y axis rotation
		mat4.rotateY(temp, mvMatrix, degToRad(rotation[1]));
		//z axis rotation
		mat4.rotateZ(mvMatrix, temp, degToRad(rotation[2]));

		mat4.translate(temp, mvMatrix, translation);
		var lookat = mat4.create();

		// eye position/coordinate system
		mat4.lookAt(lookat, eyePos, atPoint, upVector);

		mat4.multiply(mvMatrix, lookat, temp);

		pMatrix = mat4.create();
		
		//console.log("Projection Flag " + gl.projectionFlag);
		if (gl.projectionFlag == 1 ) {
            mat4.ortho(pMatrix, orthoLeft, orthoRight, orthoBottom, orthoTop, orthoNear, orthoFar);
			
		} else {
			mat4.perspective(pMatrix, fov, gl.viewportWidth / gl.viewportHeight, near, far);
		}

		setMatrixUniforms();

		if (type == "Cone") {
			console.log("Drawing: Cone");
			gl.bindBuffer(gl.ARRAY_BUFFER, coneVertexPositionBuffer);
			gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, coneVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

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
				gl.uniform1i(shaderProgram.uRenderModeUniform, 0);
				for (var i = 0; i < coneVertexPositionBuffer.numItems; i += 3) {
					gl.drawArrays(gl.LINE_LOOP, i, 3);
				}

			}

		}
		if (type == "Cylinder") {
			console.log("Drawing: Cylinder");
			gl.bindBuffer(gl.ARRAY_BUFFER, cylVertexPositionBuffer);
			gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cylVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

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
				gl.uniform1i(shaderProgram.uRenderModeUniform, 0);
				for (var i = 0; i < cylVertexPositionBuffer.numItems; i += 3) {
					gl.drawArrays(gl.LINE_LOOP, i, 3);
				}

			}
		}

		if (type == "Sphere") {
			console.log("Drawing: Sphere");
			gl.bindBuffer(gl.ARRAY_BUFFER, sphVertexPositionBuffer);
			gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, sphVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

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
				gl.uniform1i(shaderProgram.uRenderModeUniform, 0);
				for (var i = 0; i < sphVertexPositionBuffer.numItems; i += 3) {
					gl.drawArrays(gl.LINE_LOOP, i, 3);
				}

			}

		}
		//console.log("D "+jj);
	} //for obj
    selected = 0;
} //drawscene

//////////////////////////////////////////////////////////////////////////////////////////////////
// initialization
//////////////////////////////////////////////////////////////////////////////////////////////////
window.onload = init;

function init() {
//
	gen_sphereCords();
	gen_cylinderCords();
	gen_coneCords();

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
		},
		change: function(event) {
			if (event.originalEvent) {
				drawScene();
			}
		}
	});
    
	$("#transZ").slider({
		orientation: "horizontal",
		max: 6,
		min: -20,
		step: 0.1,
		value: defaultZ,
		slide: function(e, ui) {
			transXYZ[2] = ui.value;
			objList[objCount - 1].translation[2] = ui.value;
			$("#transZVal").html(ui.value);
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
	gl.clearColor(0.2, 0.2, 0.2, 1.0);
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
				//console.log("Orthogonal");
                //console.log(gl.projectionFlag);

			} else {
				gl.projectionFlag = 0;
				//console.log("Perspective");
                // console.log(gl.projectionFlag);
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

