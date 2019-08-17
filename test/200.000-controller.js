import section from '../es-modules/distributed-systems/section-tests/1.x/index.js';
import Controller from '../src/Controller.js';
import assert from 'assert';


section('Controller', (section) => {
    section.test('enable action', async () => {
        const controller = new Controller({ name: 'test' });

        assert.equal(controller.isActionEnabled('list'), false);
        controller.enableAction('list');
        assert.equal(controller.isActionEnabled('list'), true);
    });
});