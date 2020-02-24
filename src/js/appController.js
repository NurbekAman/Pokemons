/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
/*
 * Your application specific code will go here
 */
define(['ojs/ojresponsiveutils', 'ojs/ojresponsiveknockoututils', 'knockout', 'ojs/ojmodule-element-utils', 'api', 'ojs/ojknockout', 'ojs/ojmodule-element'],
  function(ResponsiveUtils, ResponsiveKnockoutUtils, ko, moduleUtils, api) {
     function ControllerViewModel() {
       var self = this;

      // Media queries for repsonsive layouts
      var smQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
      self.smScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);

      // Header
      // Application Name used in Branding Area
      self.appName = ko.observable("App Name");
      // User Info used in Global Navigation area
      self.userLogin = ko.observable("john.hancock@oracle.com");

      self.selectedPokemonId = ko.observable();
      self.showTable = ko.observable(true);
      self.pokemonList = ko.observable([]);
      self.backToTable = ko.observable(false);

      const getPokemons = async () => {
        try {
          const pokemons = await api.getPokemons();
          self.pokemonList(pokemons);
        } catch (err) {

        }
      };
      self.moduleConfig = ko.computed(() => {
        if (self.showTable()) {
          return moduleUtils.createConfig({ name: 'table', params: { pokemonList: self.pokemonList(), selectPokemonId: self.selectedPokemonId } });
        } else {
          const selectedId = self.selectedPokemonId();
          const pokemonData = self.pokemonList().find(({ id }) => id == selectedId);
          return moduleUtils.createConfig({ name: 'pokemonDetails', params: { pokemon: pokemonData, backToTable: self.backToTable } })
        }
      });

      ko.computed(() => {
         const selectedId = self.selectedPokemonId();
         const isBackToTable = self.backToTable();
         if (selectedId) {
            self.showTable(false);
            self.backToTable(false);
         }

         if (selectedId && isBackToTable) {
           self.showTable(true);
           self.selectedPokemonId(null);
         }
      });

      getPokemons();

      // Footer
      function footerLink(name, id, linkTarget) {
        this.name = name;
        this.linkId = id;
        this.linkTarget = linkTarget;
      }
      self.footerLinks = ko.observableArray([
        new footerLink('About Oracle', 'aboutOracle', 'http://www.oracle.com/us/corporate/index.html#menu-about'),
        new footerLink('Contact Us', 'contactUs', 'http://www.oracle.com/us/corporate/contact/index.html'),
        new footerLink('Legal Notices', 'legalNotices', 'http://www.oracle.com/us/legal/index.html'),
        new footerLink('Terms Of Use', 'termsOfUse', 'http://www.oracle.com/us/legal/terms/index.html'),
        new footerLink('Your Privacy Rights', 'yourPrivacyRights', 'http://www.oracle.com/us/legal/privacy/index.html')
      ]);
     }

     return new ControllerViewModel();
  }
);
