import React from 'react'
import _ from 'the-lodash'
import cx from 'classnames'
import DnShortcutComponent from '../../DnShortcutComponent'

import './styles.scss'

import PropertiesValue from '../helpers'

const PropertiesTable = ({ config, options, state }) => {

    const tableHeaders = () => {
        return config.headers.map((x) => {
            let column = {}
            if (_.isObject(x)) {
                column.name = x.id
                if (x.label) {
                    column.label = x.label
                }

                if (x.kind) {
                    column.formatter = x.kind
                }
            } else {
                column.name = x
            }
            if (!column.label) {
                column.label = column.name
            }
            return column
        })
    }

    const renderRow = (row, column) => {
        let cell = row
        if (column.name) {
            cell = row[column.name]
        }

        return (
            <td key={column.name}>
                {column.formatter
                    ? renderColumnFormatter(column.formatter, cell)
                    : PropertiesValue(cell)}
            </td>
        )
    }

    const renderColumnFormatter = (formatter, cell) => {
        if (formatter === 'check') return renderRowCheckbox(cell)
        if (formatter === 'shortcut')
            return (
                <DnShortcutComponent
                    dn={cell}
                    state={state}
                    options={options}
                />
            )
    }

    const renderRowCheckbox = (value) => (
        <div
            className={cx('properties-checkbox', {
                checked: value,
                unchecked: !value,
            })}
        />
    )

    return (
        <div className="PropertiesTable-container">
            <table className="table table-striped table-dark">
                <thead>
                    <tr>
                        {tableHeaders().map((item) => (
                            <th key={item.name}>{item.label || item.name}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {config &&
                        config.rows.map((row, index) => (
                            <tr key={index}>
                                {tableHeaders().map((column) =>
                                    renderRow(row, column)
                                )}
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    )
}

export default PropertiesTable
