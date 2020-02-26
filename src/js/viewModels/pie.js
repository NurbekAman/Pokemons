define(['knockout', 'ojs/ojarraydataprovider', 'utils', 'ojs/ojchart', 'ojs/ojknockout'],
  function(ko, ArrayDataProvider, utils) {
    function PieViewModel(data) {
      const { types } = data;

      this.dataProvider = ko.computed(() => {
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
