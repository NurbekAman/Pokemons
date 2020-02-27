define(function() {
  const getPokemonTypesCount = (types) => {
    const countType = [];

    function distributeTypes(typeList) {
      if (!typeList.length) {
        return;
      }

      const { type } = typeList[0];
      const others = typeList.filter(({ type: { name } }) => name !== type.name);

      if (others.length) {
        const countSameTypes = Math.abs(typeList.length - others.length);

        countType.push({ name: type.name, count: countSameTypes });

        return distributeTypes(others);
      } else {
        countType.push({ name: type.name, count: typeList.length });

        return;
      }
    }

    distributeTypes(types);

    return countType;
  }

  const convertTypesToString = (types) => types.reduce((acc, { type: { name } }, index) => {
    if (index === types.length - 1) {
      return acc + name;
    }

    return acc + name + ', '
  }, '')

  const getTableData = (pokemons) => {
    return pokemons.map((pokemon) => {
      const { id, name, weight, height, moves, types } = pokemon;

      return {
        isChecked: false,
        id,
        name,
        height,
        weight,
        numberOfMoves: moves.length ? moves.length : 0,
        types: types.length ?  convertTypesToString(types) : '',
      };
    })
  }


  return {
    getPokemonTypesCount,
    getTableData,
  };
});