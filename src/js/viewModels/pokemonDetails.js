define(['knockout', 'ojs/ojlabel', 'ojs/ojinputtext'],
  function(ko) {
    function PokemonViewModel(data) {
      const { pokemon, backToTable } = data;
      const self = this;

      self.isChecked = 'checked';
      self.weight = pokemon.weight;
      self.height = pokemon.height;
      self.name = pokemon.name;

      self.onHandleClick = () => {
        backToTable(true);
      }
    }

    return PokemonViewModel;
  }
);