import section from '../es-modules/distributed-systems/section-tests/1.x/index.js';
import HTTP2Client from '../es-modules/distributed-systems/http2-client/2.x/HTTP2Client.js';
import Controller from '../src/Controller.js';
import Service from '../src/Service.js';
import assert from 'assert';
import path from 'path';


const configDir = path.join(path.dirname(new URL(import.meta.url).pathname));



section('Data Flow', (section) => {
    section.test('JSON data', async () => {
        class MyService extends Service {
            constructor() {
                super({
                    serviceDir: configDir,
                    name: 'test-service',
                    version: '1.0',
                });
            }
        };

        const service = new MyService();
        const controller = new Controller({
            name: 'some-route',
        });

        controller.enableAction('list');
        controller.list = async (request) => {
            return {data: 1};
        };

        service.registerController(controller);


        await service.load();

        const client = new HTTP2Client();
        const response = await client.get('http://l.dns.porn:4891/test-service/1.0/some-route/').expect(200).send();
        const data = await response.getData();
        await client.end();
        await service.end();

        assert(data);
        assert.equal(data.data, 1)
    });


    section.test('Server Errors', async () => {
        class MyService extends Service {
            constructor() {
                super({
                    serviceDir: configDir,
                    name: 'test-service',
                    version: '1.0',
                });
            }
        };

        const service = new MyService();
        const controller = new Controller({
            name: 'some-route',
        });

        controller.enableAction('list');
        controller.list = async (request) => {
            throw new Error(`bad`);
        };

        service.registerController(controller);


        await service.load();

        const client = new HTTP2Client();
        const response = await client.get('http://l.dns.porn:4891/test-service/1.0/some-route/').expect(500).send();
        const data = await response.getData();
        await client.end();
        await service.end();

        assert(data);
        assert.equal(data.message, 'The server encountered an error: bad')
    });
});