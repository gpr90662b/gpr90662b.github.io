// Change nav background from tranparent to solid
    $(document).ready(function(){
      $(window).scroll(function(){
         //console.log($(window).scrollTop());
          if ( $(window).scrollTop() > $(header).height() - $('.navbar').height() ) {
            $(".navbar").css("background-color", "rgba(0,0,0,1)");
          }
          else {
           $(".navbar").css("background-color", "rgba(0,0,0,0)");
           }
          
      });
   });
 