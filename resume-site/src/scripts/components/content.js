function ContentClass(parentElem) {
  //Deps
  this.http = new HttpClass();
  this.html = new HtmlClass();

  //Properties
  this.parent = parentElem;
  this.templates = {};
  this.currentTemplate = null;
}

ContentClass.prototype.add = function(name, url) {
  var tmplParent = document.createElement("div");
  this.parent.appendChild(tmplParent);

  this.templates[name] = {
    templateUrl: url,
    templateParent: tmplParent,
    isLoaded: false
  };

  this.templates[name].templateParent.style.display = 'none';
}

ContentClass.prototype.show = function(name, callback) {
  if (!this.templates[name].isLoaded) {
    this.http.get(this.templates[name].templateUrl, function(data) {
      this.templates[name].isLoaded = true;
      this.templates[name].templateParent.innerHTML = data;

      if (callback) {
        callback();
      }

      this.show(name);
    }.bind(this));
    return;
  }

  if (this.currentTemplate) {
    this.currentTemplate.style.display = 'none';
  }

  this.currentTemplate = this.templates[name].templateParent;
  this.currentTemplate.style.display = 'block';
}