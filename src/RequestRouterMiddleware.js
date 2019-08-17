


export default class RequestRoutingMiddleware {


    constructor({
        controllers,
        serviceName,
    }) {
        this.controllers = controllers;
        this.serviceName = serviceName;
    }



    /**
     * validate the request and rout it to the controller
     *
     * @param      {request}   request  The request
     */
    async handleRequest(request) {
        if (!request.hasParameter('controller') || !request.hasParameter('action')) {
            return request.response()
                .status(500)
                .send({
                    status: 500,
                    message: `Missing the the controller and or action parameter on the request!`,
                });
        }


        const controllerName = request.getParameter('controller');

        if (!this.controllers.has(controllerName)) {
            return request.response()
                .status(404)
                .send({
                    status: 404,
                    message: `The controller '${controllerName} was not found on the server!!`,
                });
        }


        const controller = this.controllers.get(controllerName);
        const action = request.getParameter('action');


        if (!controller.isActionEnabled(action)) {
            return request.response()
                .status(405)
                .send({
                    status: 405,
                    message: `Method '${request.method()}' not allowed!`
                });
        }


        return await controller.executeAction(action, request); 
    }
}