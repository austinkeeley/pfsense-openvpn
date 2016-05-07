/* client.js */

var request = require('request');
var cheerio = require('cheerio');

/**
 * Gets all the OpenVPN instances running on this pfSense host
 */
var getInstances = function(session, cb) {
  request.get({
    url: 'http://' + session.hostname + '/vpn_openvpn_server.php',
    headers: {
      'Cookie': 'PHPSESSID=' + session.token
    }
  }, function(err, response) {
    if (err) { cb(err, null); return; }

    var $ = cheerio.load(response.body);
    var results = [];
    var id = 0;
    $('.sortable > tbody > tr').map(function(index, row) {
      // This table has a hidden row that we can just ignore.
      var display = $(row).css('display');
      if (display === "none") { return null; }

      var cols = [];
      $(row).find('td').each(function(index, col) {
          cols.push($(col).text());
      });
      var disabled = cols[0].trim();
      var protocolPort = cols[1].trim();
      var network = cols[2].trim();

      results.push({
        id: id++,
        enabled: disabled === 'NO',
        protocol: protocolPort.split('/')[0].trim(),
        port: protocolPort.split('/')[1].trim(),
        network: network
      });
    });
    cb(null, results);

  });
};

/**
 * Gets all the users connected to an OpenVPN instance
 */
var getUsers = function(session, instance, cb) {
};

module.exports = {
  getInstances: getInstances,
  getUsers: getUsers
};
