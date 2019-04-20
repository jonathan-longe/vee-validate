import VeeValidate from './plugin';
import directive from './directive';
import en from '../locale/en';
import * as Rules from './rules';
import Validator from './core/validator';
import { mapValidationState } from './mapValidationState';
import { mapValidationActions } from './mapValidationActions';
import { assign } from './utils';
import { ValidationProvider, ValidationObserver, withValidation } from './components';

const version = '__VERSION__';

const RulesAsList: any[] = Object.keys(Rules).map(key => ({ rule: (Rules as any)[key], name: key }));

RulesAsList.forEach(({ name, rule }) => {
  Validator.extend(name, rule.validate, assign({}, rule.options, { paramNames: rule.paramNames }));
});

// Merge the english messages.
Validator.localize({ en });

const install = VeeValidate.install;

export {
  install,
  directive,
  Validator,
  Rules,
  version,
  ValidationProvider,
  ValidationObserver,
  withValidation,
  mapValidationState,
  mapValidationActions
};

export default {
  ...VeeValidate,
  directive,
  Validator,
  Rules,
  version,
  ValidationProvider,
  ValidationObserver,
  withValidation,
  mapValidationState,
  mapValidationActions
};