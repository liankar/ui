import React from 'react'
import BaseComponent from '../../HOC/BaseComponent'
import ReactDOM from 'react-dom'
import $ from 'jquery'
import _ from 'lodash'
import 'golden-layout/src/css/goldenlayout-base.css'
import 'golden-layout/src/css/goldenlayout-dark-theme.css'
import GoldenLayout from 'golden-layout'
import Diagram from '../Diagram'
import Properties from '../Properties'
import Alerts from '../Alerts'
import Timeline from '../Timeline'
import RuleEditor from '../Editors/RuleEditor'
import MarkerEditor from '../Editors/MarkerEditor'

import './styles.scss'

class GoldenLayoutComponent extends BaseComponent {
    constructor(props) {
        super(props)
        this._components = []
    }

    componentDidMount() {
        this._register({
            name: 'Universe',
            component: Diagram,
            location: 'main',
            title: 'Universe',
            skipClose: true
        })
        this._register({
            name: 'Rule Editor',
            component: RuleEditor,
            location: 'main',
            title: 'Rule Editor'
        })
        this._register({
            name: 'Marker Editor',
            component: MarkerEditor,
            location: 'main',
            title: 'Marker Editor'
        })
        this._register({
            name: 'Properties',
            component: Properties,
            location: 'right',
            title: 'Properties',
            width: 25,
            allowVerticalScroll: true
        })
        this._register({
            name: 'Alerts',
            component: Alerts,
            location: 'bottom',
            title: 'Alerts',
            allowVerticalScroll: true
        })
        // this._register({
        //     name: 'Events',
        //     component: Events,
        //     location: 'bottom',
        //     title: 'Events',
        //     allowVerticalScroll: true
        // })
        // this._register({
        //     name: 'Logs',
        //     component: Logs,
        //     location: 'bottom',
        //     title: 'Logs',
        //     allowVerticalScroll: true
        // })
        // this._register({
        //     name: 'UI Logs',
        //     component: UiLogs,
        //     location: 'bottom',
        //     title: 'UI Logs',
        //     allowVerticalScroll: true
        // })
        this._register({
            name: 'Timeline',
            component: Timeline,
            location: 'bottom',
            title: 'Timeline',
            allowVerticalScroll: true
        })

        this._activateLayout()
    }

    _activateLayout() {
        var self = this;

        this._layoutConfig = {
            content: [{
                type: 'column',
                content: [
                    {
                        type: 'row',
                        content: [
                            {
                                type: 'column',
                                content: [
                                    this._getLocationLayout('main'),
                                    this._getLocationLayout('bottom')
                                ]
                            },
                            this._getLocationLayout('right')
                        ]
                    }
                ]
            }]
        }

        this._layout = new GoldenLayout(this._layoutConfig, '#layoutContainer')

        for (var component of this._components) {
            this._setupContent(component.id, component.component)
        }

        this._layout.on('componentCreated', (component) => {
            self._triggerComponentResizeEvent(component);

            let info = this._getComponent(component.config.component);
            info.goldenComponent = component;
            info.goldenContainer = component.container;

            component.container.on('resize', function () {
                self._triggerComponentResizeEvent(component);
            });
        });

        this._layout.on('tabCreated', (tab) => {
            var info = this._getComponent(tab.contentItem.config.component)
            info.goldenTab = tab;

            tab.closeElement.off('click').click((e) => {
                const id = this._components.find(item => item.name === e.target.parentNode.title).id
                this.hideComponent(id);
            });
        })

        this._layout.init()

        this.props.handleLayout(this)

        window.addEventListener('resize', () => {
            this._layout.updateSize();
        });
    }

    _register(info) {
        var id = info.name
        id = _.camelCase(id)
        id = id + 'Component'
        info.id = id
        this._components.push(info)
    }

    activateComponent(id) {
        var info = this._getComponent(id);

        var stack = info.goldenTab.contentItem.parent;
        var stackComponent = _.head(stack.contentItems.filter(x => x.componentName === info.goldenTab.contentItem.componentName));
        if (stackComponent) {
            stack.setActiveContentItem(stackComponent);
        }
    }

    _getComponent(id) {
        return _.filter(this._components, x => x.id === id)[0];
    }

    hideComponent(id) {
        const info = this._getComponent(id);
        info.goldenContainer.close();
    }

    showComponent(id) {
        const info = this._getComponent(id);
        const componentLayout = this._getComponentLayout(info);
        this._layout.root.contentItems[0].addChild(componentLayout);
    }

    _getLocationComponents(location) {
        return _.filter(this._components, x => x.location === location)
    }

    _getLocationLayout(location) {
        var components = this._getLocationComponents(location)
        if (components.length === 0) {
            return null
        }
        if (components.length === 1) {
            return this._getComponentLayout(components[0])
        }

        var layout = {
            type: 'stack'
        }

        if (location !== 'main') {
            layout.height = 20
        }
        layout.content = _.map(components, x => this._getComponentLayout(x))
        return layout
    }

    _getComponentLayout(component) {
        var layout = {}

        layout.type = 'react-component'
        layout.component = component.id
        layout.title = component.name
        layout.componentState = {}
        layout.props = _.clone(this.props);
        if (component.skipClose) {
            layout.isClosable = false
        }
        if (component.width) {
            layout.width = component.width
        }
        if (component.height) {
            layout.height = component.height
        }
        if (component.allowVerticalScroll) {
            layout.componentState.allowVerticalScroll = component.allowVerticalScroll
        }
        return layout
    }

    _setupContent(name, component) {
        this._layout.registerComponent(name, component)
    }

    render() {
        window.React = React
        window.ReactDOM = ReactDOM

        return (
            <div id="layoutContainer"/>
        )
    }

    _triggerComponentResizeEvent(component) {
        this._triggerEvent('layout-resize-' + component.config.component);
    }

    _triggerEvent(id) {
        console.log('EVENT: ' + id);
        $(document).trigger(id);
    }
}

export default GoldenLayoutComponent
