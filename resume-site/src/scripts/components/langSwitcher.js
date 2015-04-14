function LangSwitcherClass() {
  //deps
  this.html = new HtmlClass();

  this.currentLang = null;
  this.langToFrButton = this.html.select('#switch-to-fr');
  this.langToEnButton = this.html.select('#switch-to-en');

  this.html.click(this.langToFrButton, function() {
    this.switchToLangUrl('fr');
  }.bind(this));

  this.html.click(this.langToEnButton, function() {
    this.switchToLangUrl('en');
  }.bind(this));
}

LangSwitcherClass.prototype.switchToLangUrl = function(lang) {
  if (this.currentLang !== lang) {
    var url, hash = location.hash;

    switch(lang) {
      case 'fr':
        if (hash === '#/en/profile') url = '#/fr/profil';
        if (hash === '#/en/experiences') url = '#/fr/experiences';
        if (hash === '#/en/skills') url = '#/fr/competences';
        if (hash === '#/en/studies') url = '#/fr/formations';
        if (hash === '#/en/notables') url = '#/fr/projets-notables';
        if (hash === '#/en/references') url = '#/fr/references';
        if (hash === '#/en/hobbies') url = '#/fr/hobbies';
        if (hash === '#/en/contact') url = '#/fr/contact';
        if (hash === '#/en/logos') url = '#/fr/logos';
        break;
      case 'en':
        if (hash === '#/fr/profil') url = '#/en/profile';
        if (hash === '#/fr/experiences') url = '#/en/experiences';
        if (hash === '#/fr/competences') url = '#/en/skills';
        if (hash === '#/fr/formations') url = '#/en/studies';
        if (hash === '#/fr/projets-notables') url = '/en/notables';
        if (hash === '#/fr/references') url = '/en/references';
        if (hash === '#/fr/hobbies') url = '#/en/hobbies';
        if (hash === '#/fr/contact') url = '#/en/contact';
        if (hash === '#/fr/logos') url = '#/en/logos';
        break;
    }

    location.hash = url;
  }
}

LangSwitcherClass.prototype.switchToLang = function(lang) {
  if (this.currentLang !== lang) {
    this.currentLang = lang;

    switch(lang) {
      case 'fr':
        this.langToFrButton.className += ' is-current';
        this.langToEnButton.className = this.langToEnButton.className.replace(' is-current', '');
        break;
      case 'en':
        this.langToEnButton.className += ' is-current';
        this.langToFrButton.className = this.langToEnButton.className.replace(' is-current', '');
        break;
    }
  }
}