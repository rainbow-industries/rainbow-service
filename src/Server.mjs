import HTTP2Server from '../es-modules/distributed-systems/http2-server/1.x/HTTP2Server.js';
import AuthorizationMiddleware from '../es-modules/rainbow-industries/rainbow-authorization-middleware/AuthorizationMiddleware.js';
import RouterMiddleware from './RouterMiddleware.js';
import RequestRouterMiddleware from './RequestRouterMiddleware.js';


export default class Server {


    construtor({
        config,
        controllers,
        serviceName,
    }) {
        this.config = config;
        this.controllers = controllers;
        this.serviceName = serviceName;
    }



    /**
     * load all module, start listening for requests
     */
    async load() {
        this.server = new HTTP2Server();

        // manage authorization and routing
        await this.loadRouterMiddleware();
        await this.loadAuthorizationMiddleware();
        await this.loadRequestRouterMiddleware();


        await this.server.listen(thios.config.get('server.port'));
    }





    /**
     * Loads a request router middleware.
     *
     * @param      {object}   request  The request
     */
    async loadRequestRouterMiddleware(request) {
        this.requestRouterMiddleware = new RequestRouterMiddleware({
            controller: this.controllers,
            serviceName: this.serviceName,
        });

        this.server.registerMiddleware(this.requestRouterMiddleware);
    }




    /**
     * Loads a router middleware.
     */
    async loadRouterMiddleware() {
        this.routerMiddleware = enw RouterMiddleware();
        this.server.registerMiddleware(this.routerMiddleware);
    }



    /**
     * Loads an authorization middleware.
     */
    async loadAuthorizationMiddleware() {
        this.authorizationMiddleware = new AuthorizationMiddleware({
            host: this.config.get('services.authorization.host'),
            serviceName: this.serviceName,
        });

        this.services.registerMiddleware(this.authorizationMiddleware);
    }
}