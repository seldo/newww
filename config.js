var path = require('path'),
    fs = require('fs'),
    util = require('util'),
    os = require('os'),
    Hoek = require('hoek');

var config = module.exports = {};

config.port = process.env.PORT || 15443;
config.host = "localhost";
// config.host = '0.0.0.0'
config.canonicalHost = util.format("https://localhost:%d", config.port);

config.server = {
  cache: {
    engine: require('catbox-redis'),
    host: '127.0.0.1',
    port: '16379',
    // password: 'i-am-using-redis-in-development-mode-for-npm-www'
  },
  connections: {
    router: {
      stripTrailingSlash: true
    },
    routes: {
      security: {
        hsts: {
          maxAge: 1000 * 60 * 60 * 24 * 30,
          includeSubdomains: true
        },
        xframe: true
      }
    }
  }
};

config.connection = {
  host: config.host,
  port: config.port
};

if (process.env.NODE_ENV === 'dev') {
  config.connection.tls = {
      ca: [],
      key: "-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA1IYcqR58TLSk1SCMlkXI/DmEDYZZarFUuB5L5cBYjU+uY62W\nAuRR8bVfVzNCRHA9pOt8fp+Ghu9U2L094jidSlLSE4p9XXw1VdOI5UZI+dlLBpc7\n+Jgt4awBulhWpojMo44iqyan+iSTnK9oqlRiMOTBGyxpSJfBftx1prUy7N06D8dI\nUiw2tzhizYNbvZ7GBXBDs2w4swfkZ16+HsMArc2yNDEDsgNCw1DyGMU/L3llaG2T\n70N3Ls+Fn/7KTkgtcyY2m7N4PIX5tvsH4zjm7OZrWXNFpHi8ElQ09+/Z9VPgLDGL\nwxNqZ3E8mobGciQTJ5KXk+S7R3X9OFuB91zkZwIDAQABAoIBAQCj2W35WT6d6Nv4\nUSrypITrKPDNeJoxrtxRQ1JipOPgtuENioRQYHVo89u4oBVkLGDqaH/II/eUyqpQ\nm749Tka+SZIbbLdwvtVkAT3W/lQ/BK9aOnkLFVCyX2nJoFfV9zxGkMvbxmbVbSO9\nNmNshrhZV9QlvhzB0fZld1ThnWvQvuoO5Vee6VJPcaKVX92LRtFph8bZzA8QRbqg\nBoSckVTsPlmNZINEK/ubrG7njc3ljPfhCgL8aftdR6M40yGgk0APUyyxe8+fOc3Z\n9/wd8iEF1pzoi4XbQexm+XF1gU2PF/QVAtisTW3Cq7gxOhUGvY2lmt0UWEWmJfC1\nq4ci2h8BAoGBAP4CNQrXtpKSNjEo9HTyKmJ2b04fhByBTv5tOCRuTuAqjnyCs5HQ\nnlewsSARSHdng4yb7XfH2dcR3bZmbzD4jWNmQGp88tvg3hMbQ1Hpt5ykwqALCLQM\njBEuP8n+xXl9uKrM7hfBM3+tPSMcp9aYY2LZm4o5PuWRpy2Fx+6i7SXnAoGBANYw\npTERqEFgozxQIZcQ595OKRRqTNwyQ/OfbCgM0//vxaXb5alTaWNbBAEg31/FrQ2J\neZbRt2DqgvrsAoHSgWBdASL5Nh6uThw0Mp2uPpqP7Nu7Pp/EDkAsd48RaRDFzn8s\nIG3qoOxvLhIuTGzA1liv48FNq6LW48cSNRG5bX2BAoGBAKUb+i6aGWsc72z1GjIK\nV9K4+ZDmm5GL3DU1+ZB0w4CjKQt2ShM2cDa/++LEWT6EYtY7ZRi/J7LNQjkWTKCg\ncAd0p9qQbazPdosk5ZWRPnDsCDbP9VBT95gTYBOFMAfQ2QDtRLbcNwV/LoZsUg0D\n8VaH7LrkiyXej7TfiR5teYlxAoGAM6NWsBXJsrlRoWDQOFNjEz1Uug9GqG+V4k41\nDRLKqZFs3Se+nqv1ZHa06HC8aaKGrhTOs4Wr6Dmhik0L7bCKcGj7tSrP2WW8fyA2\nc71mamz4daEW3/2sUdxmlp9j7R9DQXWp+9XtJhNH0CpJUo7LHmaJSjkngAK+t2e0\nU6mYtAECgYA0OvYSDF5OYSyqSHeAbXIqfJo58jcCmnZgN7NCvka1CF+PLDTXOQrn\ndm/vlzbD8/ftfZ3y5EGbLlHpnDnK5wpu+lF/gyauWliQ5RypQfakSYDu+WtK7tv1\nx8zpFXCHl9tya5lq1Op1dPjpRkQBBX6fsNh7imtB/O+IP5HzE6AgtA==\n-----END RSA PRIVATE KEY-----\n",
      cert: "-----BEGIN CERTIFICATE-----\nMIIDfjCCAmYCCQCfeUuTLMk3YzANBgkqhkiG9w0BAQUFADCBhzELMAkGA1UEBhMC\nVVMxCzAJBgNVBAgTAkNBMRAwDgYDVQQHEwdPYWtsYW5kMQwwCgYDVQQKEwNucG0x\nIjAgBgNVBAsTGW5wbSBDZXJ0aWZpY2F0ZSBBdXRob3JpdHkxDjAMBgNVBAMTBW5w\nbUNBMRcwFQYJKoZIhvcNAQkBFghpQGl6cy5tZTAeFw0xMjA3MTIyMDEzMThaFw0y\nMjA3MTAyMDEzMThaMHoxCzAJBgNVBAYTAlVTMQswCQYDVQQIEwJDQTEQMA4GA1UE\nBxMHT2FrbGFuZDEMMAoGA1UEChMDbnBtMREwDwYDVQQLEwhyZWdpc3RyeTESMBAG\nA1UEAxMJbG9jYWxob3N0MRcwFQYJKoZIhvcNAQkBFghpQGl6cy5tZTCCASIwDQYJ\nKoZIhvcNAQEBBQADggEPADCCAQoCggEBANSGHKkefEy0pNUgjJZFyPw5hA2GWWqx\nVLgeS+XAWI1PrmOtlgLkUfG1X1czQkRwPaTrfH6fhobvVNi9PeI4nUpS0hOKfV18\nNVXTiOVGSPnZSwaXO/iYLeGsAbpYVqaIzKOOIqsmp/okk5yvaKpUYjDkwRssaUiX\nwX7cdaa1MuzdOg/HSFIsNrc4Ys2DW72exgVwQ7NsOLMH5Gdevh7DAK3NsjQxA7ID\nQsNQ8hjFPy95ZWhtk+9Ddy7PhZ/+yk5ILXMmNpuzeDyF+bb7B+M45uzma1lzRaR4\nvBJUNPfv2fVT4Cwxi8MTamdxPJqGxnIkEyeSl5Pku0d1/Thbgfdc5GcCAwEAATAN\nBgkqhkiG9w0BAQUFAAOCAQEADE/+NC2MwMJZoyZpaIY+Jy27WGsT6KOPEiWjOks6\nu2pNOmtXwTsAC92Tr0bgGPRmDLfsYX9aQ/iRjakLmhtV5TsaAdLNF0zKhrhpYjAl\nPTcrlPUxK+MZmbQQ2WGF/9AhS2Pnke1cFkiv8ORen1rkcynbSBpuKuraYz4FYoCy\ndqGovkN8bAjrSkOkuBpT93gyBEVWbG924b3QQS4dPwN2V+DfteB2TUh3SvpzyaXv\nDAt46X6rAjfDfcLle9gEkVDfAo2u6Sff2QqtZO9XrpYh7AX5JAb7pMy9dRn36kH2\neXZq9JXHgxFTGnLy2lEoaUzc532d4qxlP9jnXsZ4bM/JDA==\n-----END CERTIFICATE-----\n"
    }
}

config.views = {
  engines: {
    hbs: require('handlebars')
  },
  relativeTo: __dirname,
  path: './templates',
  helpersPath: './templates/helpers',
  layoutPath: './templates/layouts',
  partialsPath: './templates/partials',
  layout: 'default'
};

config.couch = {
  "couchAuth": "admin:admin",
  "registryCouch": "http://localhost:15984/"
};

config.session = {
  password: 'i dunno, something secure probably? Definitely!',
  cookie: 's',
  expiresIn: 14 * 24 * 60 * 60 * 1000 // 2 wks
};

config.metrics = {
  collector: {
    uri: 'udp://localhost:3333'
  },
  prefix: 'npm-www-dev'
}

config.downloads = {
  url: "https://api.npmjs.org/downloads/"
};

config.license = {
  "hubspot": {
    "forms": "https://forms.hubspot.com/uploads/form/v2/:portal_id/:form_guid",
    "portal_id": "123456",
    "form_npme_signup": "12345",
    "form_npme_agreed_ula": "12345",
    "form_npme_contact_me": "12345",
    "form_private_npm": "12345"
  },
  "api": "https://billing.website.com",
};

config.npme = {
  product_id: '12345',
  trial_length: 5,
  trial_seats: 2
};

config.user = {
  profileFields: {
    fullname: [ 'Full Name', '%s' ],
    email: [ 'Email', '<a href="mailto:%s">%s</a>', function (u) {
      return u.protocol === 'mailto:'
    } ],
    github: [ 'GitHub', '<a rel="me" href="https://github.com/%s">%s</a>',
      hostmatch(/^github.com$/) ],
    twitter: [ 'Twitter', '<a rel="me" href="https://twitter.com/%s">@%s</a>',
      hostmatch(/^twitter.com$/) ],
    appdotnet: [ 'App.net', '<a rel="me" href="https://alpha.app.net/%s">%s</a>',
      hostmatch(/app.net$/) ],
    homepage: [ 'Homepage', '<a rel="me" href="%s">%s</a>',
      hostmatch(/[^\.]+\.[^\.]+$/) ],
    freenode: [ 'IRC Handle', '%s' ]
  },
  mail: {
    mailTransportModule: "nodemailer-ses-transport",
    mailTransportSettings: {
      accessKeyId: process.env.MAIL_ACCESS_KEY_ID,
      secretAccessKey: process.env.MAIL_SECRET_ACCESS_KEY,
      region: "us-west-2"
    },
    emailFrom: 'support@npmjs.com'
  }
};

// options for search (registry facet)
config.search = {
  url:'http://127.0.0.1:9200/npm',
  perPage: 24
};

if (fs.existsSync('./config.admin.js')) {
  Hoek.merge(config, require('./config.admin'), false);
}

// stamp data for templates
var gitHead;
try {
  gitHead = fs.readFileSync('.git/HEAD', 'utf8').trim()
  if (gitHead.match(/^ref: /)) {
    gitHead = gitHead.replace(/^ref: /, '').trim()
    gitHead = fs.readFileSync('.git/' + gitHead, 'utf8').trim()
  }
  config.HEAD = gitHead
} catch (_) {
  gitHead = '(not a git repo) ' + _.message
}

config.stamp = 'pid=' + process.pid + ' ' +
                // 'worker=' + cluster.worker.id + ' ' +
                gitHead + ' ' + config.canonicalHost + ' ' +
                os.hostname() + ' ' + process.env.SMF_ZONENAME;

config.user.mail.canonicalHost = config.canonicalHost;

function hostmatch (m) { return function (u) {
  return u.host && u.host.match(m)
} }
