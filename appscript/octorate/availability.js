/**
 * Google Apps Script endpoint to proxy Octorate ICS availability for a room.
 * Usage: GET ?room=749778
 * Returns JSON: { roomId, unavailableRanges, unavailableDates, generatedAt }
 * Notes:
 * - Parses all-day DTSTART/DTEND from Octorate ICS; blocks nights from DTSTART to (DTEND - 1 day)
 * - Removes any PII by not exposing reservation details
 */

/** @typedef {{ start: string, end: string }} DateRange */

function doGet(e) {
  try {
    var roomId = (e && e.parameter && e.parameter.room) ? String(e.parameter.room) : '749778';
    // ICS feeds
    var icsBlockedUrl = 'https://admin.octorate.com/cron/ICS/calendar/ics.php?ics=' + roomId + '_';
    var icsReservationsUrl = 'https://admin.octorate.com/cron/ICS/reservation/googlecal/522604_' + roomId;

    var unavailableRanges = [];

    // Fetch blocked/closed periods
    var blocked = fetchTextSafe(icsBlockedUrl);
    if (blocked) {
      unavailableRanges = unavailableRanges.concat(parseIcsRanges(blocked));
    }

    // Also incorporate confirmed reservations (server-side only, no PII exposed)
    var reservations = fetchTextSafe(icsReservationsUrl);
    if (reservations) {
      unavailableRanges = unavailableRanges.concat(parseIcsRanges(reservations));
    }

    // Merge overlapping/adjacent ranges
    unavailableRanges = mergeRanges(unavailableRanges);

    // Expand to list of dates (YYYY-MM-DD) for quick client-side disable
    var unavailableDatesSet = {};
    unavailableRanges.forEach(function (r) {
      var d = new Date(r.start + 'T00:00:00');
      var end = new Date(r.end + 'T00:00:00');
      // r.end is checkout day; nights are until day before end
      var lastNight = new Date(end.getTime() - 24 * 60 * 60 * 1000);
      while (d <= lastNight) {
        var key = formatYmd(d);
        unavailableDatesSet[key] = true;
        d = new Date(d.getTime() + 24 * 60 * 60 * 1000);
      }
    });
    var unavailableDates = Object.keys(unavailableDatesSet).sort();

    var payload = {
      roomId: roomId,
      unavailableRanges: unavailableRanges,
      unavailableDates: unavailableDates,
      generatedAt: new Date().toISOString()
    };

    return ContentService
      .createTextOutput(JSON.stringify(payload))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    var errorPayload = { error: true, message: String(err && err.message || err) };
    return ContentService
      .createTextOutput(JSON.stringify(errorPayload))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * @param {string} url
 * @returns {string|null}
 */
function fetchTextSafe(url) {
  try {
    var res = UrlFetchApp.fetch(url, { muteHttpExceptions: true, followRedirects: true, validateHttpsCertificates: true });
    var code = res.getResponseCode();
    if (code >= 200 && code < 300) {
      return res.getContentText();
    }
    return null;
  } catch (e) {
    return null;
  }
}

/**
 * Parse ICS content for all-day DTSTART/DTEND ranges
 * @param {string} ics
 * @returns {DateRange[]}
 */
function parseIcsRanges(ics) {
  var lines = ics.split(/\r?\n/);
  var ranges = [];
  var current = { dtstart: null, dtend: null };
  lines.forEach(function (line) {
    if (line.indexOf('BEGIN:VEVENT') === 0) {
      current = { dtstart: null, dtend: null };
    }
    if (line.indexOf('DTSTART') === 0) {
      var startValue = line.split(':').pop().trim();
      current.dtstart = normalizeIcsDate(startValue);
    }
    if (line.indexOf('DTEND') === 0) {
      var endValue = line.split(':').pop().trim();
      current.dtend = normalizeIcsDate(endValue);
    }
    if (line.indexOf('END:VEVENT') === 0) {
      if (current.dtstart && current.dtend) {
        ranges.push({ start: current.dtstart, end: current.dtend });
      }
      current = { dtstart: null, dtend: null };
    }
  });
  return ranges;
}

/**
 * Normalize ICS DATE or DATE-TIME to YYYY-MM-DD (date part only)
 * @param {string} raw
 * @returns {string}
 */
function normalizeIcsDate(raw) {
  // Expect formats like 20250816 or 20250816T000000Z
  var y = raw.slice(0, 4);
  var m = raw.slice(4, 6);
  var d = raw.slice(6, 8);
  return y + '-' + m + '-' + d;
}

/**
 * Merge overlapping or contiguous ranges (where end of A equals start of B)
 * @param {DateRange[]} ranges
 * @returns {DateRange[]}
 */
function mergeRanges(ranges) {
  if (!ranges.length) return [];
  var sorted = ranges.slice().sort(function (a, b) {
    if (a.start < b.start) return -1; if (a.start > b.start) return 1; return 0;
  });
  var result = [sorted[0]];
  for (var i = 1; i < sorted.length; i++) {
    var prev = result[result.length - 1];
    var cur = sorted[i];
    // If cur starts before prev ends, or exactly at prev.end, extend prev
    if (cur.start <= prev.end) {
      if (cur.end > prev.end) prev.end = cur.end;
    } else {
      result.push(cur);
    }
  }
  return result;
}

/**
 * @param {Date} d
 * @returns {string}
 */
function formatYmd(d) {
  var y = d.getFullYear();
  var m = String(d.getMonth() + 1).padStart(2, '0');
  var day = String(d.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + day;
}


