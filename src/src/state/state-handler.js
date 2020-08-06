import _ from 'the-lodash'
import { splitDn } from '../utils/naming-utils'
import FieldsSaver from '../utils/save-fields';

class StateHandler {
    constructor(sharedState, diagramService) {
        if (!sharedState) {
            throw new Error("SharedState not provided");
        }
        if (!diagramService) {
            throw new Error("DiagramService not provided");
        }

        this.sharedState = sharedState.user();
        this._service = diagramService;
        this._fieldsSaver = new FieldsSaver('Diagram')
        this._setup();
    }

    close()
    {
        this._service.close();
        this.sharedState.close();
    }

    _setup() {
        this.sharedState.set('is_loading', false)
        this.sharedState.set('is_error', false)
        this.sharedState.set('error', null)
        this.sharedState.set('diagram_expanded_dns', { 'root': true });

        this._handleDefaultParams()
        this._handleSelectedDnAutoExpandChange()
        this._handleTimeMachineChange()
        this._handleSelectedObjectChange()
        this._handleSelectedObjectAssetsChange()
        this._handleTimelineDataChange()
        this._handleMarkerListChange()
    }

    _handleDefaultParams() {
        const params = new URLSearchParams(window.location.search)

        const fields = this._fieldsSaver.decodeParams(params)

        const { sd, tme, tmdat, tmdt, tmdf, tmtd, tmdu } = fields

        if (tme) {
            this.sharedState.set('time_machine_enabled', tme === 'true')
        }

        if (tmdat) {
            this.sharedState.set('time_machine_date', tmdat)
        }

        if (tmdt) {
            this.sharedState.set('time_machine_date_to', Date.parse(tmdt))
        }

        if (tmdf) {
            this.sharedState.set('time_machine_date_from', Date.parse(tmdf))
        }

        if (tmtd) {
            this.sharedState.set('time_machine_target_date', Date.parse(tmtd))
        }

        if (sd) {
            this.sharedState.set('selected_dn', sd)
            this.sharedState.set('auto_pan_to_selected_dn', true);
        }

        if (tmdu) {
            this.sharedState.set('time_machine_duration', tmdu)
        }
    }

    _handleSelectedDnAutoExpandChange()
    {
        this.sharedState.subscribe('selected_dn',
            ( selected_dn ) => {
                if (selected_dn) {
                    var dict = this.sharedState.get('diagram_expanded_dns');
                    var parts = splitDn(selected_dn);
                    var dn = parts[0];
                    for(var i = 1; i < parts.length - 1; i++)
                    {
                        dn = dn + '/' + parts[i];
                        dict[dn] = true;
                    }
                    this.sharedState.set('diagram_expanded_dns', dict, { skipCompare: true });
                }
            });
    }

    _handleTimeMachineChange() {
        // TODO: .....
        this.sharedState.subscribe(['time_machine_enabled', 'time_machine_date'],
            ({ time_machine_enabled, time_machine_date }) => {
            console.log('time_machine_enabled', time_machine_enabled)
                if (time_machine_enabled) {
                    this._service.fetchHistorySnapshot(time_machine_date, (sourceData) => {

                        if (this.sharedState.get('time_machine_enabled') &&
                            (this.sharedState.get('time_machine_date') === time_machine_date ))
                        {
                            this.sharedState.set('diagram_data', sourceData);
                        }
                    })
                }
            })
    }

    _handleSelectedObjectChange() {

        this.sharedState.subscribe(['selected_dn', 'time_machine_enabled', 'time_machine_date'],
            ({ selected_dn, time_machine_enabled, time_machine_date }) => {

                if (selected_dn) {
                    if (time_machine_enabled) {
                        this._service.fetchHistoryProperties(selected_dn, time_machine_date, (config) => {
                            this.sharedState.set('selected_object_assets', config);
                        })
                    }
                } else {
                    this.sharedState.set('selected_object_assets', null);
                }
            });

    }

    _handleSelectedObjectAssetsChange() {
        this.sharedState.subscribe('selected_object_assets',
            (selected_object_assets) => {
                if (selected_object_assets) {
                    this.sharedState.set('selected_object_props', selected_object_assets.props);
                    this.sharedState.set('selected_object_alerts', selected_object_assets.alerts);
                } else {
                    this.sharedState.set('selected_object_props', []);
                    this.sharedState.set('selected_object_alerts', []);
                }
            })
    }

    _handleTimelineDataChange() {
        this.sharedState.subscribe(['time_machine_date_from', 'time_machine_date_to'],
            ({ time_machine_date_from, time_machine_date_to }) => {

                if (!time_machine_date_from || !time_machine_date_to) {
                    this.sharedState.set('time_machine_timeline_data', null);
                    this.sharedState.set('time_machine_actual_date_from', null);
                    this.sharedState.set('time_machine_actual_date_to', null);

                    return;
                }

                var from = time_machine_date_from ? new Date(time_machine_date_from) : time_machine_date_from.toISOString()
                var to = time_machine_date_to ? new Date(time_machine_date_to) : time_machine_date_to.toISOString()

                this._service.fetchHistoryTimeline(from, to, data => {
                    for(var x of data)
                    {
                        x.date = new Date(x.date);
                    }
                    var orderedData = _.orderBy(data, ['date'], ['asc']);
                    this.sharedState.set('time_machine_timeline_data', orderedData);

                    this.sharedState.set('time_machine_actual_date_from', time_machine_date_from);
                    this.sharedState.set('time_machine_actual_date_to', time_machine_date_to);

                });

            }
        )
    }

    _handleMarkerListChange()
    {
        this.sharedState.subscribe('marker_editor_items',
            (marker_editor_items) => {

                var markerDict = {};
                if (marker_editor_items) {
                    markerDict = _.makeDict(marker_editor_items,
                        x => x.name,
                        x => ({
                            shape: x.shape,
                            color: x.color
                        }))
                }

                this.sharedState.set('markers_dict', markerDict);
            });
    }

}

export default StateHandler;
