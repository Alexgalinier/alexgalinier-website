function HttpClass() {}

HttpClass.prototype.get = function(url, callback) {
  var aReq = new XMLHttpRequest();
  aReq.onload = function() {
    callback(this.responseText);
  };
  aReq.open("get", url, true);
  aReq.send();
}