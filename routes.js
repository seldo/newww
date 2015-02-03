var config = require('./config'),
    csp = require('./lib/csp'),
    ops = require('./facets/ops'),
    fmt = require('util').format,
    validatePackageName = require('validate-npm-package-name'),
    Hoek = require("hoek");

var enterpriseConfig = {
  plugins: {
    blankie: csp.enterprise
  }
};

var unathenticatedRouteConfig = {
  config: {
    auth: {
      mode: 'try'
    },
    plugins: {
      'hapi-auth-cookie': {
        redirectTo: false
      }
    }
  }
};


// CAUTION: THESE ROUTES DO NOT REQUIRE AUTHENTICATION.
// DO NOT PUT SENSITIVE ROUTES IN THIS ARRAY.
var unauthenticatedRoutes = [
  {
    path: '/favicon.ico',
    method: 'GET',
    handler: {
      file: './static/misc/favicon.ico'
    }
  },{
    path: '/robots.txt',
    method: 'GET',
    handler: {
      file: './static/misc/robots.txt'
    }
  },{
    path: '/install.sh',
    method: 'GET',
    handler: {
      file: './static/misc/install.sh'
    }
  },{
    path: '/opensearch.xml',
    method: 'GET',
    handler: {
      file: './static/misc/opensearch.xml'
    }
  },{
    path: '/static/{path*}',
    method: 'GET',
    handler: {
      directory: {
        path: './static',
        listing: true,
        index: true
      }
    }
  },{
    path: "/",
    method: "GET",
    handler: require('./facets/company/show-homepage')
  },{
    path: "/contact",
    method: "GET",
    handler: require('./facets/company/show-contact')
  },{
    path: "/send-contact",
    method: "POST",
    handler: require('./facets/company/show-send-contact')
  },{
    path: "/support",
    method: "GET",
    handler: require('./facets/company/show-contact')
  },{
    path: "/policies/{policy?}",
    method: "GET",
    handler: require('./facets/company/show-policy')
  },{
    path: "/whoshiring",
    method: "GET",
    handler: require('./facets/company/show-whoshiring')
  },{
    path: "/joinwhoshiring",
    method: "GET",
    handler: require('./facets/company/show-whoshiring-payments')
  },{
    path: "/joinwhoshiring",
    method: "POST",
    handler: require('./facets/company/show-whoshiring-payments'),
    config: {
      plugins: {
        // tolerate Ajax
        crumb: {
          source: 'payload',
          restful: true
        }
      }
    }
  },{
    path: "/enterprise",
    method: "GET",
    handler: require('./facets/enterprise/show-index'),
    config: enterpriseConfig
  },{
    path: "/enterprise-start-signup",
    method: "POST",
    handler: require('./facets/enterprise/show-ula'),
    config: enterpriseConfig
  },{
    path: "/enterprise-contact-me",
    method: "POST",
    handler: require('./facets/enterprise/show-contact-me'),
    config: enterpriseConfig
  },{
    path: "/enterprise-trial-signup",
    method: "POST",
    handler: require('./facets/enterprise/show-trial-signup'),
    config: enterpriseConfig
  },{
    path: "/enterprise-verify",
    method: "GET",
    handler: require('./facets/enterprise/show-verification'),
    config: enterpriseConfig
  },{
    path: "/package/{package}/{version?}",
    method: "GET",
    handler: require('./facets/registry/show-package')
  },{
    path: "/packages/{package}",
    method: "GET",
    handler: function(request, reply) {
      return reply.redirect("/package/" + request.params.package).code(301);
    }
  },{
    // Redirect to home, because who cares
    path: "/browse/all",
    method: "GET",
    handler: function(request, reply) {
      return reply.redirect("/").code(301);
    }
  },{
    // Redirect to /~user#packages
    path: "/browse/author/{user}",
    method: "GET",
    handler: function(request, reply) {
      return reply.redirect(fmt("/~%s#packages", request.params.user)).code(301);
    }
  },{
    // Users, ordered descending by how many packages they've starred
    path: "/browse/userstar",
    method: "GET",
    handler: function(request, reply) {
      return reply.redirect("/").code(301);
    }
  },{
    // Redirect to /~user#starred
    path: "/browse/userstar/{user}",
    method: "GET",
    handler: function(request, reply) {
      return reply.redirect(fmt("/~%s#starred", request.params.user)).code(301);
    }
  },{
    // Catch-all for all other browse pages
    // - top keywords
    // - packages that have a certain keywords
    // - recently updated packages
    // - prolific authors
    // - most depended-upon packages
    // - all the packages that depend on the given package
    path: "/browse/{p*}",
    method: "GET",
    handler: require('./facets/registry/show-browse')
  },{
    path: "/keyword/{kw}",
    method: "GET",
    handler: function(request, reply) {
      return reply.redirect('/browse/keyword/' + request.params.kw).code(301);
    }
  },{
    path: "/recent-authors/{since?}",
    method: "GET",
    handler: require('./facets/registry/show-recent-authors')
  },{
    path: "/star",
    method: "POST",
    handler: require('./facets/registry/show-star'),
    config: {
      plugins: {
        // tolerate Ajax
        crumb: {
          source: 'payload',
          restful: true
        }
      }
    }
  },{
    path: "/search/{q?}",
    method: "GET",
    handler: require('./facets/registry/show-search')(config.search)
  },{
    path: "/~{name}",
    method: "GET",
    handler: require('./facets/user/show-profile')
  },{
    path: "/profile/{name}",
    method: "GET",
    handler: require('./facets/user/show-profile')
  },{
    path: "/~/{name}",
    method: "GET",
    handler: require('./facets/user/show-profile')
  },{
    path: "/signup",
    method: "GET",
    handler: require('./facets/user/show-signup')
  },{
    path: "/signup",
    method: "HEAD",
    handler: require('./facets/user/show-signup')
  },{
    path: "/signup",
    method: "POST",
    handler: require('./facets/user/show-signup')
  },{
    path: "/confirm-email",
    method: "GET",
    handler: require('./facets/user/show-confirm-email')
  },{
    path: "/login",
    method: "GET",
    handler: require('./facets/user/show-login')
  },{
    path: "/login",
    method: "POST",
    handler: require('./facets/user/show-login')
  },{
    path: "/logout",
    method: "GET",
    handler: require('./facets/user/show-logout')
  },{
    path: "/forgot/{token?}",
    method: "GET",
    handler: require('./facets/user/show-forgot')(config.user.mail)
  },{
    path: "/forgot/{token?}",
    method: "HEAD",
    handler: require('./facets/user/show-forgot')(config.user.mail)
  },{
    path: "/forgot/{token?}",
    method: "POST",
    handler: require('./facets/user/show-forgot')(config.user.mail)
  },{
    path: "/_monitor/ping",
    method: "GET",
    handler: function(request, reply) {
      return reply('ok').code(200);
    }
  },{
    path: "/_monitor/status",
    method: "GET",
    handler: ops.status(require('./package.json').version)
  },{
    path: "/-/csplog",
    method: "POST",
    handler: ops.csplog,
    config: {
      plugins: {
        crumb: false
      }
    }
  },{
    method: '*',
    path: '/doc/{p*}',
    handler: function(request, reply) {
      return reply.redirect(require("url").format({
        protocol: "https",
        hostname: "docs.npmjs.com",
        pathname: request.url.path
          .replace(/^\/doc/, "")
          .replace(/\.html$/, "")
          .replace(/\/npm-/, "/")
      })).code(301)
    }
  },{
    method: '*',
    path: '/{p*}',
    handler: fallback
  }

];

var authenticatedRoutes = [
  {
    // shortcut for viewing your own stars
    path: "/star",
    method: "GET",
    handler: require('./facets/registry/show-star'),
  },{
    path: "/~",
    method: "GET",
    handler: require('./facets/user/show-profile')
  },{
    path: "/profile",
    method: "GET",
    handler: require('./facets/user/show-profile')
  },{
    path: "/profile-edit",
    method: "GET",
    handler: require('./facets/user/show-profile-edit')(config.user.profileFields)
  },{
    path: "/profile-edit",
    method: "PUT",
    handler: require('./facets/user/show-profile-edit')(config.user.profileFields)
  },{
    path: "/profile-edit",
    method: "POST",
    handler: require('./facets/user/show-profile-edit')(config.user.profileFields)
  },{
    path: "/email-edit",
    method: "GET",
    handler: require('./facets/user/show-email-edit')(config.user.mail)
  },{
    path: "/email-edit",
    method: "HEAD",
    handler: require('./facets/user/show-email-edit')(config.user.mail)
  },{
    path: "/email-edit",
    method: "PUT",
    handler: require('./facets/user/show-email-edit')(config.user.mail)
  },{
    path: "/email-edit",
    method: "POST",
    handler: require('./facets/user/show-email-edit')(config.user.mail)
  },{
    // confirm or revert
    // /email-edit/confirm/1234567
    // /email-edit/revert/1234567
    path: "/email-edit/{token*2}",
    method: "GET",
    handler: require('./facets/user/show-email-edit')(config.user.mail)
  },{
    path: "/email-edit/{token*2}",
    method: "HEAD",
    handler: require('./facets/user/show-email-edit')(config.user.mail)
  },{
    path: "/password",
    method: "GET",
    handler: require('./facets/user/show-password')
  },{
    path: "/password",
    method: "HEAD",
    handler: require('./facets/user/show-password')
  },{
    path: "/password",
    method: "POST",
    handler: require('./facets/user/show-password')
  },{
    path: "/settings/billing",
    method: "GET",
    handler: require('./facets/user/billing').getBillingInfo
  }, {
    path: "/settings/billing",
    method: "POST",
    handler: require('./facets/user/billing').updateBillingInfo
  }, {
    path: "/settings/billing/cancel",
    method: "POST",
    handler: require('./facets/user/billing').deleteBillingInfo
  }
]

// Apply unathenticated route config to all the public routes
unauthenticatedRoutes = unauthenticatedRoutes.map(function(route){
  return Hoek.applyToDefaults(unathenticatedRouteConfig, route)
})

module.exports = unauthenticatedRoutes.concat(authenticatedRoutes)

function fallback(request, reply) {

  // 1. Try to render a static page
  // 2. Look for a package with the given name
  // 3. 404

  var route = request.params.p,
    opts = {
      user: request.auth.credentials,
    };

  request.server.methods.corp.getPage(route, function(er, content) {

    if (content) {
      opts.md = content;
      return reply.view('company/corporate', opts);
    }

    request.server.methods.registry.getPackage(route, function(err, package) {

      if (package) {
        return reply.redirect('/package/' + package._id);
      }

      // Add package to view context if path is a valid package name
      if (validatePackageName(request.params.p).valid) {
        opts.package = {name: request.params.p};
      }

      return reply.view('errors/not-found', opts).code(404);
    });
  });
}
