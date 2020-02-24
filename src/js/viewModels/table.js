const filterPokemonData = (pokemons) => {
  const getTypesInString = (types) => types.reduce((acc, { type: { name } }, index) => {
    if (index === types. length - 1) {
      return acc + name;
    }

    return acc + name + ', '
  }, '')

  return pokemons.map((pokemon) => {
    const { id, name, weight, height, moves, types } = pokemon;

    return {
      isChecked: false,
      id,
      name,
      height,
      weight,
      numberOfMoves: moves.length ? moves.length : 0,
      types: types.length ?  getTypesInString(types) : '',
    };
  })
}

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

define(['knockout', 'ojs/ojarraydataprovider', 'ojs/ojknockout-keyset', 'ojs/ojmodule-element-utils', 'ojs/ojtable', 'ojs/ojcheckboxset', 'ojs/ojoption'],
function(ko, ArrayDataProvider, keySet, moduleUtils) {
  function TableViewModel(data) {
    const self = this;
    const { pokemonList, selectPokemonId } = data;
    // table
    self.columns = ko.observable([]);
    self.dataProvider = ko.observable();
    self.selectedPokemons = new keySet.ObservableKeySet();
    self.headerCheckedStatus = ko.observable([]);
    self.columns(COLUMNS);
    self.dataProvider = ko.computed(() => {
      const pokemonsData = filterPokemonData(pokemonList);
      return new ArrayDataProvider(pokemonsData, { keyAttributes: 'id' });
    });

    self.onChangeCheckbox = (event) => {
      const { detail } = event;
      const { value, previousValue } = detail;
      const id = value[0];
      const previousId = previousValue[0];

      if (!id && self.selectedPokemons().has(previousId)) {
        self.selectedPokemons.delete([previousId]);
      }

      if (id && !self.selectedPokemons().has(id)) {
        self.selectedPokemons.add([id]);
      }

    }

    self.handleCheckbox = (id) => {
      const a = self.selectedPokemons();
      const isChecked = self.selectedPokemons().has(id);
      return isChecked ? [id] : [];
    }

    self.onChangeCheckboxHeader = (event) => {
      const { detail: { value } } = event;

      if (value.length) {
        self.selectedPokemons.addAll();
      } else {
        self.selectedPokemons.clear();
      }
    }

    self.buttonClick = (event) => {
      const { target: { id } } = event;
      selectPokemonId(id);
    }

    self.moduleConfig = ko.computed(() => {
      const selectedList = [...self.selectedPokemons().values()];
      const pieData = selectedList.reduce((acc, selectedId) => {
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