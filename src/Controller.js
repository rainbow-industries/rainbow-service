



export default class Controller {


    constructor({
        name,
        config,
    } = {}) {
        this.config = config;
        this.name = name;
        this.enabledActions = new Set();

        if (!this.name) throw new Error(`The controller contructor option 'name' is missing!`);
    }



    /**
     * Enables the action.
     *
     * @param      {strng}  action  The action
     */
    enableAction(action) {
        this.enabledActions.add(action);
    }




    /**
     * get the controllers name
     *
     * @return     {boolean}  The name.
     */
    getName() {
        return this.name;
    }




    /**
     * Determines if action enabled.
     *
     * @param      {string}   action  The action
     */
    isActionEnabled(action) {
        return this.enabledActions.has(action);
    }




    /**
     * execute the request
     *
     * @param      {string}   action   The action
     * @param      {request}  request  The request
     */
    async executeAction(action, request) {
        if (typeof this[action] !== 'function') {
            return request.reponse()
                .status(501)
                .send({
                    status: 501,
                    message: `The method '${action}'' is not implemented on the controller '${this.getName()}'!`
                });
        }


        return await this[action](request);
    }
}