function MenuClass(parentElem) {
  //Deps
  this.http = new HttpClass();
  this.html = new HtmlClass();

  this.isMenuOpen = false;
  this.links = [];
  this.parent = parentElem;
  this.templates = {};
  this.currentTemplate = null;
  this.currentTemplateName = null;

  this.html.click('#menu-mobile-button', MenuClass.prototype.showHideMenu.bind(this));
}

MenuClass.prototype.updateLink = function() {
  var link;

  for(var i = 0; i < this.links.length; i++) {
    link = this.links[i];

    if (link.className.indexOf('is-current')) {
      link.className = link.className.replace('is-current', '');
    }

    if (link.getAttribute('href') === location.hash) {
      link.className += ' is-current';
    }
  }
}

MenuClass.prototype.add = function(name, url) {
  var tmplParent = document.createElement("div");
  this.parent.appendChild(tmplParent);

  this.templates[name] = {
    templateUrl: url,
    templateParent: tmplParent,
    isLoaded: false
  };

  this.templates[name].templateParent.style.display = 'none';
}

MenuClass.prototype.show = function(name) {
  if (!this.templates[name].isLoaded) {
    this.http.get(this.templates[name].templateUrl, function(data) {
      this.templates[name].isLoaded = true;
      this.templates[name].templateParent.innerHTML = data;
      this.show(name);
    }.bind(this));
    return;
  }

  if (this.currentTemplateName !== name) {
    if (this.currentTemplate) {
      this.currentTemplate.style.display = 'none';
    }

    this.currentTemplateName = name;
    this.currentTemplate = this.templates[name].templateParent;
    this.currentTemplate.style.display = 'block';

    this.links = this.currentTemplate.getElementsByClassName('menu-links-item');
    for(var i = 0; i < this.links.length; i++) {
      link = this.links[i];

      this.html.click(link, function() {
        if (this.isMenuOpen) {
          this.showHideMenu();
        }
      }.bind(this));
    }

    this.updateLink();
  }
}

MenuClass.prototype.showHideMenu = function() {
  var body =  document.body,
    menu = this.html.select('#menu'),
    menuMobile = this.html.select('#menu-mobile'),
    menuMobileOverlay = this.html.select('#menu-mobile-overlay');

  if (this.isMenuOpen) {
    this.isMenuOpen = false;
    body.className = body.className.replace(' no-scroll');
    menu.className = menu.className.replace(' show', '');
    menuMobile.className = menuMobile.className.replace(' show', '');
    menuMobileOverlay.className = menuMobileOverlay.className.replace(' show', '');
    setTimeout(function() {
      menuMobileOverlay.style.display = 'none';
    }.bind(this), 250);
  } else {
    this.isMenuOpen = true;
    body.className += ' no-scroll';
    menu.className += ' show';
    menuMobile.className += ' show';
    menuMobileOverlay.style.display = 'block';
    setTimeout(function() {
      menuMobileOverlay.className += ' show';
    }.bind(this), 10);
  }
}