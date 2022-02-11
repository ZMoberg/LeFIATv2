let swiper = new Swiper('.swiper-container', {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    coverflowEffect: {
      rotate: 20,
      stretch: 0,
      depth: 200,
      modifier: 1,
      slideShadows: true,
    },
    loop: true
  });


  // search function

$(document).ready(function(){
  $('.search-icon').click(function(){
    $('.search-icon').toggleClass('active')//Search Icon Change OnClick
    $('.search-box').toggleClass('active')
    $('.search-container').toggleClass('active')//box show WHen Click Icon
  })
}); 


// Signup button flash 


const alertPlaceholder = document.getElementById("liveAlertPlaceholder");
  function alert(message, type) {
    var wrapper = document.createElement("div");
    wrapper.innerHTML =
      '<div class="alert alert-' +
      type +
      ' alert-dismissible" role="alert">' +
      message +
      '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';

    alertPlaceholder.append(wrapper);
  }
  if (window.location.search.indexOf("?email=") > -1) {
    alert("Email Submitted Successfully!", "light");
  }
