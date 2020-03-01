define(['knockout', 'ojs/ojarraydataprovider', 'ojs/ojmodule-element-utils', 'utils', 'columns', 'ojs/ojtable', 'ojs/ojcheckboxset', 'ojs/ojoption', 'ojs/ojknockout', 'ojs/ojprogress'],
function(ko, ArrayDataProvider, moduleUtils, utils, columns) {
  function TableViewModel(data) {
    const { pokemonList, selectedPokemons, parentRouter } = data;
    this.dataProvider = ko.observable();
    this.showTable = ko.observable(true);
    this.widgetName = ko.observable('pie chart');
    this.selectedPokemons = selectedPokemons;
    this.columns = columns.POKEMON_TABLE;
    this.router = parentRouter;
    this.disableButton = ko.computed(() => {
      if (this.selectedPokemons().values().size) {
        return false;
      }

      return true;
    });

    this.onHandleClickSwitch = () => {
      const value = this.showTable();
      (value ? this.widgetName('table') : this.widgetName('pie chart'));
      const element = document.getElementById('containerPokemon');
      const startAngle = value ? '0deg' : '180deg';
      const endAngle = value ? '180deg' : '0deg';

      oj.AnimationUtils['flipOut'](element, { flipTarget: 'children', startAngle, endAngle, persist: 'all' });
      this.showTable(!value);
    }
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

    this.headerCheckedStatus = ko.pureComputed(() => {
      if (pokemonList.length === this.selectedPokemons().values().size) {
        return ['checked'];
      }

      return [];
    });

    this.onChangeCheckboxHeader = (event) => {
      const { detail: { value } } = event;

      if (value.length) {
        pokemonList.forEach(({ id }) => this.selectedPokemons.add([id]));
      } else {
        this.selectedPokemons.clear();
      }
    };

    this.buttonClick = ({ target: { id } }) => {
      const isChecked = this.selectedPokemons().has(+id);
      this.router.go('pokemonDetails');
      this.router.store({ pokemonId: id, isChecked });
    }

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