import { computed, provide, h, defineComponent } from 'vue';
import { normalizeChildren } from './utils/vnode';
import { useForm } from './useForm';
import { ValidationFlags, SubmissionHandler, Flag } from './types';

export const ValidationObserver = defineComponent({
  name: 'ValidationObserver',
  inheritAttrs: false,
  props: {
    as: {
      type: String,
      default: undefined,
    },
    validationSchema: {
      type: Object,
      default: undefined,
    },
  },
  setup(props, ctx) {
    const { form, errors, validate, handleSubmit, handleReset, values, meta } = useForm({
      validationSchema: props.validationSchema,
    });

    provide('$_veeObserver', form);
    const unwrappedMeta = computed(() =>
      Object.keys(meta).reduce((acc: ValidationFlags, key) => {
        acc[key as Flag] = meta[key as Flag].value;

        return acc;
      }, {} as ValidationFlags)
    );

    const slotProps = computed(() => {
      return {
        meta: unwrappedMeta.value,
        errors: errors.value,
        values: values.value,
        validate,
        handleSubmit,
        handleReset,
      };
    });

    const onSubmit = handleSubmit(ctx.attrs.onSubmit as SubmissionHandler);
    function handleFormReset() {
      handleReset();
      if (typeof ctx.attrs.onReset === 'function') {
        ctx.attrs.onReset();
      }
    }

    return () => {
      const children = normalizeChildren(ctx, slotProps.value);
      if (props.as) {
        return h(
          props.as,
          {
            // Disables native validation as vee-validate will handle it.
            novalidate: true,
            ...ctx.attrs,
            onSubmit,
            onReset: handleFormReset,
          },
          children
        );
      }

      return children;
    };
  },
});