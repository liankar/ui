import React from 'react'
import BaseComponent from '../../HOC/BaseComponent'
import PropertiesContents from '../Properties/PropertiesContents'
import './styles.scss'
import { isEmptyObject } from '../../utils/util'

class Summary extends BaseComponent {
    constructor(props) {
        super(props)

        this.state = {
            data: {},
        }
    }

    componentDidMount() {
        this.subscribeToSharedState('summary', (data) => {
            this.setState({ data })
        })
    }

    render() {
        const { data } = this.state
        if (!isEmptyObject(data)) {
            return (
                <div id="summary" className="summary">
                    {Object.values(data).map((block) => (
                        <div className="summary-container" key={block.id}>
                            <label>{block.title}</label>
                            <div className="summary-container-inner">
                                <PropertiesContents group={block} />
                            </div>
                        </div>
                    ))}
                </div>
            )
        }
        return <div className="loading-placeholder">Loading...</div>
    }
}

export default Summary
