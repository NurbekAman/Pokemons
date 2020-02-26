define(['knockout', 'ojs/ojarraydataprovider', 'columns', 'ojs/ojknockout', 'ojs/ojlabel', 'ojs/ojinputtext', 'ojs/ojtable', 'ojs/ojcheckboxset'],
  function(ko, ArrayDataProvider, columns) {
    function PokemonViewModel(data) {
      const { pokemonData, pokemonForm, showPokemons, isChecked } = data;
      const { weight, height, name, types, moves } = pokemonData;

      this.image = ko.observable();
      this.weight = weight;
      this.height = height;
      this.name = name;
      this.numberOfMoves = moves.length;

      this.controls = ko.observableArray([
        { label: 'Weight', value: weight },
        { label: 'Height', value: height },
        { label: 'Name', value: name },
        { label: 'Number of moves', value: moves.length }
      ]);
      this.isChecked = ko.observable([isChecked ? 'checked' : '']);

      this.getUrlImage = () => {
        const { sprites } = pokemonForm || {};
        const { front_default } = sprites || {};
        return front_default ? front_default : ''
      }
      this.columns = columns.getTypesTable();
      this.dataProvider = ko.computed(() => {
        const pokemonTypes = types.reduce((acc, { type }) => {
          const { name } = type;
          return [...acc, { name }]
        }, []);
        return new ArrayDataProvider(pokemonTypes, { keyAttributes: 'name' });
      });

      this.onHandleClick = () => showPokemons(true);
    }

    return PokemonViewModel;
  }
);