import _ from 'the-lodash'
import moment from 'moment'
import { prettyKind as helperPrettyKind, FLAG_TOOLTIPS } from '@kubevious/helpers/dist/docs'

export const prettyKind = (kind) => {
    var value = helperPrettyKind(kind);
    if (!value) {
        value = _.upperFirst(kind);
    }
    return value;
}

export const flagTooltip = (name) => {
    var value = FLAG_TOOLTIPS[name];
    if (!value) {
        value = null;
    }
    return value;
}

export function getNodeLogoUrl(kind) {
    return `/img/entities/${kind}.svg`
}

var todayStr = moment(new Date()).format('YYYY-MM-DD')

export function formatDate(date) {
    var dayStr = moment(date).format('YYYY-MM-DD')
    var timeStr = moment(date).format('hh:mm:ss A')
    if (todayStr === dayStr) {
        return timeStr
    } else {
        return dayStr + ' ' + timeStr
    }
}
