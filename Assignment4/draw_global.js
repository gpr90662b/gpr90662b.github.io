///////////////////////////////////////////////////////////////////////////////////////////////////
// Rendering/Drawing Program
///////////////////////////////////////////////////////////////////////////////////////////////////
var dely = 0;
function draw_globalTrans() {
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	//console.log("Draw Global");
	
	for (var index = 0; index < objCount; index++) {
		var type = objList[index].type;
		var mode = objList[index].mode;
        //
        var objMatrix = objList[index].transform;
        
        
        // We are using gl-matrix.js  for matrix/vector routines
        //model transforms, scale first    
            mat4.identity(modelMatrix);
             //translate
            mat4.translate(modelMatrix, modelMatrix, gtransXYZ); 
            //x axis rotation          
            mat4.rotate(modelMatrix, modelMatrix, degToRad(grotXYZ[0]), [1,0,0] );
            //y axis rotation
            mat4.rotate(modelMatrix, modelMatrix, degToRad(grotXYZ[1]), [0,1,0]);
            //z axis rotation  
            mat4.rotate(modelMatrix, modelMatrix, degToRad(grotXYZ[2]), [0,0,1]);
                        
            mat4.scale(modelMatrix, modelMatrix, gscaleXYZ);
            
            mat4.multiply(modelMatrix, objMatrix, modelMatrix);
        //clone the model  matrix for this object and  save it
        //objList[index].transform = mat4.clone(modelMatrix);
   
     
        //Look AT Matrix / View Matrix
        mat4.identity(lookatMatrix);
		mat4.lookAt(lookatMatrix, eyePos, atPoint, upVector);
        
        //modelview matrix
            mat4.multiply(mvMatrix, lookatMatrix, modelMatrix);

        // normal transform matrix, inverse transform of  mvMatrix
            mat3.normalFromMat4( normalMatrix, mvMatrix);
       //console.log("Draw Global");
        // transform the light positions by lookat matrix, lights are in word co-ordinates
        transformLights(lookatMatrix, transLightPos, lightPosition, numUsed);
                
         //set the uniforms and draw
       setUniformsAndDraw(index, type, mode);
       angle += 5;
  
	} //for obj
    selected = 0;
} //drawscene
