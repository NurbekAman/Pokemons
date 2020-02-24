define([], function() {
  self.getPokemonTypesCount = function(types) {
    const countType = [];

    function calcCount(typeList) {
      if (!typeList.length) {
        return;
      }

      const { type } = typeList[0];
      const others = typeList.filter(({ type: { name } }) => name !== type.name);

      if (others.length) {
        const sameCount =Math.abs(typeList.length - others.length);

        countType.push({ name: type.name, count: sameCount });

        return calcCount(others);
      } else {
        countType.push({ name: type.name, count: typeList.length });

        return;
      }
    }

    calcCount(types);

    return countType;
  }

  return { getPokemonTypesCount: getPokemonTypesCount };
});