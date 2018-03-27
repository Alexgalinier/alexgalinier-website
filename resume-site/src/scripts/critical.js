if (location.protocol != 'https:' && location.hostname !== 'localhost') {
  location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
}

window.onload = function() {
  //If not IE lower than 10
  if (document.getElementById('browserupgrade') === null) {
    var loaderStart = new Date().getTime();
    var fileLoader = {
      'alexgalinier.css': false,
      'alexgalinier.js': false,
      'fonts': false
    }
    var img;

    //Load profil photo
    img = new Image();
    img.className = "photo-profil"

    img.onload = function () {
      document.getElementById('menu').insertBefore(img, document.getElementById('menu').firstChild);
    };
    img.src = 'https://alexgalinier.com/static/images/mea_300x300.jpg';


    lazy.load(['alexgalinier.css'], function() {
      fileLoader['alexgalinier.css'] = true;
      isAllDone();
    });

    lazy.load(['alexgalinier.js'], function() {
      fileLoader['alexgalinier.js'] = true;
      isAllDone();
    });

    WebFont.load({
      google: {
        families: ['Roboto Slab:700', 'Roboto:300,300italic']
      },
      active: function() {
        fileLoader['fonts'] = true;
        isAllDone();
      }
    });

    function isAllDone() {
      for(var key in fileLoader) {
        if (!fileLoader[key]) {
          return;
        }
      }

      var loadingTime = (new Date().getTime()) - loaderStart;

      setTimeout(function() {
        document.getElementById('loader-wrapper').className = 'done';

        setTimeout(function() {
          document.getElementById('alexgalinier-site').style.display = 'block';

          setTimeout(function() {
            document.getElementById('alexgalinier-site').className = 'anim-show';
            App.start();
          }, 50);

          setTimeout(function() {
            document.getElementById('loader-wrapper').style.display = 'none';
          }, 500);
        }, 1500);
      }, (loadingTime < 1000) ? 1000 - loadingTime : 0);
    }
  }
}