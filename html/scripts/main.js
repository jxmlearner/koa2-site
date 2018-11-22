$(function () {
  var mySwiper = new Swiper('.swiper-container', {
    //direction: 'vertical', // 垂直切换选项
    loop: true, // 循环模式选项
    autoplay: true,
    // 如果需要分页器
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    // 如果需要前进后退按钮
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    // breakpoints: {
    //   //当宽度小于等于480
    //   640: {
    //     spaceBetween: 20
    //   },
    //   //当宽度小于等于640
    //   980: {
    //     spaceBetween: 30
    //   }
    // }
  })
})
