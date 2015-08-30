function drawScene() {
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
