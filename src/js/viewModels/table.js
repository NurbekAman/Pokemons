const COLUMNS = [
  { headerText: 'Enabled', field: 'isChecked', id: 'column1', template: 'checkTemplate', headerTemplate: 'checkTemplateHeader' },
  { headerText: 'id', field: 'id' },
  { headerText: 'name', field: 'name' },
  { headerText: 'height', field: 'height' },
  { headerText: 'weight', field: 'weight' },
  { headerText: 'number of moves', field: 'numberOfMoves' },
  { headerText: 'types', field: 'types' },
  { headerText: 'Actions', field: 'id', template: 'viewButtonTemplate', id: 'column8' }
];

define(['knockout', 'ojs/ojarraydataprovider', 'ojs/ojknockout-keyset', 'ojs/ojmodule-element-utils', 'utils', 'ojs/ojtable', 'ojs/ojcheckboxset', 'ojs/ojoption', 'ojs/ojknockout', 'ojs/ojprogress'],
function(ko, ArrayDataProvider, keySet, moduleUtils, utils) {
  function TableViewModel(data) {
    const { pokemonList, selectPokemonId } = data;
    this.columns = ko.observable(COLUMNS);
    this.dataProvider = ko.observable();
    this.selectedPokemons = new keySet.ObservableKeySet();
    this.headerCheckedStatus = ko.observable([]);

    this.dataProvider = ko.computed(() => {
      return new ArrayDataProvider(utils.getTableData(pokemonList), { keyAttributes: 'id' });
    });

    this.onChangeCheckbox = ({ detail }) => {
      const { value, previousValue } = detail;
      const id = value[0];
      const previousId = previousValue[0];

      if (id) {
        this.selectedPokemons.add([id]);
      } else {
        this.selectedPokemons.delete([previousId]);
      }
    };

    this.handleCheckbox = (id) => {
      const isChecked = this.selectedPokemons().has(id);
      return isChecked ? [id] : [];
    };

    this.onChangeCheckboxHeader = (event) => {
      const { detail: { value } } = event;

      if (value.length) {
        pokemonList.forEach(({ id }) => this.selectedPokemons.add([id]));
      } else {
        this.selectedPokemons.clear();
      }
    };

    this.buttonClick = ({ target: { id } }) => selectPokemonId(id);

    this.moduleConfig = ko.computed(() => {
      const set = this.selectedPokemons().values();
      const pieData = [...set].reduce((acc, selectedId) => {
        const pokemon = pokemonList.find(({ id }) => selectedId === id );

        if (pokemon) {
          const { types } = pokemon;

          return [...acc, ...types];
        }

        return acc;
      }, []);

      return moduleUtils.createConfig({ name: 'pie', params: { types: pieData } })
    });
  }

  return TableViewModel;
});