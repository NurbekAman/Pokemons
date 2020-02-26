define(['knockout', 'ojs/ojconverterutils-i18n', 'ojs/ojarraydataprovider', 'columns', 'ojs/ojlabel', 'ojs/ojinputtext', 'ojs/ojtable', 'ojs/ojcheckboxset'],
  function(ko, ConvertUtils, ArrayDataProvider, columns) {
    function PokemonViewModel(data) {
      const { pokemonData, pokemonForm, showPokemons, isChecked } = data;
      const { weight, height, name, types, moves } = pokemonData;

      this.image = ko.observable();
      this.weight = weight;
      this.height = height;
      this.name = name;
      this.numberOfMoves = moves.length;
      this.initials = ConvertUtils.IntlConverterUtils.getInitials(name);

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

      this.onHandleClick = () => {
        showPokemons(true);
      }
    }

    return PokemonViewModel;
  }
);