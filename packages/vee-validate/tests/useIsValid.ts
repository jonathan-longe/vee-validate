import flushPromises from 'flush-promises';
import { useIsFormValid, useField, useIsFieldValid, useForm } from '@/vee-validate';
import { mountWithHoc, setValue } from './helpers';

const REQUIRED_MESSAGE = 'Field is required';
const validate = (val: any) => (val ? true : REQUIRED_MESSAGE);

describe('useIsFieldValid()', () => {
  test('returns the validity of a single field', async () => {
    mountWithHoc({
      setup() {
        useForm();
        const { value } = useField('test', validate);
        const isValid = useIsFieldValid('test');

        return {
          value,
          isValid,
        };
      },
      template: `
      <input name="field" v-model="value" />
      <span>{{ isValid.toString() }}</span>
    `,
    });
    await flushPromises();

    const input = document.querySelector('input');
    const span = document.querySelector('span');
    setValue(input as any, '');
    await flushPromises();
    expect(span?.textContent).toBe('false');
    setValue(input as any, '12');
    await flushPromises();
    expect(span?.textContent).toBe('true');
  });
});

describe('useIsFormValid()', () => {
  test('returns validity of the form', async () => {
    mountWithHoc({
      setup() {
        useForm();
        const { value } = useField('test', validate);
        const isValid = useIsFormValid();

        return {
          value,
          isValid,
        };
      },
      template: `
      <input name="field" v-model="value" />
      <span>{{ isValid.toString() }}</span>
    `,
    });

    await flushPromises();
    const input = document.querySelector('input');
    const span = document.querySelector('span');
    setValue(input as any, '');
    await flushPromises();
    expect(span?.textContent).toBe('false');
    setValue(input as any, '12');
    await flushPromises();
    expect(span?.textContent).toBe('true');
  });
});
