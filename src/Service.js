import RainbowConfig from '../es-modules/rainbow-industries/rainbow-config/1.x/RainbowConfig.js';
import Server from './Server.js';
import path from 'path';


export default class Service {


    constructor({
        serviceDir,
        name,
        version,
    }) {
        if (!serviceDir) throw new Error(`Missing the serviceDir option!`);
        if (!name) throw new Error(`Missing the name option!`);
        if (!version) throw new Error(`Missing the version option!`);

        this.version = version;
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
        await this.setupServer();
    }



    /**
     * shut down the service
     */
    async end() {
        await this.server.close();
    }


    /**
     * load the webserevr
     */
    async setupServer() {
        this.server = new Server({
            serviceName: this.getName(),
            controllers: this.controllers,
            config: this.config,
            serviceVersion: this.version,
        });

        await this.server.load();
    }




    /**
     * load the config file
     */
    async setupConfig() {
        this.config = new RainbowConfig(path.join(this.serviceDir, 'config'), this.serviceDir);
        await this.config.load();
    }
}