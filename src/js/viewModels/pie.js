define(['knockout', 'utils', 'ojs/ojarraydataprovider', 'ojs/ojchart', 'ojs/ojknockout'],
  function(ko, utils, ArrayDataProvider) {
    function PieViewModel(data) {
      const self = this;
      const { types } = data;

      self.dataProvider = ko.computed(() => {
        const pokemonTypes =  utils.getPokemonTypesCount(types);

        const pieData = pokemonTypes.map(({ name, count }, index) => ({
          id: index + 1,
          series: name,
          group: 'Group A',
          value: count
        }));

        return new ArrayDataProvider(pieData, { keyAttributes: 'id' });
      });
    }

    return PieViewModel;
});
