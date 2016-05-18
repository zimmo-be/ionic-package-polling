# Ionic.io package polling

Ionic.io package is still in beta, and it currently does not support callbacks or hooks about status changes of your builds. 
This module will poll the build list and trigger events when a build is successful or fails.

## Installation

```
$ npm install ionic-package-polling
```

## Usage

Here is a basic example:
```
var Poll = require("./index");

var poll = new Poll({
    username: "email@domain.com",
    password: "yourpassword",
    appId: "yourAppId"
});

poll.onSuccess(function(model) {
    console.log("build successful: " + model.id);
});

poll.onFail(function(model) {
    console.log("build failed: " + model.id);
});

poll.run(); // start polling
```

## License

ISC License