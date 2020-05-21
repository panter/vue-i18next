export default {
  name: 'i18next',
  functional: true,
  props: {
    tag: {
      type: String,
      default: 'span'
    },
    path: {
      type: String,
      required: true
    },
    options: {
      type: Object
    }
  },
  render(h, { props, data, children, parent }) {
    const i18next = parent.$i18n;
    const $t = parent.$t.bind(parent);
    if (!i18next || !$t) {
      return h(props.tag, data, children);
    }

    const { path } = props;
    const options = props.options || {};

    const REGEXP = i18next.i18next.services.interpolator.regexp;
    const i18nextOptions = {
      ...options,
      interpolation: { prefix: '#$?', suffix: '?$#' }
    };
    const format = $t(path, i18nextOptions);
    const tchildren = [];

    format.split(REGEXP).reduce((memo, match, index) => {
      let child;
      if (index % 2 === 0) {
        if (match.length === 0) return memo;

        child = match;
      } else {
        const place = match.trim();
        // eslint-disable-next-line no-restricted-globals
        if (isNaN(parseFloat(place)) || !isFinite(place)) {
          children.forEach(e => {
            if (
              !child &&
              e.data && // Skip text nodes
              e.data.attrs &&
              e.data.attrs.place &&
              e.data.attrs.place === place
            ) {
              child = e;
            }
          });
        } else {
          child = children[parseInt(match, 10)];
        }
      }

      memo.push(child);
      return memo;
    }, tchildren);

    return h(props.tag, data, tchildren);
  }
};
