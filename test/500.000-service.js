import section from '../es-modules/distributed-systems/section-tests/1.x/index.js';
import HTTP2Client from '../es-modules/distributed-systems/http2-client/2.x/HTTP2Client.js';
import Controller from '../src/Controller.js';
import Service from '../src/Service.js';
import assert from 'assert';
import path from 'path';


const configDir = path.join(path.dirname(new URL(import.meta.url).pathname));



section('Service', (section) => {
    section.test('Implement interface', async () => {
        class MyService extends Service {
            constructor() {
                super({
                    serviceDir: configDir,
                    name: 'test-service',
                    version: '1.0',
                });
            }
        };

        new MyService();
    });


    section.test('start and Stop', async () => {
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

        await service.load();
        await service.end();
    });




    section.test('start and Stop', async () => {
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
            request.response().status(302).send({status: 'look'})
        };

        service.registerController(controller);


        await service.load();

        const client = new HTTP2Client();
        await client.get('http://l.dns.porn:4891/test-service/1.0/some/').expect(404).send();
        await client.end();

        await service.end();
    });
});