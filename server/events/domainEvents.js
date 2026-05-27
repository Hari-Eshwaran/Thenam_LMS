import { EventEmitter } from "node:events";

export const domainEvents = new EventEmitter();
domainEvents.setMaxListeners(100);

export function publishDomainEvent(eventName, payload = {}) {
  domainEvents.emit("domain-event", {
    eventName,
    payload,
    timestamp: new Date().toISOString(),
  });
  domainEvents.emit(eventName, payload);
}
