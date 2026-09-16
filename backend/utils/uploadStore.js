// utils/uploadStore.js
//
// The upload flow is two calls: /upload/preview (parses the file, suggests
// a mapping) and /upload/confirm (admin's final mapping, actually saves).
// This tiny in-memory store keeps the temp file path + parsed headers
// between those two calls, keyed by an uploadId.
//
// NOTE: this is process-local. Fine for a single server instance. If this
// ever runs behind a load balancer with multiple instances, swap this for
// a shared store (e.g. a Mongo "PendingUpload" collection) so preview and
// confirm can land on different instances.

const fs = require('fs');

const store = new Map(); // uploadId -> { filePath, type, headers, createdAt }

const TTL_MS = 30 * 60 * 1000; // 30 minutes

const create = (uploadId, data) => {
  store.set(uploadId, { ...data, createdAt: Date.now() });
};

const get = (uploadId) => {
  const entry = store.get(uploadId);
  if (!entry) return null;
  if (Date.now() - entry.createdAt > TTL_MS) {
    remove(uploadId);
    return null;
  }
  return entry;
};

const remove = (uploadId) => {
  const entry = store.get(uploadId);
  if (entry?.filePath) {
    fs.unlink(entry.filePath, () => {}); // best-effort cleanup
  }
  store.delete(uploadId);
};

// Sweep expired entries periodically so abandoned uploads don't sit forever
setInterval(() => {
  const now = Date.now();
  for (const [id, entry] of store.entries()) {
    if (now - entry.createdAt > TTL_MS) remove(id);
  }
}, 5 * 60 * 1000);

module.exports = { create, get, remove };