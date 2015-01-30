var Code = require('code'),
    Lab = require('lab'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    it = lab.test,
    expect = Code.expect,
    present = require(__dirname + "/../../presenters/package");

describe("publisher", function () {
  it("is in maintainers list if it is in the maintainers list", function (done) {
    var package = present({
      "versions": ["1.3.0"],
      "name": "hello",
      "publisher": {
        "name": "ohai",
        "email": "ohai@email.com"
      },
      "maintainers": [{
        "name": "ohai",
        "email": "ohai@email.com"
      }],
      "version": "1.3.0",
      "last_published_at": "2013-06-11T09:36:32.285Z"
    });
    expect(package.publisherIsInMaintainersList).to.exist();
    expect(package.publisherIsInMaintainersList).to.be.true();
    done();
  });

  it("is not in the maintainers list if it is not in the maintainers list", function (done) {
    var package = present({
      "versions": ["0.1.0"],
      "name": "badpkg",
      "publisher": {
        "name": "badactor",
        "email": "badactor@email.com"
      },
      "maintainers": [{
        "name": "innocentperson",
        "email": "innocentperson@email.com"
      }],
      "version": "0.1.0",
      "last_published_at": "2013-06-11T09:36:32.285Z"
    });
    expect(package.publisherIsInMaintainersList).to.exist();
    expect(package.publisherIsInMaintainersList).to.be.false();
    done();
  });
});

describe("avatars", function () {
  it("are created for the publisher", function (done) {
    var package = present({
      "versions": ["1.3.0"],
      "name": "hello",
      "publisher": {
        "name": "ohai",
        "email": "ohai@email.com"
      },
      "maintainers": [{
        "name": "ohai",
        "email": "ohai@email.com"
      }],
      "version": "1.3.0",
      "last_published_at": "2013-06-11T09:36:32.285Z"
    });
    expect(package.publisher.avatar).to.exist();
    expect(package.publisher.avatar).to.be.an.object();
    expect(package.publisher.avatar.small).to.exist();
    expect(package.publisher.avatar.medium).to.exist();
    expect(package.publisher.avatar.large).to.exist();
    done();
  });

  it("are created for the maintainers", function (done) {
    var package = present({
      "versions": ["1.3.0"],
      "name": "hello",
      "publisher": {
        "name": "ohai",
        "email": "ohai@email.com"
      },
      "maintainers": [{
        "name": "ohai",
        "email": "ohai@email.com"
      }],
      "version": "1.3.0",
      "last_published_at": "2013-06-11T09:36:32.285Z"
    });
    expect(package.maintainers[0].avatar).to.exist();
    expect(package.maintainers[0].avatar).to.be.an.object();
    expect(package.maintainers[0].avatar.small).to.exist();
    expect(package.maintainers[0].avatar.medium).to.exist();
    expect(package.maintainers[0].avatar.large).to.exist();
    done();
  });
});

describe("OSS license", function () {
  it("is added to the package", function (done) {
    var package = present({
      "versions": ["1.3.0"],
      "name": "hello",
      "publisher": {
        "name": "ohai",
        "email": "ohai@email.com"
      },
      "maintainers": [{
        "name": "ohai",
        "email": "ohai@email.com"
      }],
      "version": "1.3.0",
      "license": "MIT",
      "last_published_at": "2013-06-11T09:36:32.285Z"
    });
    expect(package.license).to.be.an.object();
    expect(package.license.name).to.equal('MIT');
    expect(package.license.url).to.include('opensource.org');
    done();
  });
});

describe("dependencies, devDependencies, and dependents", function () {
  it("should be included if they exist", function (done) {
    var package = present({
      "versions": ["1.3.0"],
      "name": "hello",
      "dependents": [
        "connect-orientdb",
        "graphdb-orient"
      ],
      "publisher": {
        "name": "ohai",
        "email": "ohai@email.com"
      },
      "dependencies": {
        "lodash": "*"
      },
      "devDependencies": {
        "async": "*",
        "tap": "0.4"
      },
      "maintainers": [{
        "name": "ohai",
        "email": "ohai@email.com"
      }],
      "version": "1.3.0",
      "last_published_at": "2013-06-11T09:36:32.285Z"
    });
    expect(package.dependencies).to.exist();
    expect(package.devDependencies).to.exist();
    expect(package.dependents).to.exist();
    done();
  });

  it("should be included if they exist", function (done) {
    var package = present({
      "versions": ["1.3.0"],
      "name": "hello",
      "publisher": {
        "name": "ohai",
        "email": "ohai@email.com"
      },
      "maintainers": [{
        "name": "ohai",
        "email": "ohai@email.com"
      }],
      "version": "1.3.0",
      "last_published_at": "2013-06-11T09:36:32.285Z"
    });
    expect(package.dependencies).to.not.exist();
    expect(package.devDependencies).to.not.exist();
    expect(package.dependents).to.not.exist();
    done();
  });
});

describe("repo url", function () {
  it("doesn't change if it's not a GH url", function (done) {
    var package = present({
      "versions": ["1.3.0"],
      "name": "hello",
      "repository": {
        "type": "git",
        "url": "http://website.com/ohai"
      },
      "publisher": {
        "name": "ohai",
        "email": "ohai@email.com"
      },
      "maintainers": [{
        "name": "ohai",
        "email": "ohai@email.com"
      }],
      "version": "1.3.0",
      "last_published_at": "2013-06-11T09:36:32.285Z"
    });

    expect(package.repository.url).to.not.include('git');
    done();
  });

  it("doesn't change if it's not a GH url", function (done) {
    var package = present({
      "versions": ["1.3.0"],
      "name": "hello",
      "repository": {
        "type": "git",
        "url": "http://github.com/someone/ohai.git"
      },
      "publisher": {
        "name": "ohai",
        "email": "ohai@email.com"
      },
      "maintainers": [{
        "name": "ohai",
        "email": "ohai@email.com"
      }],
      "version": "1.3.0",
      "last_published_at": "2013-06-11T09:36:32.285Z"
    });

    expect(package.repository.url).to.include('https');
    expect(package.repository.url).to.include('github');
    expect(package.repository.url).to.not.include('.git');
    done();
  });
});