import { PureComponent } from 'react'
import { api, sharedState } from '../configureService'

class BaseComponent extends PureComponent {
    constructor(props) {
        super(props);

        this._service = null;
        this._sharedState = sharedState.user();
        this._subscribers = []

        console.log('[BaseComponent] ' + this.constructor.name + ' constructor. Props:', this.props);
    }

    get rootApi() {
        return api;
    }

    get service() {
        return this._service
    }

    get sharedState() {
        return this._sharedState
    }

    registerService(info) {
        this._service = api.resolveService(info);
    }

    subscribeToSharedState(subscribers, cb) {
        var subscriber = this._sharedState.subscribe(subscribers, cb);
        this._subscribers.push(subscriber);
    }

    unsubscribeFromSharedState() {
        for(var x of this._subscribers) {
            x.close();
        }
        this._subscribers = [];
    }

    componentWillUnmount() {
        this.unsubscribeFromSharedState()
    }
}

export default BaseComponent
