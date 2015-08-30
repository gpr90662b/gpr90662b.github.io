 var arr = [0.3,0.6,0.5];
 var shininess = 50;
 
  $(function() {
   
    var redSpinner = $( "#redSpinner" ).spinner(
    {min:0,
    max:1,
    step:0.05
    
    });
    
     redSpinner.spinner( "value", arr[0]);
    var greenSpinner = $( "#greenSpinner" ).spinner({min:0, max:1, step:0.05});
    greenSpinner.spinner( "value", arr[1]);
    
     var blueSpinner = $( "#blueSpinner" ).spinner({min:0, max:1, step:0.05});
    blueSpinner.spinner( "value", arr[2]);     
    
    var blueSpinner = $( "#alphaSpinner" ).spinner({min:1, max:1, step:1});
    blueSpinner.spinner( "value", arr[2]);     
    
     var shineSpinner = $( "#shineSpinner" ).spinner({min:10, max:200, step:10});
    shineSpinner.spinner( "value", shininess);  
 
   
    $( "#getvalue" ).click(function() {
    arr[0] = redSpinner.spinner( "value");
    arr[1] = greenSpinner.spinner( "value");
    arr[2] =  blueSpinner.spinner( "value");  
    shininess =  shineSpinner.spinner( "value");  
        for (var i=0; i<3; i++) {
        console.log(arr[i]);
        }
        console.log(shininess);
        var xvec = -arr;
        console.log(xvec);
        
    });
    
    $( "button" ).button();
  });