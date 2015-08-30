///////////////////////////////////////////////////////////////////////////////
    //******************************************************************************
function viewSpinners() {
    $(function() {
     xeyeSpinner = $( "#xeyeSpinner" ).spinner({
        min:0,
        max:1,
        step:0.1
    });
    xeyeSpinner.spinner( "value", eyePos[0]);
    
      yeyeSpinner = $( "#yeyeSpinner" ).spinner({
        min:0,
        max:1,
        step:0.1
    });
    yeyeSpinner.spinner( "value", eyePos[1]);
    
    zeyeSpinner = $( "#zeyeSpinner" ).spinner({
        min:0,
        max:1,
        step:0.1
    });
    zeyeSpinner.spinner( "value", eyePos[2]);
    
    });

  $(function() {
  
  xatSpinner = $( "#xatSpinner" ).spinner({
        min:0,
        max:1, 
        step:0.1
    });
    xatSpinner.spinner( "value", atPoint[0]);
    
    yatSpinner = $( "#yatSpinner" ).spinner({
        min:0,
        max:1, 
        step:0.1
    });
    yatSpinner.spinner( "value", atPoint[1]);
   
    
    zatSpinner = $( "#zatSpinner" ).spinner({
        min:0,
        max:1, 
        step:0.1
    });
    zatSpinner.spinner( "value", atPoint[2]);
    
  });
    
    $(function() {
     xupSpinner = $( "#xupSpinner" ).spinner({
         min:0,
         max:1,
         step:0.05
    });
    xupSpinner.spinner( "value", upVector[0]);   
    
     yupSpinner = $( "#yupSpinner" ).spinner({
         min:0,
         max:1,
         step:0.05
    });
    yupSpinner.spinner( "value",upVector[1]);     
  });
    zupSpinner = $( "#zupSpinner" ).spinner({
         min:0,
         max:1,
         step:0.05
    });
    zupSpinner.spinner( "value",upVector[2]);   
    });
    
    }
    //******************************************************************************
    ///////////////////////////////////////////////////////////////////////////////