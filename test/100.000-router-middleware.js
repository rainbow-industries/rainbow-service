import section from '../es-modules/distributed-systems/section-tests/1.x/index.js';
import HTTP2Client from '../es-modules/distributed-systems/http2-client/2.x/HTTP2Client.js';
import HTTP2Server from '../es-modules/distributed-systems/http2-server/2.x/HTTP2Server.js';
import RouterMiddleware from '../src/RouterMiddleware.js';
import assert from 'assert';


section('RouterMiddleware', (section) => {
    section.test('analyze valid route', async () => {
        let controller, action;

        const middleware = new RouterMiddleware();

        const server = new HTTP2Server({ secure: false });
        await server.load();
        await server.listen(7896);

        server.registerMiddleware(middleware);
        server.registerMiddleware((request) => {
            controller = request.getParameter('controller');
            action = request.getParameter('action');
        });

        const client = new HTTP2Client();

        await client.get('http://l.dns.porn:7896/test').expect(404).send();
        await server.close();

        assert.equal(controller, 'test');
        assert.equal(action, 'list');
    });

    section.test('analyze valid route [listOne]', async () => {
        let controller, action;

        const middleware = new RouterMiddleware();

        const server = new HTTP2Server({ secure: false });
        await server.load();
        await server.listen(7896);

        server.registerMiddleware(middleware);
        server.registerMiddleware((request) => {
            controller = request.getParameter('controller');
            action = request.getParameter('action');
        });

        const client = new HTTP2Client();

        await client.get('http://l.dns.porn:7896/test/abc').expect(404).send();
        await server.close();

        assert.equal(controller, 'test');
        assert.equal(action, 'listOne');
    });

    section.test('analyze invalid route', async () => {
        let controller, action;

        const middleware = new RouterMiddleware();

        const server = new HTTP2Server({ secure: false });
        await server.load();
        await server.listen(7896);

        server.registerMiddleware(middleware);
        server.registerMiddleware((request) => {
            controller = request.getParameter('controller');
            action = request.getParameter('action');
        });

        const client = new HTTP2Client();

        await client.get('http://l.dns.porn:7896/test/abc/789').expect(404).send();
        await server.close();

        assert.equal(controller, null);
        assert.equal(action, null);
    });

    section.test('analyze invalid route 2', async () => {
        let controller, action;

        const middleware = new RouterMiddleware();

        const server = new HTTP2Server({ secure: false });
        await server.load();
        await server.listen(7896);

        server.registerMiddleware(middleware);
        server.registerMiddleware((request) => {
            controller = request.getParameter('controller');
            action = request.getParameter('action');
        });

        const client = new HTTP2Client();

        await client.get('http://l.dns.porn:7896/-test/abc/789').expect(404).send();
        await server.close();

        assert.equal(controller, null);
        assert.equal(action, null);
    });
});