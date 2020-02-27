define(['ojs/ojresponsiveutils', 'ojs/ojresponsiveknockoututils', 'knockout', 'ojs/ojknockout-keyset','ojs/ojmodule-element-utils', 'api', 'ojs/ojknockout', 'ojs/ojmodule-element', 'ojs/ojprogress'],
  function(ResponsiveUtils, ResponsiveKnockoutUtils, ko, KeySet, moduleUtils, api) {
     function ControllerViewModel() {
      // Media queries for repsonsive layouts
      var smQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
      this.smScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);

      this.appName ='Pokemons';
      // selected pockemon id for pokemon details
      this.selectedPokemonId = ko.observable({});
      // array of the pokemons from server
      this.pokemonList = ko.observable([]);
      // array of pokemons forms for getting images
      this.pokemonsForm = ko.observable([]);
      // array of selected pokemons
      this.selectedPokemons = new KeySet.ObservableKeySet();
      // need to indicate current model
      this.showPokemons = ko.observable(true);
      // this.backToTable = ko.observable(false);
      this.loading = ko.observable(false);
      // error
      this.error = ko.observable('');

      ko.computed(async () => {
        try {
          this.loading(true);
          const data = await api.fetchPokemons();
          this.pokemonList(data);
        } catch (err) {
          this.error('something wrong on the server, please reload page');
        } finally {
          this.loading(false);
        }
      });

      ko.computed(async () => {
        const pokemonList = this.pokemonList();
        if (pokemonList.length) {
          const data = await api.fetchPokemonImages(pokemonList);
          this.pokemonsForm(data);
        }
      });

      this.moduleConfig = ko.computed(() => {
        if (this.showPokemons()) {
          return moduleUtils.createConfig({
            name: 'pokemons',
            params: {
              pokemonList: this.pokemonList(),
              selectPokemonId: this.selectedPokemonId,
              selectedPokemons: this.selectedPokemons,
              showPokemons: this.showPokemons
            }
          });
        } else {
          const { id: selectedId, isChecked } = this.selectedPokemonId();
          const pokemonData = this.pokemonList().find(({ id }) => id == selectedId);
          // array of pokemon's form
          const pokemonForm = this.pokemonsForm().find(({ id }) => id == selectedId);

          return moduleUtils.createConfig({
            name: 'pokemonDetails',
            params: {
              pokemonData,
              pokemonForm,
              showPokemons: this.showPokemons,
              isChecked
            }
          });
        }
      });
    }

     return new ControllerViewModel();
  }
);
