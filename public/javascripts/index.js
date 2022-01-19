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
    $('.search-box').toggleClass('active')//box show WHen Click Icon
  })
}); 