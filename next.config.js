module.exports = {
  trailingSlash: true,
  exportPathMap: function() {
    return {
      '/': { page: '/' },
      '/games/solitaire' : {page: '/games/solitaire'}
    };
  }
};