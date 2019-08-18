


export default class RouterMiddleware {


    constructor({
        serviceVersion,
        serviceName,
    }) {
        this.serviceVersion = serviceVersion;
        this.serviceName = serviceName;

        this.actionMap = new Map([
            ['get', { name: 'list', hasOne: 'optional' }],
            ['put', { name: 'createOrReplace', hasOne: 'optional' }],
            ['post', { name: 'create', hasOne: 'no' }],
            ['patch', { name: 'update', hasOne: 'optional' }],
            ['delete', { name: 'delete', hasOne: 'optional' }],
            ['options', { name: 'describe', hasOne: 'no' }],
        ]);
    }


    /**
     * analyze the request an store the results on it, it will be sued by the
     * authorization middleware and the routing
     *
     * @param      {object}  request  The request
     */
    async handleRequest(request) {
        if (!this.actionMap.has(request.method())) {
            return request.response()
                .status(405)
                .send({
                    status: 405,
                    message: `Method '${request.method()}' not allowed!`
                });
        }

        const pathTest = new RegExp(`/${this.serviceName}/${this.serviceVersion}`, 'i');
        if (!pathTest.test(request.path())) {
            return request.response()
                .status(400)
                .send({
                    status: 400,
                    message: `The request URL must contain the service name and service version: '/${this.serviceName}/${this.serviceVersion}/controllerName'!`,
                });
        }


        const urlTest = new RegExp(`^/${this.serviceName}/${this.serviceVersion}/(?<controller>[a-z_0-9-]+)(?:/(?<id>[a-z_0-9-]+))?/?$`, 'i');
        const match = urlTest.exec(request.path());

        if (match) {
            request.setParameter('controller', match.groups.controller);
            const id = match.groups.id;
            const config = this.actionMap.get(request.method());

            // the action does not allow ids to be set
            if (config.hasOne === 'no' && id !== undefined) {
                return request.response()
                    .status(400)
                    .send({
                        status: 400,
                        message: `Method '${request.method()}' does not allow for a resource identifier in the url!`
                    });
            }

            if (config.hasOne === 'required' && id === undefined) {
                return request.response()
                    .status(400)
                    .send({
                        status: 400,
                        message: `Method '${request.method()}' requires a resource identifier in the url!`
                    });
            }


            const action = config.name + (id ? 'One' : '');

            request.setParameter('action', action);
            request.setParameter('id', id);
        }
    }
}