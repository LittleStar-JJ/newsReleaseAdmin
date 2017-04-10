/**
 * Created by leeqj on 16/9/9.
 */
let singletonEventBus = Symbol('a')
let singletonEventBusEnforcer = Symbol('b')
export default class EventBus {
    constructor(singletonEventBus) {
        if (singletonEventBus !== singletonEventBusEnforcer) {
            throw new Error('Cannot construct singleton EventBus')
        }
    }
    /**
     * @returns Singleton of EventBus
     */
    static get instance() {
        if (!this[singletonEventBus]) {
            const app = new EventBus(singletonEventBusEnforcer)
            app.subscribers = new Map([['any', []]])
            app.init()
            this[singletonEventBus] = app
        }
        return this[singletonEventBus]
    }

    on = (fn, action = 'any') => {
        let subs = this.subscribers
        if (!subs.get(action)) return subs.set(action, [fn])
        subs.set(action, (subs.get(action).push(fn)))
    }

    emit = (content, action = 'any') => {
        for (let fn of this.subscribers.get(action)) {
            fn(content)
        }
    }

    init = () => {
        window.addEventListener('message', this.receiveMessage, false)
    }

    receiveMessage = (event) => {
        if (event.origin !== location.origin) return // || (event.origin.includes(location.host) && location.hostname !== 'localhost')
        let message = event.data
        if (typeof message === 'string' && message.match('^{(.+:.+,*){1,}}$')) {
            message = eval('(' + message + ')')
            const { action, data } = message
            if (action) {
                if (action) {
                    this.emit(data, action)
                }
            }
        }
    }

    dispatch = (action, data = '') => {
        if (typeof action !== 'string') {
            throw new Error('EventBus action must be string')
        }
        let senderAction = {
            action : action,
            data   : data
        }
        senderAction = JSON.stringify(senderAction)
        window.postMessage(senderAction, location.origin)// location.hostname
    }
}
