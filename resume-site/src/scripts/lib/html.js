//Class
function HtmlClass() {
  //Things to init
}

HtmlClass.prototype.select = function(key, elem) {
  var keys =  key.split(' '),
    currentKey = keys[0],
    selectedElements;

  //Remove currentKey
  keys.splice(0, 1);

  if (!elem) {
    elem = document;
  }

  //id
  if (currentKey.indexOf('#') === 0) {
    selectedElements = elem.getElementById(currentKey.substr(1));
  }
  //class
  if (currentKey.indexOf('.') === 0) {
    selectedElements = elem.getElementsByClassName(currentKey.substr(1));
  }

  if (keys.length === 0) {
    return selectedElements;
  } else {
    return this.select(keys.join(' '), selectedElements);
  }
}

HtmlClass.prototype.click = function(selectorOrElement, callback) {
  if (typeof selectorOrElement === 'string') {
    selectorOrElement = this.select(selectorOrElement);
  }

  selectorOrElement.addEventListener('click', callback);
  return callback;
}