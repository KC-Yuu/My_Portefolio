import { SEASONS } from './season';

// Stringified IIFE injected via dangerouslySetInnerHTML into <head>.
// Runs synchronously before React hydrates; sets data-season on <html>
// using localStorage value (if valid) or computed real season.
// SEASONS is embedded as JSON at build time so this stays in sync with season.ts.
const SEASONS_JSON = JSON.stringify(SEASONS);

export const noFoucScript = `(function(){
  try {
    var S=${SEASONS_JSON};
    var stored = localStorage.getItem('season');
    var season = S.indexOf(stored) >= 0 ? stored : null;
    if (!season) {
      var m = new Date().getUTCMonth();
      season = m>=2&&m<=4?S[0]:m>=5&&m<=7?S[1]:m>=8&&m<=10?S[2]:S[3];
    }
    document.documentElement.setAttribute('data-season', season);
  } catch(e) {}
})();`;
