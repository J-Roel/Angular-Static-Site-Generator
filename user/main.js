$( document ).ready(function() {


  //ROTATING IMAGE
  function rotateImg(){
      $("header img").css('transform', 'rotate(0deg)');
  }
  window.setTimeout(rotateImg, 1000);


$(function() {
          $('a[href*="#"]:not([href="#"])').click(function() {
            if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
              var target = $(this.hash);
              target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
              if (target.length) {
                $('html, body').animate({
                  scrollTop: target.offset().top
                }, 1000);
                return false;
              }
            }
        });
    });

  setTimeout( function(){
    $('#main-menu').attr('checked','true');
       },3000);





// Original from: http://callmenick.com/post/advanced-parallax-scrolling-effect
window.requestAnimationFrame = window.requestAnimationFrame
															 || window.mozRequestAnimationFrame
															 || window.webkitRequestAnimationFrame
															 || window.msRequestAnimationFrame
															 || function(f){setTimeout(f, 1000/60)}

function doParallax(){
  var parallax = document.querySelectorAll(".parallax"),
      speed = -0.3;

  window.onscroll = function(){
  	

    [].slice.call(parallax).forEach(function(el,i){

			var windowYOffset = window.pageYOffset, elementYOffset = el.offsetTop, elBackgrounPos = "50% " + ((windowYOffset - elementYOffset) * speed) + "px";
      el.style.backgroundPosition = elBackgrounPos;

    });
  };
}
window.addEventListener('scroll', function(){ // on page scroll
	requestAnimationFrame(doParallax) // call doParallax() on next available screen repaint
}, false)

window.addEventListener('resize', function(){ // on window resize
  if($(window).width() < 1000 ){
    console.log("Window too small, removing parallax");
    $(".module").removeClass("parallax");
  } else {
    $(".module").addClass("parallax");
  }
	requestAnimationFrame(doParallax) // call doParallax() on next available screen repaint
}, false)










});//END DOCUMENT ON READY






/* END OF FILE */




