// DNS override wrapper - runs fetch-tmdb.js with Google DNS
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Also override the default resolver
const { Resolver } = require('dns');
const resolver = new Resolver();
resolver.setServers(['8.8.8.8', '8.8.4.4']);

// Patch global dns to use Google DNS
const originalResolveSrv = dns.resolveSrv.bind(dns);
const originalResolve = dns.resolve.bind(dns);
const originalLookup = dns.lookup.bind(dns);

console.log('DNS set to Google (8.8.8.8). Starting fetch-tmdb.js...\n');

require('./fetch-tmdb.js');
