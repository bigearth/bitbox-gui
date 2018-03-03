/*
 * action types
 */

export const CREATE_IMPORT_AND_EXPORT = 'CREATE_IMPORT_AND_EXPORT';
export const TOGGLE_EXPORT_COPIED = 'TOGGLE_EXPORT_COPIED';
export const IMPORT_STORE = 'IMPORT_STORE';
 
/*
 * action creators
 */

export function createImportAndExport() {
  return { type: CREATE_IMPORT_AND_EXPORT }
}

export function toggleExportCopied(value) {
  return { type: TOGGLE_EXPORT_COPIED, value }
}

export function importStore(store) {
  return { type: IMPORT_STORE, store }
}
