


export default class RouterMiddleware {


    constructor() {
        this.actionMap = new Map([
            ['get', 'list'],
            ['put', 'createOrReplace'],
            ['post', 'create'],
            ['patch', 'update'],
            ['delete', 'delete'],
            ['options', 'describe'],
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

        const match = /^\/(?<controller>[a-z_0-9-]+)(?:\/(?<id>[a-z_0-9-]+))?\/?$/gi.exec(request.path());

        if (match) {
            request.setParameter('controller', match.groups.controller);
            const id = match.groups.id;
            const action = this.actionMap.get(request.method()) + (id ? 'One' : '');

            request.setParameter('action', action);
            request.setParameter('id', id);
        }
    }
}