import Server from './Server.js';
import path from 'path';


export default class Service {


    constructor({
        serviceDir,
        name,
    }) {
        this.name = name;
        this.serviceDir = serviceDir;
        this.controllers = new Map();
    }





    /**
     * get the service name
     */
    getName() {
        return this.name;
    }



    /**
     * register a new controller on the service
     *
     * @param      {object}  controller  controller instance
     */
    registerController(controller) {
        this.controllers.set(controller.getName(), controller);
    }




    /**
     * load the service
     *
     * @return     {Promise}  { description_of_the_return_value }
     */
    async load() {
        await this.setupConfig();
        await this.setupAuthorizatiom();
        await this.setupServer();
    }




    /**
     * load the webserevr
     */
    async setupServer() {
        this.server = new Server({
            serviceName: this.getName(),
            controllers: this.controllers,
            config: this.config,
        });

        await this.server.load();
    }




    /**
     * load the config file
     */
    async setupConfig() {
        this.config = new RainbowConfig(path.join(serviceDir, 'config'), this.secretsDir);
        await this.config.load();
    }
}