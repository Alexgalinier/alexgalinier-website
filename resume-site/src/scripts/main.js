var App = {
  start: function() {
    //Init
    var Html = new HtmlClass(),
      Http = new HttpClass(),
      Router, Content, Menu, LangSwitcher;

    //Events
    Html.click('#header-mail-contact', function() {
      this.href = 'mailto:' + 'contact' + '@' + 'alexgalinier.com';
    });

    //Lang Switcher
    LangSwitcher = new LangSwitcherClass();

    //Menu
    Menu = new MenuClass(Html.select('#menu-links'));
    Menu.add('fr', 'templates/fr/_menu.html');
    Menu.add('en', 'templates/en/_menu.html');

    //Content
    Content = new ContentClass(Html.select("#content-parent"));
      //FR
    Content.add('resume-profile', 'templates/fr/profil.html');
    Content.add('resume-exp', 'templates/fr/experiences.html');
    Content.add('resume-skills', 'templates/fr/skills.html');
    Content.add('resume-education', 'templates/fr/education.html');
    Content.add('resume-notables', 'templates/fr/notables.html');
    Content.add('resume-references', 'templates/fr/references.html');
    Content.add('resume-hobbies', 'templates/fr/hobbies.html');
    Content.add('logos', 'templates/fr/logos.html');
      //EN
    Content.add('resume-en-profile', 'templates/en/profil.html');
    Content.add('resume-en-exp', 'templates/en/experiences.html');
    Content.add('resume-en-skills', 'templates/en/skills.html');
    Content.add('resume-en-education', 'templates/en/education.html');
    Content.add('resume-en-notables', 'templates/en/notables.html');
    Content.add('resume-en-references', 'templates/en/references.html');
    Content.add('resume-en-hobbies', 'templates/en/hobbies.html');
    Content.add('logos-en', 'templates/en/logos.html');

    //Routing
    Router = new RouterClass();
      //FR
    Router.add('/fr/profil', function() {Content.show('resume-profile'); Menu.show('fr'); LangSwitcher.switchToLang('fr');});
    Router.add('/fr/experiences', function() {Content.show('resume-exp'); Menu.show('fr'); LangSwitcher.switchToLang('fr');});
    Router.add('/fr/competences', function() {Content.show('resume-skills'); Menu.show('fr'); LangSwitcher.switchToLang('fr');});
    Router.add('/fr/formations', function() {Content.show('resume-education'); Menu.show('fr'); LangSwitcher.switchToLang('fr');});
    Router.add('/fr/projets-notables', function() {Content.show('resume-notables'); Menu.show('fr'); LangSwitcher.switchToLang('fr');});
    Router.add('/fr/references', function() {
      Content.show('resume-references', function() {
        Html.click('#contact-fr-alexis', function() {
          this.href = 'mailto:' + 'a.lesage' + '@' + 'intent-technologies.eu';
        });
        Html.click('#contact-fr-seb', function() {
          this.href = 'mailto:' + 's.balard' + '@' + 'onelight-studio.com';
        });
        Html.click('#contact-fr-marianne', function() {
          this.href = 'mailto:' + 'comlilly' + '@' + 'gmail.com';
        });
      });
      Menu.show('fr');
      LangSwitcher.switchToLang('fr');
    });
    Router.add('/fr/hobbies', function() {Content.show('resume-hobbies'); Menu.show('fr'); LangSwitcher.switchToLang('fr');});
    Router.add('/fr/logos', function() {Content.show('logos'); Menu.show('fr'); LangSwitcher.switchToLang('fr');});
      //EN
    Router.add('/en/profile', function() {Content.show('resume-en-profile'); Menu.show('en'); LangSwitcher.switchToLang('en');});
    Router.add('/en/experiences', function() {Content.show('resume-en-exp'); Menu.show('en'); LangSwitcher.switchToLang('en');});
    Router.add('/en/skills', function() {Content.show('resume-en-skills'); Menu.show('en'); LangSwitcher.switchToLang('en');});
    Router.add('/en/studies', function() {Content.show('resume-en-education'); Menu.show('en'); LangSwitcher.switchToLang('en');});
    Router.add('/en/notables', function() {Content.show('resume-en-notables'); Menu.show('en'); LangSwitcher.switchToLang('en');});
    Router.add('/en/references', function() {
      Content.show('resume-en-references', function() {
        Html.click('#contact-alexis', function() {
          this.href = 'mailto:' + 'a.lesage' + '@' + 'intent-technologies.eu';
        });
        Html.click('#contact-seb', function() {
          this.href = 'mailto:' + 's.balard' + '@' + 'onelight-studio.com';
        });
        Html.click('#contact-marianne', function() {
          this.href = 'mailto:' + 'comlilly' + '@' + 'gmail.com';
        });
      });
      Menu.show('en');
      LangSwitcher.switchToLang('en');
    });
    Router.add('/en/hobbies', function() {Content.show('resume-en-hobbies'); Menu.show('en'); LangSwitcher.switchToLang('en');});
    Router.add('/en/logos', function() {Content.show('logos-en'); Menu.show('en'); LangSwitcher.switchToLang('en');});

    Router.onRouteChange(function() {
      Menu.updateLink();
      Html.select('#content').scrollTop = 0;
      document.body.scrollTop = 0;
    });

    Http.get('http://alexgalinier.com/lang.php', function(data) {
      var res = JSON.parse(data);
      if (res.lang == 'en') {
        Router.otherwise('/en/profile');
      } else {
        Router.otherwise('/fr/profil');
      }
      Router.start();
    })
  }
}