import HTTP2Server from '../es-modules/distributed-systems/http2-server/2.x/HTTP2Server.js';
import AuthorizationMiddleware from '../es-modules/rainbow-industries/rainbow-authorization-middleware/1.x/AuthorizationMiddleware.js';
import RouterMiddleware from './RouterMiddleware.js';
import RequestRouterMiddleware from './RequestRouterMiddleware.js';


export default class Server {


    constructor({
        config,
        controllers,
        serviceName,
        serviceVersion,
    }) {
        this.config = config;
        this.controllers = controllers;
        this.serviceName = serviceName;
        this.serviceVersion = serviceVersion;
    }



    /**
     * load all module, start listening for requests
     */
    async load() {
        this.server = new HTTP2Server({ secure: false });

        // manage authorization and routing
        await this.loadRouterMiddleware();
        await this.loadAuthorizationMiddleware();
        await this.loadRequestRouterMiddleware();

        await this.server.listen(this.config.get('server.port'));
    }



    /**
     * close the server
     */
    async close() {
        await this.server.close();
    }




    /**
     * Loads a request router middleware.
     *
     * @param      {object}   request  The request
     */
    async loadRequestRouterMiddleware(request) {
        this.requestRouterMiddleware = new RequestRouterMiddleware({
            controllers: this.controllers,
            serviceName: this.serviceName,
        });

        this.server.registerMiddleware(this.requestRouterMiddleware);
    }




    /**
     * Loads a router middleware.
     */
    async loadRouterMiddleware() {
        this.routerMiddleware = new RouterMiddleware({
            serviceVersion: this.serviceVersion,
            serviceName: this.serviceName,
        });
        
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

        this.server.registerMiddleware(this.authorizationMiddleware);
    }
}