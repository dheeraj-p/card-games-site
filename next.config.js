module.exports = {
  trailingSlash: true,
  exportPathMap: function() {
    return {
      '/': { page: '/' },
      '/solitaire' : {page: '/solitaire'}
    };
  }
};