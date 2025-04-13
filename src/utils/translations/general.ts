
// If this file doesn't exist yet, create it
export const generalKeys = [
  'cancel',
  'save',
  'create',
  'edit',
  'delete',
  'loading',
  'error',
  'success',
  'submit',
  'back',
  'next',
  'previous',
  'done',
  'continue',
  'confirm',
  'selectAll',
  'deselectAll',
  'search',
  'filter',
  'sort',
  'clear',
  'reset',
  'optional',
  'required',
  'optionalField',
  'pleaseTryAgainLater',
] as const;

export type GeneralKey = typeof generalKeys[number];
