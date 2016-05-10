/* client.js */

var request = require('request');
var cheerio = require('cheerio');
var moment = require('moment');
var bytes = require('bytes');

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
        port: parseInt(protocolPort.split('/')[1]),
        network: network
      });
    });
    cb(null, results);

  });
};

/**
 * Gets all the users connected to an OpenVPN instance
 * @param session Session object that contains the token
 * @param instanceID The ID of the OpenVPN network to use
 * @param cb Callback
 */
var getUsers = function(session, instanceID, cb) {
  request.get({
    url: 'http://' + session.hostname + '/status_openvpn.php',
    headers: {
      'Cookie': 'PHPSESSID=' + session.token
    }
  }, function(err, response) {
    if (err) { cb(err, null); return; }

    var $ = cheerio.load(response.body);
    var results = [];
    results = $('table.sortable[summary=connections]').toArray().map(function(network) {

      var userRows = $(network).find('tr').toArray();
      // chop off the first row and last two
      userRows.shift();
      userRows = userRows.slice(0,-2);

      if (userRows.length === 0) { return []; }

      var users = userRows.map(function(row) {
        var data = $(row).find('td').toArray();

        var connectionTime = $(data[3]).text().trim();
        connectionTime = moment(connectionTime, 'ddd MMMM DD HH:mm:ss YYYY').toDate();
        var bytesSent     =  bytes.parse($(data[4]).text().trim());
        var bytesReceived =  bytes.parse($(data[5]).text().trim());

        return {
          username: $(data[0]).text().trim(),
          realAddress: $(data[1]).text().trim().split(':')[0],
          realPort: parseInt($(data[1]).text().trim().split(':')[1]),
          virtualAddress: $(data[2]).text().trim(),
          connectedSince: connectionTime,
          bytesSent: bytesSent,
          bytesReceived: bytesReceived
        };
      });
      return users;

    });
    cb(null, results[instanceID]);

  });

};

module.exports = {
  getInstances: getInstances,
  getUsers: getUsers
};
