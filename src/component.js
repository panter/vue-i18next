export default {
  name: 'i18next',
  functional: true,
  props: {
    tag: {
      type: String,
      default: 'span',
    },
    path: {
      type: String
    },
    format: {
      type: String
    }
  },
  render(h, { props, data, children, parent }) {
    const i18next = parent.$i18n;
    if (!i18next) {
      return h(props.tag, data, children);
    }

    const path = props.path;

    const REGEXP = i18next.i18next.services.interpolator.regexp;
    const format = props.format || i18next.t(path, { interpolation: { prefix: '#$?', suffix: '?$#' } });
    const tchildren = [];

    format.split(REGEXP).reduce((memo, match, index) => {
      let child;
      if (index % 2 === 0) {
        if (match.length === 0) return memo;

        child = match;
      } else {
        const place = match.trim();
        if (isNaN(parseFloat(place)) || !isFinite(place)) {
          children.forEach((e) => {
            if (!child && e.data && e.data.attrs && e.data.attrs.place && e.data.attrs.place === place) {
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
  },
};
