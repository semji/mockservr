const pid = process && process.pid ? process.pid.toString(36) : '' ;

function now() {
  const time = Date.now();
  const last = now.last || time;
  return (now.last = time > last ? time : last + 1);
}

module.exports = module.exports.default = function(prefix) {
  return (prefix || '') + pid + now().toString(36);
};
