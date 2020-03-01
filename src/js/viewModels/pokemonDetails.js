define(['knockout', 'ojs/ojarraydataprovider', 'columns', 'ojs/ojknockout', 'ojs/ojlabel', 'ojs/ojinputtext', 'ojs/ojtable', 'ojs/ojcheckboxset', 'ojs/ojprogress'],
  function(ko, ArrayDataProvider, columns) {
    function PokemonViewModel(data) {
      const { pokemonList, parentRouter } = data;
      this.columns = columns.TYPES_TABLE;
      this.router = parentRouter;

      // define when pokemons is checked
      this.isChecked = ko.observable();
      // types of the pokemon
      this.types = ko.observableArray();
      // details of the pokemon
      this.controls = ko.observableArray();
      // image of the pokemon
      this.getUrlImage = ko.observable();
      // url where we could get the image of the pokemon
      this.urlForm = ko.observable();
      this.pokemonId = ko.observable();
      this.loading = ko.observable();
      this.error = ko.observable('');

      ko.computed(() => {
        const stateParams = this.router.observableModuleConfig().params.ojRouter.parameters;
        if (stateParams && stateParams.pokemonId) {
          const pokemonId = stateParams.pokemonId();
          const isChecked = stateParams.isChecked();

          const pokemonData = pokemonList.find(({ id }) => id == pokemonId);

          if (pokemonData) {
            const { weight, height, name, types, moves, forms } = pokemonData;

            this.isChecked([isChecked === 'true' ? 'checked' : '']);
            this.types(types);
            this.pokemonId(pokemonId);

            const { url } = forms[0] || {};
            this.urlForm(url);
            this.controls([
              { label: 'Weight', value: weight },
              { label: 'Height', value: height },
              { label: 'Name', value: name },
              { label: 'Number of moves', value: moves.length }
            ]);
          } else {
            this.error('no details');
          }
        }
      });

      this.connected = () => {
        const self = this;
        const urlForm = this.urlForm();

        if (urlForm) {
          self.loading(true);
          $.ajax({
            type: "GET",
            url: urlForm,
            dataType: 'json',
            contentType: 'application/json',
            success: function(res) {
              const { sprites } = res || {};
              const { front_default } = sprites || {};
              self.getUrlImage(front_default);
              self.loading(false);
            },
            failure: function() {
              self.loading(false);
            }
          });
        }
      }

      this.dataProvider = ko.computed(() => {
        const pokemonTypes = this.types().reduce((acc, { type }) => {
          const { name } = type;
          return [...acc, { name }]
        }, []);
        return new ArrayDataProvider(pokemonTypes, { keyAttributes: 'name' });
      });

      this.onHandleClick = () => {
        this.router.go('pokemons/');
      }
    }

    return PokemonViewModel;
  }
);