"use strict";
var latDivs = 16;
var lonDivs = 32;

var sphereR = 1.0;
var sphVcords = [];
var sphVertexPosition = [];
var sphVertexPositionBuffer;
var sphVertexColor = [];
var sphVertexColorBuffer;
var sphVertexNormal = [];
var sphVertexNormalBuffer;
var sphVertexIndex = [];
var sphVertexIndexBuffer;

//cylinder
var cylH = 2.0;
var cylR = 1.0;
var cylVcords = [];
var cylVertexPosition = [];
var cylVertexPositionBuffer;
var cylVertexColor = [];
var cylVertexColorBuffer;
var cylVertexNormal = [];
var cylVertexNormalBuffer;
var cylVertexIndex = [];
var cylVertexIndexBuffer;

//cone
var coneH = 2.0;
var coneR = 1.0;
var coneVcords = [];
var coneVertexPosition = [];
var coneVertexPositionBuffer;
var conelVertexColor = [];
var coneVertexColorBuffer;
var coneVertexNormal = [];
var coneVertexNormalBuffer;
var coneVertexIndex = [];
var coneVertexIndexBuffer;

///////////////////////////////////////////////////////////////////////////////////////////////////
//Generate cone coordinates
///////////////////////////////////////////////////////////////////////////////////////////////////
function gen_coneCords() {
	//
	console.log("cone cords.");
    //generate the vertices
	coneVcords.push(0.0, coneH / 2, 0.0);
	conelVertexColor.push(0.0, coneH / 2, 0.0, 1.0);
      for (var lon = 0; lon <=lonDivs ; lon++) {
        var phi = lon * 2 * Math.PI / lonDivs
		var x = coneR * Math.sin(phi);
		var y = -coneH / 2;
		var z = coneR * Math.cos(phi);
		coneVcords.push(x, y, z);
	}
    // store triangle indices and  triangles
	for (var lon = 0; lon < lonDivs + 1; lon++) {
		coneVertexIndex.push(0, lon, lon + 1);
		

		coneVertexPosition.push(coneVcords[0], coneVcords[1], coneVcords[2],
		coneVcords[3 * lon], coneVcords[3 * lon + 1], coneVcords[3 * lon + 2],
		coneVcords[3 * (lon + 1)], coneVcords[3 * (lon + 1) + 1], coneVcords[3 * (lon + 1) + 2]);
        
        //compute normals
        var out = vec3.create();
        computeNormal(out, coneVcords[0], coneVcords[1], coneVcords[2],
		coneVcords[3 * lon], coneVcords[3 * lon + 1], coneVcords[3 * lon + 2],
		coneVcords[3 * (lon + 1)], coneVcords[3 * (lon + 1) + 1], coneVcords[3 * (lon + 1) + 2]);
        
         coneVertexNormal.push(out[0],out[1], out[2], out[0],out[1], out[2], out[0],out[1], out[2]);
        
		conelVertexColor.push(coneVcords[0], coneVcords[1], coneVcords[2], 1.0);
		conelVertexColor.push(Math.abs(coneVcords[3 * lon]), Math.abs(coneVcords[3 * lon + 1]), Math.abs(coneVcords[3 * lon + 2]), 1.0);
        conelVertexColor.push(Math.abs(coneVcords[3 * (lon + 1)]), Math.abs(coneVcords[3 * (lon + 1) + 1]), Math.abs(coneVcords[3 * (lon + 1) + 2]), 1.0);  
	}

	// cap 
	for (var lon = 0; lon < lonDivs + 1; lon++) {
		coneVertexPosition.push(coneVcords[0], -coneVcords[1], coneVcords[2],
		coneVcords[3 * (lon + 1)], coneVcords[3 * (lon + 1) + 1], coneVcords[3 * (lon + 1) + 2],
		coneVcords[3 * lon], coneVcords[3 * lon + 1], coneVcords[3 * lon + 2]);
        
        //compute normals
        var out = vec3.create();
        computeNormal(out,coneVcords[0], -coneVcords[1], coneVcords[2],
		coneVcords[3 * (lon + 1)], coneVcords[3 * (lon + 1) + 1], coneVcords[3 * (lon + 1) + 2],
		coneVcords[3 * lon], coneVcords[3 * lon + 1], coneVcords[3 * lon + 2]);
        
         coneVertexNormal.push(out[0],out[1], out[2], out[0],out[1], out[2], out[0],out[1], out[2]);
        

		conelVertexColor.push(Math.abs(coneVcords[0]), Math.abs(-coneVcords[1]), Math.abs(coneVcords[2]), 1.0);
		conelVertexColor.push(Math.abs(coneVcords[3 * (lon + 1)]), Math.abs(coneVcords[3 * (lon + 1) + 1]), Math.abs(coneVcords[3 * (lon + 1) + 2]), 1.0);
        conelVertexColor.push(Math.abs(coneVcords[3 * lon]), Math.abs(coneVcords[3 * lon + 1]), Math.abs(coneVcords[3 * lon + 2]), 1);
	}
	//console.log(coneVertexPosition.length);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
// Generate cylinder coordinates
/////////////////////////////////////////////////////////////////////////////////////////////////////
function gen_cylinderCords() {
	//generate cylinder coordinates
	console.log("cylinder cords.");
	var ytop = cylH / 2;
	var ybot = -cylH / 2;
    
    for (var lon = 0; lon <=lonDivs ; lon++) {
	
        var phi = lon * 2 * Math.PI / lonDivs
		var x = cylR * Math.sin(phi);
		var z = cylR * Math.cos(phi);
		//store only top cords, bottom cords will be at y= -cylH/2
		cylVcords.push(x, ytop, z);
	}
	
    //store  triangle indices and triangles
	for (var lon = 0; lon < 2 * (lonDivs); lon++) {
		cylVertexIndex.push(lon, lon + 1, lon + 3);
		cylVertexIndex.push(lon, lon + 3, lon + 2);
	}
    // body and two caps
	for (var lon = 0; lon < lonDivs + 1; lon++) {
		cylVertexPosition.push(cylVcords[3 * lon], cylVcords[3 * lon + 1], cylVcords[3 * lon + 2],
		cylVcords[3 * lon], -cylVcords[3 * lon + 1], cylVcords[3 * lon + 2],
		cylVcords[3 * (lon + 1)], cylVcords[3 * (lon + 1) + 1], cylVcords[3 * (lon + 1) + 2]);
        
        //compute normals
        var out = vec3.create();
        computeNormal(out,cylVcords[3 * lon], cylVcords[3 * lon + 1], cylVcords[3 * lon + 2],
		cylVcords[3 * lon], -cylVcords[3 * lon + 1], cylVcords[3 * lon + 2],
		cylVcords[3 * (lon + 1)], cylVcords[3 * (lon + 1) + 1], cylVcords[3 * (lon + 1) + 2] );     
        cylVertexNormal.push(out[0],out[1], out[2], out[0],out[1], out[2], out[0],out[1], out[2]);

		cylVertexColor.push(cylVcords[3 * lon], cylVcords[3 * lon + 1], cylVcords[3 * lon + 2], 1);
		cylVertexColor.push(cylVcords[3 * lon], -cylVcords[3 * lon + 1], cylVcords[3 * lon + 2], 1);
		cylVertexColor.push(cylVcords[3 * (lon + 1)], cylVcords[3 * (lon + 1) + 1], cylVcords[3 * (lon + 1) + 2], 1);
        
        // second triangle
		cylVertexPosition.push(cylVcords[3 * lon], -cylVcords[3 * lon + 1], cylVcords[3 * lon + 2],
		cylVcords[3 * (lon + 1)], -cylVcords[3 * (lon + 1) + 1], cylVcords[3 * (lon + 1) + 2],
		cylVcords[3 * (lon + 1)], cylVcords[3 * (lon + 1) + 1], cylVcords[3 * (lon + 1) + 2]);
        
        computeNormal(out, cylVcords[3 * lon], -cylVcords[3 * lon + 1], cylVcords[3 * lon + 2],
		cylVcords[3 * (lon + 1)], -cylVcords[3 * (lon + 1) + 1], cylVcords[3 * (lon + 1) + 2],
		cylVcords[3 * (lon + 1)], cylVcords[3 * (lon + 1) + 1], cylVcords[3 * (lon + 1) + 2]);
         cylVertexNormal.push(out[0],out[1], out[2], out[0],out[1], out[2], out[0],out[1], out[2]);

		cylVertexColor.push(cylVcords[3 * lon], -cylVcords[3 * lon + 1], cylVcords[3 * lon + 2], 1);
		cylVertexColor.push(cylVcords[3 * (lon + 1)], -cylVcords[3 * (lon + 1) + 1], cylVcords[3 * (lon + 1) + 2], 1);
		cylVertexColor.push(cylVcords[3 * (lon + 1)], cylVcords[3 * (lon + 1) + 1], cylVcords[3 * (lon + 1) + 2], 1);


        //top cap
		cylVertexPosition.push(0, ytop, 0,
		cylVcords[3 * lon], cylVcords[3 * lon + 1], cylVcords[3 * lon + 2],
		cylVcords[3 * (lon + 1)], cylVcords[3 * (lon + 1) + 1], cylVcords[3 * (lon + 1) + 2]);
        
        computeNormal(out, 0, ytop, 0,
		cylVcords[3 * lon], cylVcords[3 * lon + 1], cylVcords[3 * lon + 2],
		cylVcords[3 * (lon + 1)], cylVcords[3 * (lon + 1) + 1], cylVcords[3 * (lon + 1) + 2]);
        cylVertexNormal.push(out[0],out[1], out[2], out[0],out[1], out[2], out[0],out[1], out[2]);

		cylVertexColor.push(0, ytop, 0, 1);
		cylVertexColor.push(cylVcords[3 * lon], cylVcords[3 * lon + 1], cylVcords[3 * lon + 2], 1);
		cylVertexColor.push(cylVcords[3 * (lon + 1)], cylVcords[3 * (lon + 1) + 1], cylVcords[3 * (lon + 1) + 2], 1);
        
        // bottom hub cap
		cylVertexPosition.push(0, ybot, 0,
		cylVcords[3 * (lon + 1)], -cylVcords[3 * (lon + 1) + 1], cylVcords[3 * (lon + 1) + 2],
		cylVcords[3 * lon], -cylVcords[3 * lon + 1], cylVcords[3 * lon + 2]);
        
        computeNormal(0, ybot, 0,
		cylVcords[3 * (lon + 1)], -cylVcords[3 * (lon + 1) + 1], cylVcords[3 * (lon + 1) + 2],
		cylVcords[3 * lon], -cylVcords[3 * lon + 1], cylVcords[3 * lon + 2]);
        cylVertexNormal.push(out[0],out[1], out[2], out[0],out[1], out[2], out[0],out[1], out[2]);


		cylVertexColor.push(0, ybot, 0, 1);
		cylVertexColor.push(cylVcords[3 * (lon + 1)], -cylVcords[3 * (lon + 1) + 1], cylVcords[3 * (lon + 1) + 2], 1);
		cylVertexColor.push(cylVcords[3 * lon], -cylVcords[3 * lon + 1], cylVcords[3 * lon + 2], 1);
	}
	//console.log(cylVertexPosition.length);
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
			
			sphVcords.push([sphereR * x, sphereR * y, sphereR * z]);
		}
	}
	//console.log(sphVcords.length);
	for (var latIndex = 0; latIndex < latDivs; latIndex++) {
		for (var lonIndex = 0; lonIndex < lonDivs; lonIndex++) {

			var first = (latIndex * (lonDivs + 1)) + lonIndex;
			var second = first + lonDivs + 1;
            
            //first triangle
			sphVertexIndex.push(first);
			sphVertexIndex.push(second);
			sphVertexIndex.push(first + 1);

            //position
			sphVertexPosition.push(sphVcords[first][0], sphVcords[first][1], sphVcords[first][2],
			sphVcords[second][0], sphVcords[second][1], sphVcords[second][2],
			sphVcords[first + 1][0], sphVcords[first + 1][1], sphVcords[first + 1][2]);
            
            //normal
            sphVertexNormal.push(sphVcords[first][0], sphVcords[first][1], sphVcords[first][2],
			sphVcords[second][0], sphVcords[second][1], sphVcords[second][2],
			sphVcords[first + 1][0], sphVcords[first + 1][1], sphVcords[first + 1][2]);
 
            //color
			sphVertexColor.push(sphVcords[first][0], sphVcords[first][1], sphVcords[first][2], 1.0);
			sphVertexColor.push(sphVcords[second][0], sphVcords[second][1], sphVcords[second][2], 1.0);
			sphVertexColor.push(sphVcords[first + 1][0], sphVcords[first + 1][1], sphVcords[first + 1][2], 1.0);

			
            //second triangle
			sphVertexIndex.push(second);
			sphVertexIndex.push(second + 1);
			sphVertexIndex.push(first + 1);
            
            //position
			sphVertexPosition.push(sphVcords[second][0], sphVcords[second][1], sphVcords[second][2],
			sphVcords[second + 1][0], sphVcords[second + 1][1], sphVcords[second + 1][2],
			sphVcords[first + 1][0], sphVcords[first + 1][1], sphVcords[first + 1][2]);
            
            //normal
            sphVertexNormal.push(sphVcords[second][0], sphVcords[second][1], sphVcords[second][2],
			sphVcords[second + 1][0], sphVcords[second + 1][1], sphVcords[second + 1][2],
			sphVcords[first + 1][0], sphVcords[first + 1][1], sphVcords[first + 1][2]);
            
            //color
			sphVertexColor.push(sphVcords[second][0], sphVcords[second][1], sphVcords[second][2], 1.0);
			sphVertexColor.push(sphVcords[second + 1][0], sphVcords[second + 1][1], sphVcords[second + 1][2], 1.0);
			sphVertexColor.push(sphVcords[first + 1][0], sphVcords[first + 1][1], sphVcords[first + 1][2], 1.0);

		}
	}
	//console.log(sphVertexPosition.length);
}