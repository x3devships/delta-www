/**
 * Make sure there's no duplicated address in the address map.
 */
export const verifyAddressMap = addressMap => {
  const values = Object.values(addressMap);
  const findDuplicated = values =>
    values.filter((item, index) => values.indexOf(item) !== index);
  const duplicatedAddress = findDuplicated(values);

  if (duplicatedAddress.length !== 0) {
    throw new Error(
      `Duplicates found in the address map: ${duplicatedAddress.join(', ')}`
    );
  }
};
