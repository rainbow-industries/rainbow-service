import section from '../es-modules/distributed-systems/section-tests/1.x/index.js';
import HTTP2Client from '../es-modules/distributed-systems/http2-client/2.x/HTTP2Client.js';
import HTTP2Server from '../es-modules/distributed-systems/http2-server/2.x/HTTP2Server.js';
import RequestRouterMiddleware from '../src/RequestRouterMiddleware.js';
import RouterMiddleware from '../src/RouterMiddleware.js';
import Controller from '../src/Controller.js';
import assert from 'assert';


section('RequestRouterMiddleware', (section) => {
    section.test('analyze valid route', async () => {
        const controllers = new Map();
        const controller = new Controller({ name: 'test' });
        const routerMiddleware = new RouterMiddleware({
            serviceName: 'test-service',
            serviceVersion: '1.0',
        });

        controller.enableAction('list');
        controller.list = async(request) => {
            request.response()
                .status(201)
                .send('ok');
        };

        controllers.set(controller.getName(), controller);


        const middleware = new RequestRouterMiddleware({
            controllers,
            serviceName: 'test',
        });

        const server = new HTTP2Server({ secure: false });
        await server.load();
        await server.listen(7896);

        server.registerMiddleware(routerMiddleware);
        server.registerMiddleware(middleware);

        const client = new HTTP2Client();

        await client.get('http://l.dns.porn:7896/test-service/1.0/test').expect(201).send();
        await server.close();
    });


    section.test('analyze invalid route', async () => {
        const controllers = new Map();
        const controller = new Controller({ name: 'test' });
        const routerMiddleware = new RouterMiddleware({
            serviceName: 'test-service',
            serviceVersion: '1.0',
        });

        controller.enableAction('list');
        controller.list = async(request) => {
            request.response()
                .status(201)
                .send('ok');
        };

        controllers.set(controller.getName(), controller);


        const middleware = new RequestRouterMiddleware({
            controllers,
            serviceName: 'test',
        });

        const server = new HTTP2Server({ secure: false });
        await server.load();
        await server.listen(7896);

        server.registerMiddleware(routerMiddleware);
        server.registerMiddleware(middleware);

        const client = new HTTP2Client();

        await client.get('http://l.dns.porn:7896/test-service/1.0/').expect(500).send();
        await client.end();
        await server.close();
    });


    section.test('analyze invalid route [2]', async () => {
        const controllers = new Map();
        const controller = new Controller({ name: 'test' });
        const routerMiddleware = new RouterMiddleware({
            serviceName: 'test-service',
            serviceVersion: '1.0',
        });

        controller.enableAction('list');
        controller.list = async(request) => {
            request.response()
                .status(201)
                .send('ok');
        };

        controllers.set(controller.getName(), controller);


        const middleware = new RequestRouterMiddleware({
            controllers,
            serviceName: 'test',
        });

        const server = new HTTP2Server({ secure: false });
        await server.load();
        await server.listen(7896);

        server.registerMiddleware(routerMiddleware);
        server.registerMiddleware(middleware);

        const client = new HTTP2Client();

        await client.get('http://l.dns.porn:7896/test-service/1.0/nope').expect(404).send();
        await client.end();
        await server.close();
    });


    section.test('analyze invalid route [3]', async () => {
        const controllers = new Map();
        const controller = new Controller({ name: 'test' });
        const routerMiddleware = new RouterMiddleware({
            serviceName: 'test-service',
            serviceVersion: '1.0',
        });

        controllers.set(controller.getName(), controller);


        const middleware = new RequestRouterMiddleware({
            controllers,
            serviceName: 'test',
        });

        const server = new HTTP2Server({ secure: false });
        await server.load();
        await server.listen(7896);

        server.registerMiddleware(routerMiddleware);
        server.registerMiddleware(middleware);

        const client = new HTTP2Client();

        await client.get('http://l.dns.porn:7896/test-service/1.0/test').expect(405).send();
        await client.end();
        await server.close();
    });
});