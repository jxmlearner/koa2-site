function common() {
    $(".navbar-burger").on('click',function(){
      var target=$(this).data('target')
      console.log(target)
      $(this).toggleClass('is-active')
      $('#'+target).toggleClass('is-active')
    })
}

$(function(){
  common()

  $(window).scroll(function(e){     //窗体滚动条事件
    var h=$(window).scrollTop()
    if(h>200){
      //$('#gotoTop').fadeIn()
      $('#gotoTop').css({display:'block'})   //因为li有transition all的样式控制，所以js不用fadeIn()效果，用了反而有闪烁
    }else{
      $('#gotoTop').fadeOut()
    }
  })
  $("#gotoTop").on('click',function(){   //回到顶部事件
    $("html,body").animate({scrollTop:0},200)
  })
})

