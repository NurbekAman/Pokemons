define(['knockout', 'ojs/ojlabel', 'ojs/ojinputtext'],
  function(ko) {
    function PokemonViewModel(data) {
      const { pokemon, backToTable } = data;

      this.isChecked = 'checked';
      this.weight = pokemon.weight;
      this.height = pokemon.height;
      this.name = pokemon.name;

      this.onHandleClick = () => {
        backToTable(true);
      }
    }

    return PokemonViewModel;
  }
);