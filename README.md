# pfsense-openvpn

Gets VPN and user information for OpenVPN instances hosted by a pfSense host.

# Installation

    npm install pfsense-session # peer dependency
    npm install pfsense-openvpn

# Functions

`getInstances` - Gets a list of OpenVPN networks. Returns via callback an array of 
objects with the following properties:

* id
* enabled (Boolean)
* protocol (TCP or UDP)
* port (Number)
* network (String, CIDR notation)

Example: 

    var client = require('pfsense-openvpn');
    var pfSenseSession = require('pfsense-session');

    pfSenseSession.login('10.0.1.1', 'admin', 'pfsense', function(err, session) {
      client.getInstances(session, function(err, instances) {
        if (err) { console.log(err); }
        else {
          console.log(instances);
        }
      });
    });
