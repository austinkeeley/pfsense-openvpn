# pfsense-openvpn

Gets VPN and user information for OpenVPN instances hosted by a pfSense host.

# Installation

    npm install pfsense-session # peer dependency
    npm install pfsense-openvpn

# Functions

`getInstances` - Gets a list of OpenVPN networks. Returns via callback an array of 
objects with the following properties:

* id (Number)
* enabled (Boolean)
* protocol (TCP or UDP)
* port (Number)
* network (String, CIDR notation)

Parameters:
* cb(err, instances) - Callback function that returns the instances



`getUsers` - Gets a list of users connected to an OpenVPN instance. Returns via 
callback an array of objects with the following properties:

* username (String)
* realAddress (String)
* realPort (Number)
* virtualAddress (String)
* connectedSince (Date)
* bytesSent (Number)
* bytesReceived

Parameters:
* instanceID - The OpenVPN network ID
* cb(err, users) - Callback function that returns the array of users


