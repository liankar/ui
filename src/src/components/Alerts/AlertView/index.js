import React, { useState } from 'react'
import cx from 'classnames'
import { sortSeverity, uniqueMessages, uniqueObjects } from '../../../utils/util';
import DnPath from '../../GenerateDnPath';
import * as DnUtils from '@kubevious/helpers/dist/dn-utils'

const AlertView = ({ alerts, clickDn, openRule, groupPreset }) => {
    const [group, setGroup] = useState(groupPreset || 'no')

    const clickMessage = (alert) => {
        if (alert.source.kind === 'rule') {
            openRule(alert.source.id)
        }
    }

    const renderAlert = ({ alert, index, shouldRenderDn = true }) => {
        return (
            <div className={cx('alert-detail', { 'even': index % 2 !== 0 })} key={alert.uiKey}>
                <div className={cx('message-container', { 'rule': alert.source.kind === 'rule' })}
                     onClick={() => clickMessage(alert)}>
                    <div className={'alert-item ' + alert.severity} />
                    {alert.msg}
                </div>

                {shouldRenderDn && renderDnParts(alert.dn)}
            </div>
        )
    }

    const renderDnParts = (dn) => {
        const dnParts = DnUtils.parseDn(dn).slice(1)

        return (
            <div className="dn-container" key={dn} onClick={() => clickDn(dn)}>
                <div className="logo-container">
                    <img className="dn-logo" src="/img/entities/ns.svg" alt="logo" />
                </div>
                <div className="parts-container">
                    <DnPath dnParts={dnParts} />
                </div>
            </div>
        )
    }

    const renderMessageGroup = () => {
        const messages = uniqueMessages(alerts.map(({ msg, severity, source }) => ({ msg, severity, source })))
            .map(m => ({
                ...m,
                alerts: alerts.filter(a => a.severity === m.severity && a.msg === m.msg),
            })).sort(sortSeverity)

        return (
            <>
                {messages.map((message, index) => (
                    <div className="message-group-container" key={index}>
                        <div className={cx('message-container', { 'rule': message.source.kind === 'rule' })} onClick={() => clickMessage(message)}>
                            <div className={'alert-item ' + message.severity} />
                            {message.msg}
                        </div>

                        <div className="message-objects">
                            {message.alerts.map(alert => renderDnParts(alert.dn))}
                        </div>
                    </div>
                ))}
            </>
        )
    }

    const renderObjectGroup = () => {
        const objects = uniqueObjects(alerts.map(({ dn }) => ({ dn })))
            .map(o => ({
                ...o,
                alerts: alerts.filter(a => a.dn === o.dn),
            }))

        return (
            <>
                {objects.map((object, index) => (
                    <div className="message-group-container" key={index}>
                        <div className="object-container">
                            {renderDnParts(object.dn)}
                        </div>

                        <div className="message-objects">
                            {object.alerts.map(alert => renderAlert({ alert, shouldRenderDn: false }))}
                        </div>
                    </div>
                ))}
            </>
        )
    }

    return (
        <div className="AlertView-container">
            <div className={`alerts group-${group}`}>
                {group === 'no' && (
                    <>
                        {alerts.map((alert, index) =>
                            renderAlert({ alert, index })
                        )}
                    </>
                )}

                {group === 'message' && renderMessageGroup()}

                {group === 'object' && renderObjectGroup()}
            </div>

            {!groupPreset && (
                <div className="group-options">
                    <div
                        className={cx('option', { selected: group === 'no' })}
                        onClick={() => setGroup('no')}
                    >
                        No Group
                    </div>

                    <div
                        className={cx('option', {
                            selected: group === 'object',
                        })}
                        onClick={() => setGroup('object')}
                    >
                        Group by Object
                    </div>

                    <div
                        className={cx('option', {
                            selected: group === 'message',
                        })}
                        onClick={() => setGroup('message')}
                    >
                        Group by Alert
                    </div>
                </div>
            )}
        </div>
    )
}

export default AlertView
