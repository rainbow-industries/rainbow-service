import section from '../es-modules/distributed-systems/section-tests/1.x/index.js';
import HTTP2Client from '../es-modules/distributed-systems/http2-client/2.x/HTTP2Client.js';
import Config from '../es-modules/rainbow-industries/rainbow-config/1.x/RainbowConfig.js';
import Controller from '../src/Controller.js';
import Server from '../src/Server.js';
import assert from 'assert';
import path from 'path';


const configDir = path.join(path.dirname(new URL(import.meta.url).pathname), 'config');



section('Server', (section) => {
    section.test('Set up', async () => {
        const config = new Config(configDir);
        await config.load();

        const controllers = new Map();

        const server = new Server({
            config,
            controllers,
            serviceName: 'test-service',
            serviceVersion: '1.0',
        });
    });



    section.test('Handle request', async () => {
        const config = new Config(configDir);
        await config.load();

        const controllers = new Map();
        const controller = new Controller({
            name: 'some-route',
        });

        controller.enableAction('list');
        controller.list = async (request) => {
            request.response().status(302).send({status: 'look'})
        };

        controllers.set(controller.getName(), controller);

        const server = new Server({
            config,
            controllers,
            serviceName: 'test-service',
            serviceVersion: '1.0',
        });

        await server.load();

        const client = new HTTP2Client();
        await client.get('http://l.dns.porn:4891/test-service/1.0/some-route').expect(302).send();
        await client.end();

        await server.close();
    });



    section.test('Handle invalid request', async () => {
        const config = new Config(configDir);
        await config.load();

        const controllers = new Map();
        const controller = new Controller({
            name: 'some-route',
        });

        controller.enableAction('list');
        controller.list = async (request) => {
            request.response().status(302).send({status: 'look'})
        };

        controllers.set(controller.getName(), controller);

        const server = new Server({
            config,
            controllers,
            serviceName: 'test-service',
            serviceVersion: '1.0',
        });

        await server.load();

        const client = new HTTP2Client();
        await client.get('http://l.dns.porn:4891/test-service/1.0/some-route/d').expect(405).send();
        await client.end();

        await server.close();
    });



    section.test('Handle invalid request [2]', async () => {
        const config = new Config(configDir);
        await config.load();

        const controllers = new Map();
        const controller = new Controller({
            name: 'some-route',
        });

        controller.enableAction('list');
        controller.list = async (request) => {
            request.response().status(302).send({status: 'look'})
        };

        controllers.set(controller.getName(), controller);

        const server = new Server({
            config,
            controllers,
            serviceName: 'test-service',
            serviceVersion: '1.0',
        });

        await server.load();

        const client = new HTTP2Client();
        await client.get('http://l.dns.porn:4891/test-service/1.0/some/').expect(404).send();
        await client.end();

        await server.close();
    });
});