# Rainbow Service

Service Implementation for building rainbow services. Provides routing, authorization and classes for building Controllers and Services.

A rainbow service exposes a simple RESTful API. Each route is represented by a controller, each method by an action on that controller.

Rainbow services are HTTP2 only and do not provide any form of support for HTTP1 or ALPN.


**Implement a Controller**

```javascript
import Controller from '../es-modules/rainbow-industries/rainbow-service/1.x/Controller.js';

export default class SomeController {

    constructor() {
        this.enableAction('list');
    }


    async list(request) {
        request.response()
            .status(200)
            .send({
                some: 'data'
            });
    }
}
```

**Implement a Service**

```javascript
import RainbowService from '../es-modules/rainbow-industries/rainbow-service/1.x/RainbowService.js';
import SomeController from './controller/SomeController.js';


class MyService extends RainbowService {

    constructor() {
        super({
            name: 'my-service',
            version: '1.0',
            serviceDir: '/absolute/path/to/my/service',
        })
    }


    async load() {
        const someController = new SomeController();
        this.registerController(controller);

        await super.load();
    }
}
```

## Config Files

The service implementation expects a yaml config file in the config directory of your service. See [rainbow-config](https://github.com/rainbow-industries/rainbow-config) for creating the correct files.

The service expects the following config values:

Example `config/config.dev.yml` file

```yaml
# port the service will listen on
server:
    port: 4891

# where to reach the authorization server
services:
    authorization:
        host: l.dns.porn:1755
```

## Routing

The service implementation provides a simple but effective RESTful routing scheme. Service expose resources with actions. Resources are represented by controllers, actions by methods on that controller.

All URLs contain the service name and service version as prefix of the URL: `/myService/1.0/` which results in URLs like `/myService/1.0/myController/someId`.

Actions are represented by HTTP verbs. They are also different depending on if the id parameter is part of the URL.

- list: `GET /serviceName/version/controllerName`
- listOne: `GET /serviceName/version/controllerName/id`
- create: `POST /serviceName/version/controllerName`
- update: `PATCH /serviceName/version/controllerName`
- updateOne: `PATCH /serviceName/version/controllerName/id`
- createOrReplace: `PUT /serviceName/version/controllerName`
- delete: `DELETE /serviceName/version/controllerName`
- deleteOne: : `DELETE /serviceName/version/controllerName/id`
- describe: `OPTIONS //serviceName/versioncontrollerName`


The first part of the URL represents is the service name, the second the service version, the third the controller name and the fourth the optional id.


## Running your Service

Running your service is as simple as instantiating your implementation of the service and calling the `load` method on it. Pay attention to the fact that the env must bes et properly so that the correct config can be loaded. Please refer to the [rainbow-config](https://github.com/rainbow-industries/rainbow-config) package on how to set the env.

```javascript
import MyService from './MyService';

const service = new MyService();
await service.load();
```


## API

You have to implement the RainbowService class and he Controller class for each controller you want to expose.


### Class RainbowService

You have to implement this class.

The constructor of the RainbowService class must call super with the following options:

- serviceDir: this is the path to the directory the service is implemented in, it's used to load the config file from the config dir. You may use the following code to determine the current directory `path.dirname(new URL(import.meta.url).pathname);`
- name: the name of the service, this is used to load the permissions and for building the URLs
- version: the version is used to build the URL

```javascript
import RainbowService from '../es-modules/rainbow-industries/rainbow-service/1.x/RainbowService.js';
import path from 'path';

const serviceDir = path.dirname(new URL(import.meta.url).pathname);

class MyService extends RainbowService {
    constructor() {
        super({
            name: 'my-service',
            version: '1.0',
            serviceDir,
        })
    }
} 
```


#### Method registreController(controllerInstance)

You have to register controllers on your service in order to expose routes to the outside.

```javascript
import SomeController from './controller/SomeController.js';

class MyService extends RainbowService {

    async load() {
        const someController = new SomeController();
        this.registerController(controller);

        await super.load();
    }
}
```


### Class Controller

In order to expose routes on the service you have to implement controllers

The following actions can be implemented:

- list: `GET /serviceName/version/controllerName`
- listOne: `GET /serviceName/version/controllerName/id`
- create: `POST /serviceName/version/controllerName`
- update: `PATCH /serviceName/version/controllerName`
- updateOne: `PATCH /serviceName/version/controllerName/id`
- createOrReplace: `PUT /serviceName/version/controllerName`
- delete: `DELETE /serviceName/version/controllerName`
- deleteOne: : `DELETE /serviceName/version/controllerName/id`
- describe: `OPTIONS //serviceName/versioncontrollerName` 


#### enableAction(actionName) Method

Each action that should be exposed needs to be enabled explicitly. You probably want to do this in your constructor. 

```javascript
import Controller from '../es-modules/rainbow-industries/rainbow-service/1.x/Controller.js';

export default class SomeController {

    constructor() {
        this.enableAction('list');
    }


    async list(request) {}
}
```


#### Implement an Action

Actions are implemented as async methods on the controller. If they throw errors, they will be returned as a server error. If they return data, the data will be returned as JSON object to the client.

The `request` object is an instance of the request object of the [HTTP2-Server](https://github.com/distributed-systems/http2-server) 

**Return JSON**

```javascript
import Controller from '../es-modules/rainbow-industries/rainbow-service/1.x/Controller.js';

export default class SomeController {

    async list(request) {
        return [{
            id: 1,
        }];
    }
}
```

**Return a redirect**

```javascript
import Controller from '../es-modules/rainbow-industries/rainbow-service/1.x/Controller.js';

export default class SomeController {

    async list(request) {
        request.response()
            .status(301)
            .setHeader('location', '/some/other/place')
            .send();
    }
}
```

**Return a server error**

```javascript
import Controller from '../es-modules/rainbow-industries/rainbow-service/1.x/Controller.js';

export default class SomeController {

    async list(request) {
        throw new Error('no good!');
    }
}
```

