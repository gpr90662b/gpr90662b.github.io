

    $(function() {
     aredSpinner = $( "#aredSpinner" ).spinner({
        min:0,
        max:1,
        step:0.1
    });
    aredSpinner.spinner( "value", alightColor[lightSelected*4]);
    agreenSpinner = $( "#agreenSpinner" ).spinner({
        min:0,
        max:1, 
        step:0.1
    });
    agreenSpinner.spinner( "value", alightColor[lightSelected*4+1]);
    ablueSpinner = $( "#ablueSpinner" ).spinner({
         min:0,
         max:1,
         step:0.05
    });
    ablueSpinner.spinner( "value",alightColor[lightSelected*4+2]);    

  $(function() {
     dredSpinner = $( "#dredSpinner" ).spinner({
        min:0,
        max:1,
        step:0.1
    });
    dredSpinner.spinner( "value", dlightColor[lightSelected*4]);
    dgreenSpinner = $( "#dgreenSpinner" ).spinner({
        min:0,
        max:1, 
        step:0.1
    });
    dgreenSpinner.spinner( "value", dlightColor[lightSelected*4+1]);
    dblueSpinner = $( "#dblueSpinner" ).spinner({
         min:0,
         max:1,
         step:0.05
    });
    dblueSpinner.spinner( "value",dlightColor[lightSelected*4+2]);     
    
    
    $(function() {
     sredSpinner = $( "#sredSpinner" ).spinner({
        min:0,
        max:1,
        step:0.1
    });
    sredSpinner.spinner( "value", slightColor[lightSelected*4]);
    sgreenSpinner = $( "#sgreenSpinner" ).spinner({
        min:0,
        max:1, 
        step:0.1
    });
    sgreenSpinner.spinner( "value", slightColor[lightSelected*4+1]);
    sblueSpinner = $( "#sblueSpinner" ).spinner({
         min:0,
         max:1,
         step:0.05
    });
    sblueSpinner.spinner( "value",slightColor[lightSelected*4+2]);     
       
    
    var  alphaSpinner = $( "#alphaSpinner" ).spinner({min:1, max:1, step:1, disabled:true});
    alphaSpinner.spinner( "value", 1);  
 
   
    $( "#getvalue" ).click(function() {
    lightColor[lightSelected*4] = redSpinner.spinner( "value");
    lightColor[lightSelected*4+1] = greenSpinner.spinner( "value");
    lightColor[lightSelected*4+2] =  blueSpinner.spinner( "value");  
    drawScene();        
    });
    
    // $( "button" ).button();
  });
  
  

// reset spinners
aredSpinner.spinner( "value", alightColor[lightSelected*4]);
agreenSpinner.spinner( "value", alightColor[lightSelected*4+1]);
ablueSpinner.spinner( "value",alightColor[lightSelected*4+2]);  


dredSpinner.spinner( "value", dlightColor[lightSelected*4]);
dgreenSpinner.spinner( "value", dlightColor[lightSelected*4+1]);
dblueSpinner.spinner( "value",dlightColor[lightSelected*4+2]);  


sredSpinner.spinner( "value", slightColor[lightSelected*4]);
sgreenSpinner.spinner( "value", slightColor[lightSelected*4+1]);
sblueSpinner.spinner( "value",slightColor[lightSelected*4+2]);  

