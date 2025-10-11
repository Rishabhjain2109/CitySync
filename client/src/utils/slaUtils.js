// src/utils/slaUtils.js

/**
 * Check whether a complaint has breached its SLA.
 * @param {Date | string} createdAt - Complaint creation time.
 * @param {number} slaHours - SLA limit in hours (default = 48).
 * @returns {boolean} true if SLA is breached, false otherwise.
 */
export const checkSLA = (createdAt, slaHours = 0) => {
  const created = new Date(createdAt);
  const now = new Date();
  const hoursPassed = (now - created) / (1000 * 60 * 60);
  return hoursPassed > slaHours;
};

/**
 * Get the time remaining before SLA expires.
 * @param {Date | string} createdAt - Complaint creation time.
 * @param {number} slaHours - SLA limit in hours (default = 48).
 * @returns {string} human-readable time remaining or "Expired".
 */
export const getTimeRemaining = (createdAt, slaHours = 48) => {
  const created = new Date(createdAt);
  const now = new Date();
  const diff = slaHours * 3600000 - (now - created);

  if (diff <= 0) return "Expired";

  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  return `${hours}h ${minutes}m left`;
};

/**
 * Sort complaints so that SLA-breached (overdue) ones come first.
 * Optionally sorts by creation date (newest first) within each group.
 * @param {Array} complaints - List of complaints.
 * @returns {Array} sorted complaints with SLA info added.
 */
export const sortComplaintsBySLA = (complaints, slaHours = 48) => {
  const updatedComplaints = complaints.map((c) => ({
    ...c,
    isOverdue: checkSLA(c.createdAt, c.slaHours || slaHours),
  }));

  return updatedComplaints.sort((a, b) => {
    if (a.isOverdue === b.isOverdue) {
      return new Date(b.createdAt) - new Date(a.createdAt); // latest first
    }
    return a.isOverdue ? -1 : 1; // overdue first
  });
};
