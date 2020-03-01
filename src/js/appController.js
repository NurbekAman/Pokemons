define(['ojs/ojrouter', 'ojs/ojresponsiveutils', 'ojs/ojresponsiveknockoututils', 'knockout', 'ojs/ojknockout-keyset','ojs/ojmodule-element-utils', 'api', 'ojs/ojknockout', 'ojs/ojmodule-element', 'ojs/ojprogress', 'ojs/ojurlparamadapter'],
  function(Router, ResponsiveUtils, ResponsiveKnockoutUtils, ko, KeySet, moduleUtils, api) {
      function ControllerViewModel() {
      // Media queries for repsonsive layouts
      var smQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
      this.smScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);

      this.appName ='Pokemons';
      // array of the pokemons from server
      this.pokemonList = ko.observable([]);
      // array of selected pokemons
      this.selectedPokemons = new KeySet.ObservableKeySet();
      this.loading = ko.observable(false);
      // error
      this.error = ko.observable('');

      this.router = Router.rootInstance;
      Router.defaults['urlAdapter'] = new Router.urlParamAdapter();
      this.router.configure({
        'pokemons': { label: 'Pokemons', value: 'pokemons', isDefault: true },
        'pokemonDetails/{pokemonId}/{isChecked}': { label: 'Pokemon details', value: 'pokemonDetails' }
      });

      this.moduleConfig = ko.pureComputed(() => {
        const name = this.router.moduleConfig.name();

        return moduleUtils.createConfig({
          name: name,
          params: {
            parentRouter: this.router,
            pokemonList: this.pokemonList(),
            selectedPokemons: name === 'pokemons' ? this.selectedPokemons : undefined
          }
        })
      });

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
    }

     return new ControllerViewModel();
  }
);
