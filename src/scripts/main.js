// Slider
$(".proyectoTarjeta__slider").slick({
  fade: true,
  infinite: false,
  cssEase: "linear",
  autoplay: true,
  autoplaySpeed: 4000,
  prevArrow:
    '<i class="proyectoTarjeta__sliderArrowBack ion-ios-arrow-back"></i>',
  nextArrow:
    '<i class="proyectoTarjeta__sliderArrowForward ion-ios-arrow-forward"></i>'
});

if ( 'serviceWorker' in navigator ) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('./sw.js')
      .then( function(registration) {
        console.log(
          'Service Worker registrado con éxito',
          registration.scope
        )
      })
      .catch( function(err) { 
        console.log('Registro de Service Worker fallo ', err)
      } )
  })

}